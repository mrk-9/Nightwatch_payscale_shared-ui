import * as React from 'react';
import { shallow } from 'enzyme';
import { MarketTrendsCard, computeTrendValues, parseCurrencyCode } from '../index';
import MarketTrendsChart from '../marketTrendsChart';
import MarketTrendsSummary from '../marketTrendsSummary';

const data = [
    /* tslint:disable */
    {endDateUtc: '2016-07-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 100},

    {endDateUtc: '2016-10-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 105},

    {endDateUtc: '2017-01-28T08:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 103},

    {endDateUtc: '2017-04-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 102},

    {endDateUtc: '2017-07-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 109},
    /* tslint:enable */
];

describe('MarketTrendsCard', () => {
    const dateFormatter = (date: string, formatStr: string) => date.toString();
    describe('job title', () => {
        it ('card should not render when null', () => {
            const el = shallow(
                <MarketTrendsCard
                    jobTitle={null}
                    marketTrends={data}
                    dateFormatter={dateFormatter}
                />
            );

            expect(el.isEmptyRender()).toBe(true);
        });

        it ('card should not render when undefined', () => {
            const el = shallow(
                <MarketTrendsCard
                    marketTrends={data}
                    dateFormatter={dateFormatter}
                />
            );

            expect(el.isEmptyRender()).toBe(true);
        });
    });

    describe('marketTrends', () => {
        it('should not render when trend data is null', () => {
            const el = shallow(
                <MarketTrendsCard
                    jobTitle="foo"
                    marketTrends={null}
                    dateFormatter={dateFormatter}
                />
            );

            expect(el.isEmptyRender()).toBe(true);
        });

        it('should not render when trend data is undefined', () => {
            const el = shallow(
                <MarketTrendsCard
                    jobTitle="foo"
                    dateFormatter={dateFormatter}
                />
            );

            expect(el.isEmptyRender()).toBe(true);
        });

        it('should not render when there is only 1 data point', () => {
            const el = shallow(
                <MarketTrendsCard
                    jobTitle="foo"
                    marketTrends={[
                        {
                            endDateUtc: new Date('10/1/2016').toDateString(),
                            currencyName: 'USD',
                            currencyFormat: '${0}',
                            medianHourlyRate: 15,
                            medianAnnualBasePay: null
                        }
                    ]}
                    dateFormatter={dateFormatter}
                />
            );

            expect(el.isEmptyRender()).toBe(true);
        });
    });

    describe('summary', () => {
        it('should render market trends summary', () => {
            const el = shallow(
                <MarketTrendsCard
                    jobTitle={'Colon Hydrotherapist'}
                    marketTrends={data}
                    dateFormatter={dateFormatter}
                />
            );
            expect(el.find(MarketTrendsSummary).length).toBe(1);
        });
    });

    describe('chart', () => {
        it('should render market trends chart', () => {
            const el = shallow(
                <MarketTrendsCard
                    jobTitle={'Colon Hydrotherapist'}
                    marketTrends={data}
                    dateFormatter={dateFormatter}
                />
            );
            expect(el.find(MarketTrendsChart).length).toBe(1);
        });
    });

    describe('Compute Trend Values', () => {
        it('should handle an all positive increase', () => {
            const results = computeTrendValues(data);
            expect(results.map(t => t.changePercent)).toEqual([0, 5, 3, 2, 9]);
        });

        it('should handle an all negative trend', () => {
            const negativeData = [
                /* tslint:disable */
                {endDateUtc: '2016-07-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 100},

                {endDateUtc: '2016-10-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 96},

                {endDateUtc: '2017-01-28T08:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 96},

                {endDateUtc: '2017-04-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 89},

                {endDateUtc: '2017-07-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 89},
                /* tslint:enable */
             ];

            const results = computeTrendValues(negativeData);
            expect(results.map(t => t.changePercent)).toEqual([0, -4, -4, -11, -11]);
        });

        it('should handle both but ending positive', () => {
            const negativeData = [
                /* tslint:disable */
                {endDateUtc: '2016-07-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 100},

                {endDateUtc: '2016-10-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 96},

                {endDateUtc: '2017-01-28T08:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 106},

                {endDateUtc: '2017-04-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 89},

                {endDateUtc: '2017-07-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 109},
                /* tslint:enable */
                ];
            expect(computeTrendValues(negativeData).map(t => t.changePercent)).toEqual([0, -4, 6, -11, 9]);
        });

        it('should handle being exactly flat', () => {
            const flatData = [
                /* tslint:disable */
                {endDateUtc: '2016-07-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 100},

                {endDateUtc: '2016-10-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 100},

                {endDateUtc: '2017-03-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 100},

                {endDateUtc: '2017-04-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 100},

                {endDateUtc: '2017-07-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 100},
                /* tslint:enable */
                ];
            expect(computeTrendValues(flatData).map(t => t.changePercent)).toEqual([0, 0, 0, 0, 0]);
        });

        it('should handle no data', () => {
            expect(computeTrendValues([]).map(t => t.changePercent)).toEqual([]);
        });

        it('it should handle not enough for a single quarter', () => {
            const oneQuarter = [
                /* tslint:disable */
                {endDateUtc: '2016-07-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 100},
                /* tslint:enable */
                ];
            expect(computeTrendValues(oneQuarter).map(t => t.changePercent)).toEqual([0]);
        });

        it('it should handle a base quarter of one', () => {
            const oneQuarter = [
                /* tslint:disable */
                {endDateUtc: '2016-07-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 100},
                {endDateUtc: '2016-10-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 105}
                /* tslint:enable */
                ];
            expect(computeTrendValues(oneQuarter).map(t => t.changePercent)).toEqual([0, 5]);
        });

        it('it should handle a base quarter having a pay of zero', () => {
            const oneQuarter = [
                /* tslint:disable */
                {endDateUtc: '2016-07-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 0},
                {endDateUtc: '2016-10-28T07:00:00Z', currencyName: 'Euro (EUR)', currencyFormat: '&euro;{#}', medianAnnualBasePay: 100}
                /* tslint:enable */
                ];
            expect(computeTrendValues(oneQuarter).map(t => t.changePercent)).toEqual([]);
        });
    });

    describe('parseCurrencyCode', () => {
        it('should extract currency code from a string in the format "Full name (ABC)"', () => {
            expect(parseCurrencyCode('US Dollar (USD)')).toBe('USD');
        });

        it('should return the string that was given if it is not in the format "Full name (ABC)"', () => {
            expect(parseCurrencyCode('USD')).toBe('USD');
        });

        it('should return null if the currency string is null', () => {
            expect(parseCurrencyCode(null)).toBe(null);
        });
    });
});
