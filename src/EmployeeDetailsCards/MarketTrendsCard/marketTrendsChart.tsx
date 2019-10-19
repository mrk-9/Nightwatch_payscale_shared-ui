import * as React from 'react';
import BarChart from '../../BarChart';
import { MarketTrendChange } from './index';
import './style/marketTrendsChart.scss';

export interface MarketTrendsChartProps {
    trendPercentages: MarketTrendChange[];
    dateFormatter: (date: string, formatString: string) => string;
}

const barCount = 4;
const formatAxisVal = (val: number, defaultFormatFunc: Function): string => {
    return `${val <= 0 ? '' : '+'}${defaultFormatFunc(val)}%`;
};

const MarketTrendsChart = (props: MarketTrendsChartProps): JSX.Element => {
    const { dateFormatter, trendPercentages } = props;

    // make sure we only render desired # of bars
    const barData = trendPercentages.slice(-barCount);
    const bars = barData.map(data => ({
        axisLabel: dateFormatter(data.date, 'MMM YY'),
        value: data.changePercent,
        className: data.changePercent < 0 ? 'negative' : null
    }));

    return (
        <div className="market-trends-card__chart">
            <BarChart
                bars={bars}
                showQuantAxis={true}
                showGridLines={true}
                quantAxisFormatFunc={formatAxisVal}
            />
        </div>
    );
};

export { MarketTrendsChart };
export default MarketTrendsChart;