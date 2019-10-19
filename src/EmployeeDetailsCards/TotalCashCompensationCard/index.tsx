import * as React from 'react';
import { FormattedCurrency, CurrencyFormatFunc } from '../common/FormattedCurrency';
import DetailsCard from '../common/DetailsCard';
import LabeledValue from '../common/LabeledValue';
import strings from './strings';
import { buildClassString } from '../../StringUtils';
import { BenefitsChart, BenefitDetailsItem } from '../../BenefitsChart';
import './style/index.scss';

export interface TotalCashCompensationCardProps {
    currency?: string;                                // currency of comp value
    totalCashCompensation: number;                    // total compensation (base salary + variable)
    currencyFormatter?: CurrencyFormatFunc;           // (optional) formatter to use to display values
    className?: string;                               // (optional) class name to append to card
    benefitsChartHeight?: number;                     // (optional) benefits bar chart height
    totalCashCompensationList: BenefitDetailsItem[];  // total cash items for the employee
    companyContributionsList: BenefitDetailsItem[];   // company contributions benefiting the employee
    uncalculatedBenefitsList: BenefitDetailsItem[];   // benefits provided to the employee that are not used in calcs
}

// Card component which displays user's total cash compensation, with a description of what
// that entails
export const TotalCashCompensationCard = (props: TotalCashCompensationCardProps): JSX.Element => {
    const {
        currency,
        totalCashCompensation,
        currencyFormatter,
        className,
        benefitsChartHeight,
        totalCashCompensationList,
        companyContributionsList,
        uncalculatedBenefitsList
     } = props;

    const totalCashCardClassName = buildClassString({
        'tcc-card': true,
        [className]: !!className
      });
    return (
        <DetailsCard
            className={totalCashCardClassName}
            title={strings.cardTitle}
        >
            <LabeledValue
                label={<div>{strings.description}</div>}
                value={totalCashCompensation ?
                    <FormattedCurrency
                        val={totalCashCompensation}
                        currency={currency}
                        formatFunc={currencyFormatter}
                        sensitiveValue={true}
                    /> :
                    <span>{strings.notApplicable}</span>
                }
            />
            <BenefitsChart
                totalCashCompensation={totalCashCompensationList}
                companyContributions={companyContributionsList}
                uncalculatedBenefits={uncalculatedBenefitsList}
                currency={currency}
                currencyFormatter={currencyFormatter}
                height={benefitsChartHeight}
            />
        </DetailsCard>
    );
};

export default TotalCashCompensationCard;