import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { NavigationPage } from '.';
import {withKnobs, number, text} from '@storybook/addon-knobs';


storiesOf('Navigation page', module)
    .addDecorator(withKnobs)
    .add('show navigation page', () => (
        <NavigationPage navHeaderText={text('Header text', 'navigation header')} maxLevel={number('Max level', 6)}>
	        <a>test</a>
	        <div>
	            <a>test 2</a>
	            <div>
	                <a>test 3</a>
	            </div>
	        </div>
	    </NavigationPage>
    ));