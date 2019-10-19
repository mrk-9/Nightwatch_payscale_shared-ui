import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { PayHistorySummaryCard } from '.';
import {withKnobs, object, text} from '@storybook/addon-knobs';

const employeeName = 'John Doe';
const currency = 'USD';
const increasedPayHistoryData = [
    { baseSalary: 1, createdAt: '2015-06-05T00:00:00Z' },
    { baseSalary: 5, createdAt: '2019-06-05T00:00:00Z' },
    { baseSalary: 2, createdAt: '2016-06-05T00:00:00Z' },
    { baseSalary: 4, createdAt: '2018-06-05T00:00:00Z' },
    { baseSalary: 3, createdAt: '2017-06-05T00:00:00Z' }
];
const decreasedPayHistoryData = [
    { baseSalary: 2, createdAt: '2019-06-05T00:00:00Z' },
    { baseSalary: 1, createdAt: '2018-06-05T00:00:00Z' },
    { baseSalary: 3, createdAt: '2017-06-05T00:00:00Z' }
];

storiesOf('Employee Details - Pay history summary card', module)
    .addDecorator(withKnobs)
    .add('Empty pay history summary', () => (
        <PayHistorySummaryCard
            employeeName={text('Employee name', employeeName)}
            currency={text('Currency', currency)}
        />
    ))
    .add('Pay history summary increased ', () => (
        <PayHistorySummaryCard
            employeeName={text('Employee name', employeeName)}
            currency={text('Currency', currency)}
            historyDataPoints={object('Pay history data', increasedPayHistoryData)}
        />
    ))
    .add('Pay history summary decreased', () => (
        <PayHistorySummaryCard
            employeeName={text('Employee name', employeeName)}
            currency={text('Currency', currency)}
            historyDataPoints={object('Pay history data', decreasedPayHistoryData)}
        />
    ));