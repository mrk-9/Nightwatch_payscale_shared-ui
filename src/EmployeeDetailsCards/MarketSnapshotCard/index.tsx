import * as React from 'react';
import DetailsCard from '../common/DetailsCard';
import { FormattedCurrency, CurrencyFormatFunc } from '../common/FormattedCurrency';
import strings from './strings';
import './style/index.scss';
import { FormatOptions } from '../../CurrencyUtils';

export interface MarketSnapshotCardProps {
    currency?: string;                        // ISO 4217 currency code for all values
    marketBaseSalary25th?: number;            // 25th percentile salary value
    marketBaseSalary50th?: number;            // 50th percentile salary value
    marketBaseSalary75th?: number;            // 75th percentile salary value
    marketTotalCash25th?: number;             // 25th percentile total comp value
    marketTotalCash50th?: number;             // 50th percentile total comp value
    marketTotalCash75th?: number;             // 75th percentile total comp value
    currencyFormatter?: CurrencyFormatFunc;   // (optional) currency formatting helper
}

// Card component which displays table of market data on salary and TCC
export class MarketSnapshotCard extends React.PureComponent<MarketSnapshotCardProps, {}> {
    private readonly _percentiles: string[];

    constructor(props: MarketSnapshotCardProps) {
        super(props);

        // initialize in constructor to allow for string override
        this._percentiles = [
            strings.percentile25th,
            strings.percentile50th,
            strings.percentile75th
        ];
    }

    // Helper for consumers to check if the component can display this data
    static isValidData(
        marketBaseSalary25th: number,
        marketBaseSalary50th: number,
        marketBaseSalary75th: number,
        marketTotalCash25th: number,
        marketTotalCash50th: number,
        marketTotalCash75th: number): boolean {

        const hasSalary = MarketSnapshotCard._hasValidValues([
            marketBaseSalary25th,
            marketBaseSalary50th,
            marketBaseSalary75th]);
        const hasTotalCash = MarketSnapshotCard._hasValidValues([
            marketTotalCash25th,
            marketTotalCash50th,
            marketTotalCash75th]);

        return hasSalary && hasTotalCash;
    }

    render(): JSX.Element {

        const {
            currency,
            marketBaseSalary25th,
            marketBaseSalary50th,
            marketBaseSalary75th,
            marketTotalCash25th,
            marketTotalCash50th,
            marketTotalCash75th,
            currencyFormatter } = this.props;

        // If nothing to display, display nothing
        if (!MarketSnapshotCard.isValidData(
            marketBaseSalary25th,
            marketBaseSalary50th,
            marketBaseSalary75th,
            marketTotalCash25th,
            marketTotalCash50th,
            marketTotalCash75th)) {
            return null;
        }

        const totalCashComp = [marketTotalCash25th, marketTotalCash50th, marketTotalCash75th];
        const basePay = [marketBaseSalary25th, marketBaseSalary50th, marketBaseSalary75th];

        return (
            <DetailsCard
                className="market-snapshot-card"
                title={strings.cardTitle}
            >
                {this._renderTable(totalCashComp, basePay, currency, currencyFormatter)}
                <div className="market-snapshot-card__description">
                    {strings.description}
                </div>
            </DetailsCard>
        );
    }

    // Returns true iff all values in array are valid/non-null
    private static _hasValidValues(values: number[]): boolean {
        return values.reduce((acc, val) => acc || val == null, false) === false;
    }

    private _renderTable(
        totalCashComp: number[],
        basePay: number[],
        currency: string,
        currencyFormatter: CurrencyFormatFunc): JSX.Element {

        // Round all values to whole numbers
        const formatOptions: FormatOptions = {
            fractionalDigits: 0
        };

        return (
            <div className="market-snapshot-card__table-container">
                <table className="market-snapshot-card__table">
                    <thead>
                        <tr>
                            <th />
                            <th>{strings.tccHeader}</th>
                            <th>{strings.basePayHeader}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this._percentiles.map((percentile, i) =>
                            <tr className="market-snapshot-card__table-row" key={percentile}>
                                <td className="percentile">
                                    {percentile}
                                </td>
                                <td className="tcc">
                                    <FormattedCurrency
                                        val={totalCashComp[i]}
                                        currency={currency}
                                        formatFunc={currencyFormatter}
                                        options={formatOptions}
                                    />
                                </td>
                                <td className="base-pay">
                                    <FormattedCurrency
                                        val={basePay[i]}
                                        currency={currency}
                                        formatFunc={currencyFormatter}
                                        options={formatOptions}
                                    />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default MarketSnapshotCard;