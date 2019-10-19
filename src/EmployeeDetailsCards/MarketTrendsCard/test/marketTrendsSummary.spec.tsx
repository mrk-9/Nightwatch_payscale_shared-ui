import * as React from 'react';
import { shallow, mount } from 'enzyme';
import MarketTrendsSummary from '../marketTrendsSummary';

describe('MarketTrendsSummary', () => {
    const trendChange = { changeAmount: 10, changePercent: 10, date: '2017-09-28T07:00:00Z' };

    const dateFormatter = (date: string, formatStr: string) => date;
    it('should render job title', () => {
        const title = 'Barista';
        const el = shallow(
            <MarketTrendsSummary
                currency="EUR"
                trendChange={trendChange}
                jobTitle={title}
                dateFormatter={dateFormatter}
            />
        );

        const jobTitle = el.find('.market-trends-card__summary__job-title');
        expect(jobTitle.text()).toContain(title);
    });

    it('should display trend change percentage correctly', () => {
        const el = mount(
            <MarketTrendsSummary
                currency="EUR"
                trendChange={trendChange}
                jobTitle="Barista"
                dateFormatter={dateFormatter}
            />
        );

        const averagePercent = el.find('.market-trends-card__summary__value-percent');
        expect(averagePercent.text()).toBe('10%');
        el.unmount();
    });

    it('should display trend change amount correctly', () => {
        // We need to do this because those Euros don't use a negative sign,
        // they just put brackets around it. IE follows this practice, other
        // browsers force them to use the correct American standard.
        // PS Celsius sucks
        const el = mount(
            <MarketTrendsSummary
                currency="EUR"
                trendChange={trendChange}
                jobTitle="Barista"
                dateFormatter={dateFormatter}
            />
        );

        const changeAmount = el.find('.market-trends-card__summary__value-actual');
        expect(changeAmount.text()).toBe('10.00');
        el.unmount();
    });
});