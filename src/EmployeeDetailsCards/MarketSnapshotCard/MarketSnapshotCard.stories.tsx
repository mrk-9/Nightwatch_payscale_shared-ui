import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { MarketSnapshotCard } from '.';
import { withKnobs, text, number } from '@storybook/addon-knobs';

const currency = 'USD';
const marketBaseSalary25th = 1234;
const marketBaseSalary50th = 2345;
const marketBaseSalary75th = 3456;
const marketTotalCash25th = 12345;
const marketTotalCash50th = 23456;
const marketTotalCash75th = 34567;

storiesOf('Employee Details - Market snapshot card', module)
    .addDecorator(withKnobs)
    .add('Market snapshot', () => (
        <MarketSnapshotCard
          currency={text('Currency', currency)}
          marketBaseSalary25th={number('Market base salary 25th', marketBaseSalary25th)}
          marketBaseSalary50th={number('Market base salary 50th', marketBaseSalary50th)}
          marketBaseSalary75th={number('Market base salary 75th', marketBaseSalary75th)}
          marketTotalCash25th={number('Market total cash 25th', marketTotalCash25th)}
          marketTotalCash50th={number('Market total cash 50th', marketTotalCash50th)}
          marketTotalCash75th={number('Market total cash 75th', marketTotalCash75th)} />
    ));