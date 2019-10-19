import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Tooltip } from '.';
import { withKnobs, select, text, boolean } from '@storybook/addon-knobs';
import { centered } from '../StorybookAddons';
import ReactTooltip from 'react-tooltip';

storiesOf('Tooltip', module)
    .addDecorator(withKnobs)
    .addDecorator(centered)
    .add('full', () => {
        const knobContent = text('Content Text', '(∩｀-´)⊃━☆ﾟ.*･｡ﾟ');
        const knobPlace = select(
            'Place',
            { Top: 'top', Right: 'right', Left: 'left', Bottom: 'bottom' },
            'top'
        ) as ReactTooltip.Place;
        const knobEffect = select('Effect', { Float: 'float', Solid: 'solid' }, 'float') as ReactTooltip.Effect;
        const knobEvent = select('Event', { None: '', Click: 'click' }, '') as ReactTooltip.ElementEvents;
        const knobType = select(
            'Type',
            { Dark: 'dark', Light: 'light', Success: 'success', Warning: 'warning', Error: 'error', Info: 'info' },
            'light'
        ) as ReactTooltip.Type;
        const knobBorder = boolean('Border?', true);
        const knobTooltipClass = text('Tooltip Class', 'tooltip__default');

        return (
            <Tooltip
                id={'tooltip-1'}
                content={knobContent}
                place={knobPlace}
                effect={knobEffect}
                event={knobEvent}
                type={knobType}
                border={knobBorder}
                tooltipClassName={knobTooltipClass}
            >
                <div>Hover over me!</div>
            </Tooltip>
        );
});