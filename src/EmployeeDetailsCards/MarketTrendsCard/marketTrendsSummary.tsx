import * as React from 'react';
import { FormattedCurrency, CurrencyFormatFunc } from '../common/FormattedCurrency';
import LabeledValue from '../common/LabeledValue';
import { replaceTokens } from '../../StringUtils';
import { MarketTrendChange } from './index';
import strings from './strings';
import './style/marketTrendsSummary.scss';

export interface MarketTrendsSummaryProps {
    currency: string;
    trendChange: MarketTrendChange;
    jobTitle: string;
    currencyFormatter?: CurrencyFormatFunc;
    dateFormatter: (date: string, formatString: string) => string;
}

export const MarketTrendsSummary = (props: MarketTrendsSummaryProps): JSX.Element => {
    const {
        currency,
        trendChange,
        jobTitle,
        dateFormatter,
        currencyFormatter } = props;

    const totalChange = trendChange ? trendChange.changeAmount : 0;
    const totalPercentChange = trendChange ? trendChange.changePercent : 0;
    const referenceDate = trendChange ? trendChange.date : null;
    const formattedDate = dateFormatter(referenceDate, 'MMMM Do, YYYY');

    return (
        <div className="market-trends-card__summary">
            <div className="market-trends-card__summary__job-title">
                {replaceTokens(strings.jobTitleBlurb, jobTitle)}
            </div>
            <LabeledValue
                label={<div className="market-trends-card__summary__date-blurb">
                    {strings.dateRangeBlurb}{' '}
                    <span className="reference-date">{formattedDate}</span>
                </div>}
                value={<div className="market-trends-card__summary__value">
                    <div className="market-trends-card__summary__value-percent">
                        {Math.round(totalPercentChange * 10) / 10}%
                    </div>
                    <div className="market-trends-card__summary__value-actual">
                        <FormattedCurrency
                            val={totalChange}
                            currency={currency}
                            options={{ fractionalDigits: 2 }}
                            formatFunc={currencyFormatter}
                        />
                    </div>
                </div>}
            />
        </div>
    );
};

export default MarketTrendsSummary;