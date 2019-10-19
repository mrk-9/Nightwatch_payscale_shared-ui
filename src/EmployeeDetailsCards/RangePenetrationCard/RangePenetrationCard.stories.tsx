import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { RangePenetrationCard } from '.';
import {withKnobs, boolean, text, number} from '@storybook/addon-knobs';

const currency = 'CAD'

storiesOf('Employee Details - Range peneration card', module)
    .addDecorator(withKnobs)
    .add('range penetration card for hourly pay and range is annual', () => (
        <RangePenetrationCard
            pay={number('Pay', 15)}
            isHourlyPay={boolean('Hourly pay', true)}
            currency={text('Currency', currency)}
            rangeMin={number('Range min', 10 * 2080)}
            rangeMax={number('Range max', 20 * 2080)}
        />
    ))
    .add('range penetration card for annual pay and range is hourly', () => (
        <RangePenetrationCard
            pay={number('Pay', 15 * 2080)}
            isHourlyPay={boolean('Hourly pay', false)}
            currency={text('Currency', currency)}
            rangeMin={number('Range min', 10)}
            rangeMax={number('Range max', 20)}
            isHourlyRange={boolean('Hourly range', true)}
        />
    ));