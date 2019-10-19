import * as React from 'react';
import DetailsCard from '../common/DetailsCard';
import BarChart, { BarProps } from '../../BarChart';
import { formatCurrency } from '../../CurrencyUtils';
import './style/index.scss';
import dayjs from 'dayjs';

export interface PayHistoryDataPoint {
    baseSalary: number;
    createdAt: string;
}

export interface PayHistoryBarChartCardProps {
    currency: string;
    baseSalary: number;
    payEffectiveDate: string;
    historyDataPoints?: PayHistoryDataPoint[];
    maxDataPoints?: number; // Defaults to 5
}

export class PayHistoryBarChartCard extends React.PureComponent<PayHistoryBarChartCardProps, {}> {
    render(): JSX.Element {
        return (
            <DetailsCard className="pay-history-bar-chart-card">
                <div className="pay-history-bar-chart-card__viz">
                    <BarChart
                        bars={this._getBarsForChart()}
                        minBarHeight={1}
                        minBars={3}
                        showDeltaTooltip={true}
                    />
                </div>
            </DetailsCard>
        );
    }

    private _getBarsForChart(): BarProps[] {
        const { historyDataPoints, baseSalary, payEffectiveDate, maxDataPoints } = this.props;

        if (!historyDataPoints || historyDataPoints.length === 0) {
            return [this._getBar(baseSalary, payEffectiveDate)];
        }

        let tempDataPoints = historyDataPoints;
        // Make sure data is sorted by createdAt ascending
        tempDataPoints.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));

        tempDataPoints = tempDataPoints.slice(-(maxDataPoints || 5));

        return tempDataPoints.map(d => this._getBar(d.baseSalary, d.createdAt));
    }

    private _getBar(val: number, date: string): BarProps {
        const { currency } = this.props;

        return {
            value: val,
            axisLabel: dayjs(date).format('MM/YY'),
            label: formatCurrency(val, currency, { abbreviate: true, fractionalDigits: 1, showDecimalZeros: false })
        };
    }
}

export default PayHistoryBarChartCard;