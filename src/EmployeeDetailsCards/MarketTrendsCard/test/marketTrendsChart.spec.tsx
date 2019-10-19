import * as React from 'react';
import { shallow, mount } from 'enzyme';
import BarChart from '../../../BarChart';
import MarketTrendsChart from '../marketTrendsChart';
import { computeTrendValues } from '../index';

const data = [
    /* tslint:disable */
    {endDateUtc: '2016-07-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 100},

    {endDateUtc: '2016-10-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 103},

    {endDateUtc: '2017-01-28T08:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 103},

    {endDateUtc: '2017-04-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 109},

    {endDateUtc: '2017-07-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 109},
    /* tslint:enable */
];

describe('MarketTrendsChart', () => {
    const dateFormatter = (dateStr: string, formatStr: string) => {
        const date = new Date(dateStr);
        return `${date.getMonth() + 1} ${date.getFullYear()}`;
    };
    const trendData = [
        { changeAmount: 0, changePercent: 0, date: '2016-09-28T07:00:00Z' },
        { changeAmount: 4, changePercent: 4, date: '2016-12-28T08:00:00Z' },
        { changeAmount: 4, changePercent: 4, date: '2017-03-28T07:00:00Z' },
        { changeAmount: 10, changePercent: 10, date: '2017-06-28T07:00:00Z' },
        { changeAmount: 10, changePercent: 10, date: '2017-09-28T07:00:00Z' }
    ];

    it('should render', () => {
        const el = shallow(
            <MarketTrendsChart
                trendPercentages={trendData}
                dateFormatter={dateFormatter}
            />
        );
        expect(el.find(BarChart).length).toBe(1);
    });

    it('should render at most 4 bars', () => {
        const el = shallow(
            <MarketTrendsChart
                trendPercentages={trendData}
                dateFormatter={dateFormatter}
            />
        );
        expect(el.find(BarChart).at(0).props().bars.length).toBe(4);
    });

    it('should render grid lines', () => {
        const el = shallow(
            <MarketTrendsChart
                trendPercentages={trendData}
                dateFormatter={dateFormatter}
            />
        );
        expect(el.find(BarChart).at(0).props().showGridLines).toBe(true);
    });

    it('should render quant axis', () => {
        const el = shallow(
            <MarketTrendsChart
                trendPercentages={trendData}
                dateFormatter={dateFormatter}
            />
        );
        expect(el.find(BarChart).at(0).props().showQuantAxis).toBe(true);
    });

    it('should format quant axis labels correctly', () => {
        // note: '+2.5%'' is in here twice as one is the spacer used by axis
        // to allocate space
        const expectedLabels = ['+2.5%', '+10%', '+7.5%', '+5%', '+2.5%', '0%'];
        const el = mount(
            <MarketTrendsChart
                trendPercentages={trendData}
                dateFormatter={dateFormatter}
            />
        );
        const quantLabels = el.find(BarChart)
            .find('.barchart__quant-axis .barchart__quant-axis-label').map(label => label.text());
        expect(quantLabels).toEqual(expectedLabels);
        el.unmount();
    });

    it('should render x-axis dates correctly (sorted oldest to newest)', () => {
        const el = shallow(
            <MarketTrendsChart
                trendPercentages={trendData}
                dateFormatter={dateFormatter}
            />
        );

        const catLabels = el.find(BarChart).at(0).props().bars.map(bar => bar.axisLabel);
        expect(catLabels).toEqual(['12 2016', '3 2017', '6 2017', '9 2017']);
    });

    it('should no longer trim data from the current quarter', () => {
        const dataWithCurrentQuarter = [
            ...data,
            {
                endDateUtc: '2017-10-28T07:00:00Z',
                currencyName: 'Euro (EUR)',
                currencyFormat: '&euro;{#}',
                medianHourlyRate: 25,
                medianAnnualBasePay: 51000
            }
        ];

        const trendDataWithCurrentQuarter = computeTrendValues(dataWithCurrentQuarter);
        const el = shallow(
            <MarketTrendsChart
                trendPercentages={trendDataWithCurrentQuarter}
                dateFormatter={dateFormatter}
            />
        );
        const catLabels = el.find(BarChart).at(0).props().bars.map(bar => bar.axisLabel);
        expect(catLabels).toEqual(['1 2017', '4 2017', '7 2017', '10 2017']);
    });
});