import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Link } from '.';

const linkText = 'PayScale';

storiesOf('Link', module)
    .add('with href and text', () => (
        <Link history={null} href="https://www.payscale.com">{linkText}</Link>
    ));