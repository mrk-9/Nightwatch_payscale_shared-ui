import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { MarketTrendsCard } from '.';
import { MarketTrendsChart } from './marketTrendsChart';
import { MarketTrendsSummary } from './marketTrendsSummary';
import {withKnobs, text, object} from '@storybook/addon-knobs';

const dateFormatter = (dateStr: string, formatStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1} ${date.getFullYear()}`;
};

const jobTitle = 'Developer';
const currency = 'EUR';

const marketTrendsCardData = [
    {
        endDateUtc: '2016-07-28T07:00:00Z',
        currencyName: 'Euro (EUR)',
        currencyFormat: '&euro;{#}',
        medianAnnualBasePay: 100
    },
    {
        endDateUtc: '2016-10-28T07:00:00Z',
        currencyName: 'Euro (EUR)',
        currencyFormat: '&euro;{#}',
        medianAnnualBasePay: 105
    },
    {
        endDateUtc: '2017-01-28T08:00:00Z',
        currencyName: 'Euro (EUR)',
        currencyFormat: '&euro;{#}',
        medianAnnualBasePay: 103
    },
    {
        endDateUtc: '2017-04-28T07:00:00Z',
        currencyName: 'Euro (EUR)',
        currencyFormat: '&euro;{#}',
        medianAnnualBasePay: 102
    },
    {
        endDateUtc: '2017-07-28T07:00:00Z',
        currencyName: 'Euro (EUR)',
        currencyFormat: '&euro;{#}',
        medianAnnualBasePay: 109
    }
];

const trendData = [
    { changeAmount: 0, changePercent: 0, date: '2016-09-28T07:00:00Z' },
    { changeAmount: 4, changePercent: 4, date: '2016-12-28T08:00:00Z' },
    { changeAmount: 4, changePercent: 4, date: '2017-03-28T07:00:00Z' },
    { changeAmount: 10, changePercent: 10, date: '2017-06-28T07:00:00Z' },
    { changeAmount: 10, changePercent: 10, date: '2017-09-28T07:00:00Z' }
];

const trendChange = { changeAmount: 10, changePercent: 10, date: '2017-09-28T07:00:00Z' };

storiesOf('Employee Details - Market trends', module)
    .addDecorator(withKnobs)
    .add('show market trends card', () => (
        <MarketTrendsCard
            jobTitle={text('Job title', jobTitle)}
            marketTrends={object('Market treads data', marketTrendsCardData)}
            dateFormatter={dateFormatter}
        />
    ))
    .add('show market trends chart', () => (
        <MarketTrendsChart
            trendPercentages={object('Market trend', trendData)}
            dateFormatter={dateFormatter}
        />
    ))
    .add('show market trends summary', () => (
        <MarketTrendsSummary
            currency={text('Currency', currency)}
            trendChange={object('Trend change', trendChange)}
            jobTitle={text('Job title', jobTitle)}
            dateFormatter={dateFormatter}
        />
    ));