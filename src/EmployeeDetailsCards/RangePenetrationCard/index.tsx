import * as React from 'react';
import strings from './strings';
import { FormattedCurrency, CurrencyFormatFunc } from '../common/FormattedCurrency';
import DetailsCard from '../common/DetailsCard';
import { buildClassString } from '../../StringUtils';
import { normalizePayRange, PayRange } from '../common/Helpers';
import './style/index.scss';

export interface RangePenetrationCardProps {
    pay: number;                               // EE's pay -- houlry rate if hourly,
                                               // or salary, if salaried
    currency: string;                          // currency in which EE is paid
    isHourlyPay?: boolean;                     // whether or not EE's pay is hourly
    rangeMax: number;                          // max value of EE's pay range
    rangeMin: number;                          // min value of EE's pay range
    isHourlyRange?: boolean;                   // whether or not range is hourly or annualized
    currencyFormatter?: CurrencyFormatFunc;    // (optional) formatter for currency display
}

// Card component which displays EE's penetration into their pay range -- gives a
// visual of where their pay falls within the min and max of the range, as well as the
// actual min and max values
export class RangePenetrationCard extends React.PureComponent<RangePenetrationCardProps, {}> {
    render(): JSX.Element {
        const { pay, rangeMin, rangeMax } = this.props;

        const hasPay = pay != null;
        const hasValidData = rangeMin != null && rangeMax != null;

        // these two values are mutually exclusive, based on how EE is paid
        const penetrationValue = hasPay ? this._getRangePenPercentage() : 0;
        const labelRight = penetrationValue < 50; // whether label is to right of thumb
        const positionStyle = this._computeLabelPositionStyle(penetrationValue, labelRight);

        const vizClass = buildClassString({
            'range-pen-card__viz': true,
            'invalid': !hasValidData,
            'hide-thumb': !hasPay || !hasValidData
        });
        return (
            <DetailsCard
                className="range-pen-card"
                title={strings.cardTitle}
            >
                <div className="range-pen-card__blurb">
                    {strings.blurb}
                </div>
                <div className={vizClass}>
                    <div className="range-pen-card__viz-bar-container">
                        <div className="range-pen-card__viz-bar">
                            <div
                                data-mf-replace-inner="***"
                                className="range-pen-card__viz-thumb-label"
                                style={positionStyle}
                            >
                                {penetrationValue}%
                            </div>
                        </div>
                        <div className="range-pen-card__viz-thumb-container" style={positionStyle}>
                            <div className="range-pen-card__viz-thumb-hack">
                                <div className="range-pen-card__viz-thumb" />
                            </div>
                        </div>
                    </div>
                    {this._renderVizLabels()}
                </div>
            </DetailsCard>
        );
    }

    // Computes percentage penetration into range, from 0-100 (vs 0 - 1.0)
    private _getRangePenPercentage(): number {
        const {
            pay,
            isHourlyPay,
            rangeMin,
            rangeMax,
            isHourlyRange
        } = this.props;

        const payRange = normalizePayRange(pay, isHourlyPay, rangeMin, rangeMax, isHourlyRange);
        const range = payRange.rangeMax - payRange.rangeMin;
        if (range === 0 || !pay) {
            return 0;
        }

        return Math.round((pay - payRange.rangeMin) / range * 100);
    }

    // returns a CSS style dictionary for the display of the rangeVizThumb based on the
    // penetration value and desired label position
    private _computeLabelPositionStyle(penetrationValue: number, positionRight: boolean): React.CSSProperties {
        const pinnedPenetrationValue = Math.max(0, Math.min(penetrationValue, 100));
        return {
            left: `${pinnedPenetrationValue}%`,
            transform: positionRight ? undefined : 'translateX(-100%)'
        } as React.CSSProperties;
    }

    private _renderVizLabels(): JSX.Element {
        const {
            pay,
            isHourlyPay,
            rangeMin,
            rangeMax,
            isHourlyRange,
            currency,
            currencyFormatter } = this.props;

        const payRange: PayRange = normalizePayRange(pay, isHourlyPay, rangeMin, rangeMax, isHourlyRange);
        const hasRange = payRange.rangeMin != null && payRange.rangeMax != null;
        return (
            <div className="range-pen-card__range-labels">
                <div className="range-pen-card__range-min">
                    <span>
                        {strings.min}
                        &nbsp;
                        {
                            hasRange &&
                            <FormattedCurrency
                                val={payRange.rangeMin}
                                currency={currency}
                                formatFunc={currencyFormatter}
                            />
                        }
                    </span>
                </div>
                <div className="range-pen-card__range-max">
                    <span>
                        {strings.max}
                        &nbsp;
                        {
                            hasRange &&
                            <FormattedCurrency
                                val={payRange.rangeMax}
                                currency={currency}
                                formatFunc={currencyFormatter}
                            />
                        }
                    </span>
                </div>
            </div>
        );
    }
}

export default RangePenetrationCard;