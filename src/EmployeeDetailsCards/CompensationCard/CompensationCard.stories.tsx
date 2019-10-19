import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { CompensationCard } from '.';
import {withKnobs, number, boolean, text, date} from '@storybook/addon-knobs';

const dateFormatter = (date: string, formatStr: string): string => date;

storiesOf('Employee Details - Compensation Card', module)
    .addDecorator(withKnobs)
    .add('show compensation', () => (
      <CompensationCard
        currency={text('currency', 'USD')}
        pay={number('pay', 50)}
        hourly={boolean('hourly', true)}
        dateFormatter={dateFormatter} />
    ))
    .add('show compensation with pay effective date', () => (
      <CompensationCard
        currency={text('currency', 'USD')}
        pay={number('pay', 50)}
        hourly={boolean('hourly', true)}
        payEffectiveDate={text('date', new Date().toDateString())}
        dateFormatter={dateFormatter} />
    ))
    .add('show no pay message', () => (
      <CompensationCard
        pay={null}
        currency={text('currency', 'USD')}
        dateFormatter={dateFormatter} />
    ));