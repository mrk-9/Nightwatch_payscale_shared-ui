import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { NavigationItem } from '.';
import {withKnobs} from '@storybook/addon-knobs';


storiesOf('Navigation item', module)
    .addDecorator(withKnobs)
    .add('show navigation item', () => (
        <NavigationItem title="Test" active={true}>
            <span>Test 1</span>
        </NavigationItem>
    ));