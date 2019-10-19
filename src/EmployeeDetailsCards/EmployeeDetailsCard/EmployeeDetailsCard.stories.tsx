import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { EmployeeDetailsCard } from '.';
import {withKnobs, text} from '@storybook/addon-knobs';

const dateOfHire = '2018-07-20';
const employeeId = '6789';
const location = 'Mars';
const manager = 'Mr. Doe';
const email = 'john@underpaid.com';
const department = 'classified';
const formatFunc = (hireDate: string, formatStr: string): string => hireDate;

storiesOf('Employee Details - Employees Details Card', module)
    .addDecorator(withKnobs)
    .add('Show employee card', () => (
        <EmployeeDetailsCard 
          dateOfHire={text('Date of hire', dateOfHire)}
          email={text('Email', email)}
          managerName={text('Manager', manager)}
          workLocation={text('Location', location)}
          employeeId={text('Employee id', employeeId)}
          department={text('Department', department)}
          dateFormatter={formatFunc} />
    ));