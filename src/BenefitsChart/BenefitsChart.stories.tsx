import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { BenefitsChart, BenefitDetailsItem } from '.';
import {withKnobs, object, number} from '@storybook/addon-knobs';

const initialProps = {
  totalCashCompensation: [
    { label: 'Base Salary', value: 122000 },
    { label: 'Variable', value: 6000 },
    { label: 'Commission', value: 0 }
  ],
  uncalculatedBenefits: [
    { label: 'Vacation & Sick', value: 3676 },
    { label: 'Personal', value: 6923 },
    { label: 'Holidays', value: 1966 }
  ]
};
const initialCompanyContributions: BenefitDetailsItem[] = [];

storiesOf('Benefits Card', module)
    .addDecorator(withKnobs)
    .add('tcc only', () => (
        <BenefitsChart {...initialProps} companyContributions={initialCompanyContributions} />
    ))
    .add('with company contributions', () => {
      const companyContributions = [
          { label: 'Medical', value: 7564 },
          { label: 'Dental & Vision', value: 890 },
          { label: 'Life & ADD', value: 300 }
        ];
      const height = number('height', 350);
      const companyContributionsData = object('companyContributions', companyContributions);
      const totalCashCompensationData = object('totalCashCompensation', initialProps.totalCashCompensation);

      return (
        <BenefitsChart
          companyContributions={companyContributionsData}
          totalCashCompensation={totalCashCompensationData}
          uncalculatedBenefits={initialProps.uncalculatedBenefits}
          height={height}
        />
      );
    });