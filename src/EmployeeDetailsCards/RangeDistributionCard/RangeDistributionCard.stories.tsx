import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { RangeDistributionCard } from '.';
import {withKnobs, boolean, object, number} from '@storybook/addon-knobs';

const rangeDistributionOne = [1, 2, 3, 4, 5, 6];
const rangeDistributionTwo = [5, 10, 40, 30, 10, 5];
const rangeMin = 10;
const rangeMax = 100;
const pay = 40;

storiesOf('Employee Details - Range distribution card', module)
    .addDecorator(withKnobs)
    .add('show range distribution hourly', () => (
        <RangeDistributionCard
            rangeDistribution={object('Range distribution', rangeDistributionOne)}
            rangeMin={number('Range min', rangeMin)}
            rangeMax={number('Range max', rangeMax)}
            pay={number('Pay', pay)}
            isHourlyRange={boolean('Is hourly range', true)}
            isHourlyPay={boolean('Is hourly pay', true)}
        />
    ))
    .add('show range distribution annual', () => (
        <RangeDistributionCard
            rangeDistribution={object('Range distribution', rangeDistributionTwo)}
            rangeMin={number('Range min', rangeMin)}
            rangeMax={number('Range max', rangeMax)}
            pay={number('Pay', pay * 2080)}
            isHourlyRange={boolean('Is hourly range', false)}
            isHourlyPay={boolean('Is hourly pay', false)}
        />
    ));