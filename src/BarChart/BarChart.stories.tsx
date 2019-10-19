import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { BarChart, BarProps } from '.';
import {withKnobs, number, object, boolean, select} from '@storybook/addon-knobs';

storiesOf('BarChart', module)
    .addDecorator(withKnobs)
    .add('simple', () => {
        const defaultBars: BarProps[] = [
            {value: 10, label: '', axisLabel: 'Bar 1', className: ''},
            {value: 20, label: '', axisLabel: 'Bar 2', className: ''},
            {value: 30, label: '', axisLabel: 'Bar 3', className: ''},
            {value: 40, label: '', axisLabel: 'Bar 4', className: ''}
        ];

        const knobHeight = number('Height', 200);
        const knobBars = object('Bars', defaultBars);

        return (
            <div style={{height: knobHeight}}>
                <BarChart bars={knobBars} />
            </div>
        );
    })
    .add('full', () => {
        const defaultBars: BarProps[] = [
            {value: 10, label: '', axisLabel: 'Bar 1', className: ''},
            {value: 20, label: '', axisLabel: 'Bar 2', className: ''},
            {value: 30, label: '', axisLabel: 'Bar 3', className: ''},
            {value: 40, label: '', axisLabel: 'Bar 4', className: ''}
        ];

        const knobHeight = number('Height', 200);
        const knobShowGridLines = boolean('Show Grid Lines?', true);
        const knobShowQuantAxis = boolean('Show Quant Axis?', true);
        const knobVerticalBarChart = boolean('Vertical Bar Chart?', false);
        const knobBars = object('Bars', defaultBars);
        const knobMinBarHeight = number('Min Bar Height', 1);
        const knobMinBars = number('Min Bars', 0);
        const knobMinBarLoc = select('Min Bar Loc', { Left: 'left', Right: 'right' }, 'left') as 'left' | 'right';
        const knobShowTooltip = boolean('Show Tooltip?', true);

        return (
            <div style={{height: knobHeight}}>
                <BarChart
                    bars={knobBars}
                    showGridLines={knobShowGridLines}
                    showQuantAxis={knobShowQuantAxis}
                    verticalBarChart={knobVerticalBarChart}
                    minBars={knobMinBars}
                    minBarLoc={knobMinBarLoc}
                    minBarHeight={knobMinBarHeight}
                    showDeltaTooltip={knobShowTooltip}
                />
            </div>
        );
    });