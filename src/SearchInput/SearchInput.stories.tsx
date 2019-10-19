import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { SearchInput } from '.';
import {withKnobs, text} from '@storybook/addon-knobs';

storiesOf('Search input', module)
    .addDecorator(withKnobs)
    .add('search input without placeholder', () => (
        <SearchInput 
            inputRole={text('Role', 'some role')}
        />
    ))
    .add('search input with placeholder', () => (
        <SearchInput 
            inputRole={text('Role', 'some role')}
            placeholderText={text('Placeholder', 'Placeholder text')}
        />
    ));