import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { PayHistoryBarChartCard } from '.';
import {withKnobs, number, text, object} from '@storybook/addon-knobs';

const currency = 'CAD';
const salary = 85000;
const payEffectiveDate = '2019-06-05T00:00:00Z';

const ascendingDataPoints = [
    { baseSalary: 20000, createdAt: '2018-06-05T00:00:00Z' },
    { baseSalary: 10000, createdAt: '2017-06-05T00:00:00Z' },
    { baseSalary: 30000, createdAt: '2019-06-05T00:00:00Z' }
];

const descendingDataPoints = [
    { baseSalary: 40000, createdAt: '2019-06-05T00:00:00Z' },
    { baseSalary: 50000, createdAt: '2019-05-05T00:00:00Z' },
    { baseSalary: 60000, createdAt: '2019-04-05T00:00:00Z' }
];

storiesOf('Employee Details - Pay history bar chart card', module)
    .addDecorator(withKnobs)
    .add('Show basic salary only', () => (
        <PayHistoryBarChartCard
            currency={text('currency', currency)}
            baseSalary={number('Base salary', salary)}
            payEffectiveDate={text('Pay effective date', payEffectiveDate)}
        />
    ))
    .add('Pay history ascending bar chart card', () => (
        <PayHistoryBarChartCard
            currency={text('currency', currency)}
            baseSalary={number('Base salary', salary)}
            payEffectiveDate={text('Pay effective date', payEffectiveDate)}
            historyDataPoints={object('Data points', ascendingDataPoints)}
        />
    ))
    .add('Pay history descending bar chart card', () => (
        <PayHistoryBarChartCard
            currency={text('currency', currency)}
            baseSalary={number('Base salary', salary)}
            payEffectiveDate={text('Pay effective date', payEffectiveDate)}
            historyDataPoints={object('Data points', descendingDataPoints)}
        />
    ));