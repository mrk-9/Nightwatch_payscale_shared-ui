import * as React from 'react';
import strings from './strings';
import { FormattedCurrency, CurrencyFormatFunc } from '../common/FormattedCurrency';
import DetailsCard from '../common/DetailsCard';
import LabeledValue from '../common/LabeledValue';
import './style/index.scss';

export interface CompensationCardProps {
    pay: number;                               // EE's pay -- houlry rate if hourly,
                                               // or salary, if salaried
    hourly?: boolean;                          // whether or not EE's pay is hourly
    currency: string;                          // currency EE is paid in
    payEffectiveDate?: string;                 // date EE's current pay went into effect
    currencyFormatter?: CurrencyFormatFunc;    // (optional) function for formatting currencies
    dateFormatter: (date: string, formatString: string) => string;    // function to format date values
}

// Card component which displays employee's current compensation (pay)
export const CompensationCard = (props: CompensationCardProps): JSX.Element => {
    const {
        pay,
        currency,
        hourly,
        payEffectiveDate,
        dateFormatter,
        currencyFormatter } = props;

    // whether we have a valid pay value for EE
    const hasValue = pay != null;

    // Compute text to display as effective pay date
    const effectiveDateText = hasValue ?
        (payEffectiveDate ?
            (
                <div className="compensation-card__effective-date">
                    {strings.payEffectiveDate}<br />
                    {dateFormatter(payEffectiveDate, 'MMM Do, YYYY')}
                </div>
            ) :
            null) :
        <span>{strings.noPayData}</span>;

    // Display hourly or annual pay value, or 'N/A' text if missing
    const value = hasValue ?
        (
            <div className="compensation-card__amount">
                <FormattedCurrency
                    val={pay}
                    currency={currency}
                    formatFunc={currencyFormatter}
                    sensitiveValue={true}
                />
                {hourly ? ` ${strings.perHour}` : ''}
            </div>
        ) :
        (
            <div className="compensation-card__amount">
                <span>{strings.notApplicable}</span>
            </div>
        );

    return (
        <DetailsCard
            className="compensation-card"
            title={strings.cardTitle}
        >
            <LabeledValue
                label={effectiveDateText}
                value={value}
            />
        </DetailsCard>
    );
};

export default CompensationCard;