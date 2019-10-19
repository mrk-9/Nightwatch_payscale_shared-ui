import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from '@storybook/react/demo';
import { EmployeeDetailsCard } from '../src/EmployeeDetailsCards';
import { Link } from '../src/Link';

const dateOfHire = '2014-10-11';
const id = 453636;
const location = 'PayScale World HQ';
const manager = 'Esteban';
const email = 'esteban@www.underpaid.com';
const department = 'Product';

const linkText = 'foo';

storiesOf('EmployeeDetailsCard', module)
    .add('with text', () => (
        <Button>Hello Button</Button>
    ))
    .add('with Link', () => (
        <Link history={null}>{linkText}</Link>    
    ))
    .add('with EmployeeDetailsCard', () => (
        <EmployeeDetailsCard
            employeeId={id}
            dateOfHire={dateOfHire}
            managerName={manager}
            department={department}
            email={email}
            workLocation={location}
        />
    ));
