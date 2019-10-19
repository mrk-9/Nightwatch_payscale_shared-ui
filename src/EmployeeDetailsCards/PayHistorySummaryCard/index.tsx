import * as React from 'react';
import DetailsCard from '../common/DetailsCard';
import { replaceTokens } from '../../StringUtils';
import { formatCurrency } from '../../CurrencyUtils';
import strings from './strings';
import './style/index.scss';
import { PayHistoryDataPoint } from '../PayHistoryBarChartCard';

export interface PayHistorySummaryCardProps {
    employeeName: string;
    currency: string;
    historyDataPoints?: PayHistoryDataPoint[];
}

export class PayHistorySummaryCard extends React.PureComponent<PayHistorySummaryCardProps, {}> {
    render(): JSX.Element {
        return (
            <DetailsCard className="pay-history-summary-card">
                {this._getSummary()}
            </DetailsCard>
        );
    }

    private _getSummary(): JSX.Element {
        const { employeeName, currency, historyDataPoints } = this.props;

        // Empty state
        if (!historyDataPoints || historyDataPoints.length === 0) {
            return (
                <div className="pay-history-summary-card__description">
                    {replaceTokens(strings.noChange, employeeName)}
                </div>
            );
        }

        // Make sure data is sorted by createdAt ascending
        historyDataPoints.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));

        const firstDataPoint = historyDataPoints[0];
        const lastDataPoint = historyDataPoints[historyDataPoints.length - 1];
        const percentageChange = parseFloat((((lastDataPoint.baseSalary - firstDataPoint.baseSalary)
            / firstDataPoint.baseSalary) * 100).toFixed(1));
        const rangeYears = Math.abs(
            new Date(lastDataPoint.createdAt).getUTCFullYear() - new Date(firstDataPoint.createdAt).getUTCFullYear()
        );

        return (
            <React.Fragment>
                <div className="pay-history-summary-card__description">
                    {replaceTokens(
                        lastDataPoint.baseSalary > firstDataPoint.baseSalary ?
                            strings.descriptionIncrease :
                            strings.descriptionDecrease,
                        employeeName,
                        `${formatCurrency(firstDataPoint.baseSalary, currency)}`,
                        `${formatCurrency(lastDataPoint.baseSalary, currency)}`,
                        rangeYears
                    )}
                </div>
                <div className="pay-history-summary-card__percentage-description">
                    {
                        lastDataPoint.baseSalary > firstDataPoint.baseSalary ?
                            strings.percentageIncrease :
                            strings.percentageDecrease
                    }
                </div>
                <div className="pay-history-summary-card__percentage">{`${percentageChange}%`}</div>
            </React.Fragment>
        );
    }
}

export default PayHistorySummaryCard;