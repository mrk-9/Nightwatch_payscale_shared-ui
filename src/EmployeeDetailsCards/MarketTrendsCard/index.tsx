import * as React from 'react';
import DetailsCard from '../common/DetailsCard';
import { CurrencyFormatFunc } from '../common/FormattedCurrency';
import MarketTrendsChart from './marketTrendsChart';
import MarketTrendsSummary from './marketTrendsSummary';
import strings from './strings';

// Market trends data is monthly. Each item represents the new market
// base pay or hourly rate for a job for that month.
export interface MarketTrend {
    endDateUtc?: string;            // Date of pay data sample
    currencyName?: string;          // ISO 4217 currency code
    currencyFormat?: string;        // Currently unused
    medianHourlyRate?: number;      // if this position is hourly, median hourly pay
    medianAnnualBasePay?: number;   // if this position is annual, median annual pay
}

export interface MarketTrendsCardProps {
    currencyFormatter?: CurrencyFormatFunc;                        // (optional) function to format currency for display
    dateFormatter: (date: string, formatString: string) => string; // function to format dates for display
    jobTitle?: string;                                             // title for which this trend data is for
    marketTrends?: MarketTrend[];                                  // pay trend data for job
}

export interface MarketTrendChange {
    date: string;            // date of change
    changeAmount: number;    // absolute change from reference data point
    changePercent: number;   // percent change from reference data point
}

// Returns a sorted copy of the data in ascending date order
const sortDataByDateAscending = (data: MarketTrend[]): MarketTrend[] =>
    data
        .slice()
        .sort((a, b) => {
            const dateA = new Date(a.endDateUtc);
            const dateB = new Date(b.endDateUtc);
            return dateA.getTime() - dateB.getTime();
        });

// Given a list of market trend values at a given set of dates, transforms into a list
// of deltas (both % and absolute) from the first date.  The first entry will have a delta
// of zero (since it's equal to itself) and each subsequent entry will be compared to the first
// element, NOT the one before it.
export const computeTrendValues = (data: MarketTrend[]): MarketTrendChange[] => {
    const sortedData = sortDataByDateAscending(data);

    // Grab the first quarter since we'll treat that as the base for growth
    const baseQuarter = sortedData.splice(0, 1)[0];

    // Specifically checking this to avoid division by 0
    // This shouldn't happen in any sane universe but welp
    // Future enhancement: Try pushing back further to an newer base quarter.
    // Not worth it right now because I don't think this is realistically gonna
    // happen.
    if (baseQuarter == null || baseQuarter.medianAnnualBasePay === 0) {
        return [];
    }

    // Compare each quarter in the list against the base quarter that was the
    // first element in the array
    const trendValues = sortedData
        .map(quaterData => {
            const delta = quaterData.medianAnnualBasePay - baseQuarter.medianAnnualBasePay;
            return {
                changeAmount: delta,
                changePercent: delta / baseQuarter.medianAnnualBasePay * 100,
                date: quaterData.endDateUtc
            } as MarketTrendChange;
        });

    // add reference element to start of array to include date
    trendValues.unshift({
        changeAmount: 0,
        changePercent: 0,
        date: baseQuarter.endDateUtc
    } as MarketTrendChange);

    return trendValues;
};

// TODO: has tests in mx
export const parseCurrencyCode = (currency: string): string => {
    // The currency that comes back from the server can be in the format:
    // "US Dollar (USD)", but the part we care about is in the parens.
    // This captures the 3 character code if it's in this format, otherwise
    // just use the whole string.
    const currencyRegex = /\((.*)\)$/;
    return currencyRegex.test(currency) ?
        currencyRegex.exec(currency)[1] :
        currency;
};

// Card component which displays the market rate trend for the specified job
// Displays as a bar chart showing up to 4 quarters of data as a percentage change from
// five quarters ago (or however much data is present)
export class MarketTrendsCard extends React.PureComponent<MarketTrendsCardProps, {}> {

    static isValidData(jobTitle: string, marketTrends: MarketTrend[]): boolean {
        return !!jobTitle &&
            marketTrends &&
            marketTrends.length > 1; // need at least 2 data points to calculate trends
    }

    render(): JSX.Element {
        const {
            jobTitle,
            marketTrends,
            currencyFormatter,
            dateFormatter } = this.props;

        if (!MarketTrendsCard.isValidData(jobTitle, marketTrends)) {
            return null;
        }

        const trendPercentages = computeTrendValues(marketTrends);

        return (
            <DetailsCard
                className="market-trends-card"
                title={strings.cardTitle}
            >
                <MarketTrendsSummary
                    jobTitle={jobTitle}
                    trendChange={trendPercentages[trendPercentages.length - 1]}
                    currency={parseCurrencyCode(marketTrends[0].currencyName)}
                    currencyFormatter={currencyFormatter}
                    dateFormatter={dateFormatter}
                />
                {/* slice off the reference date */}
                <MarketTrendsChart
                    trendPercentages={trendPercentages.slice(1)}
                    dateFormatter={dateFormatter}
                />
            </DetailsCard>
        );
    }
}

export default MarketTrendsCard;
