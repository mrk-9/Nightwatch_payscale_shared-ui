import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { TotalCashCompensationCard } from '.';
import {withKnobs, number, object, text} from '@storybook/addon-knobs';

const totalCashCompensation = 50000;
const currency = 'NZD';
const totalCashCompensationList = [
    { label: 'Base Salary', value: 122000 },
    { label: 'Variable', value: 6000 },
    { label: 'Commission', value: 0 }
];
const companyContributionsList = [
    { label: 'Bonus', value: 5698 }
];
const uncalculatedBenefitsList = [
    { label: 'Vacation & Sick', value: 3676 },
    { label: 'Personal', value: 6923 },
    { label: 'Holidays', value: 1966 }
];

storiesOf('Employee Details - Total cash compensation card', module)
    .addDecorator(withKnobs)
    .add('empty cash compensation card', () => (
        <TotalCashCompensationCard
            currency={text('currency', currency)}
            totalCashCompensation={number('Total cash compensation', totalCashCompensation)}
            totalCashCompensationList={object('Total cash compensation list', [])}
            companyContributionsList={object('Company contribution list', [])}
            uncalculatedBenefitsList={object('Uncalculated benefits list', [])}
        />
    ))
    .add('cash compensation card', () => (
        <TotalCashCompensationCard
            currency={text('currency', currency)}
            totalCashCompensation={number('Total cash compensation', totalCashCompensation)}
            totalCashCompensationList={object('Total cash compensation list', totalCashCompensationList)}
            companyContributionsList={object('Company contribution list', companyContributionsList)}
            uncalculatedBenefitsList={object('Uncalculated benefits list', uncalculatedBenefitsList)}
        />
    ));