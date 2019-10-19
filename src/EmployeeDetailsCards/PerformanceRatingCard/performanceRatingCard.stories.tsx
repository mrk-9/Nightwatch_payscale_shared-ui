import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { PerformanceRatingCard } from '.';
import {withKnobs, text} from '@storybook/addon-knobs';

const firstName = 'John Doe';
const performanceRating = 'Meets expectation';

storiesOf('Employee Details - Performance rating card', module)
    .addDecorator(withKnobs)
    .add('show performance rating', () => (
        <PerformanceRatingCard
            firstName={text('First name', firstName)}
            performanceRating={text('Performance rating', performanceRating)}
        />
    ))
    .add('show performance rating without employee name', () => (
        <PerformanceRatingCard
            firstName={null}
            performanceRating={text('Performance rating', performanceRating)}
        />
    ))
    .add('show empty performance rating', () => (
        <PerformanceRatingCard
            firstName={text('First name', firstName)}
            performanceRating={null}
        />
    ));