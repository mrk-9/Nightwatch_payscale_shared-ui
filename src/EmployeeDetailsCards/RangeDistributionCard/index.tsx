import * as React from 'react';
import DetailsCard from '../common/DetailsCard';
import BarChart from '../../BarChart';
import { replaceTokens } from '../../StringUtils';
import { normalizePayRange, PayRange } from '../common/Helpers';

import strings from './strings';
import './style/index.scss';

export interface RangeDistributionCardProps {
    employeeName?: string;        // (first) name of employee for display purposes
    rangeDistribution?: number[]; // distribution(count) of company's EEs into range buckets defined below
    rangeMin?: number;            // minimum value of EE's pay range
    rangeMax?: number;            // maximum value of EE's pay range
    isHourlyRange?: boolean;      // whether or not range is hourly or annualized
    pay?: number;                 // EE's pay value (either hourly rate or salary)
    isHourlyPay?: boolean;        // whether or not EE's pay is hourly or annualized
}

// Subdivide pay range into 5 segments:
//  * below the range min
//  * in the bottom quarter of range
//  * in middle half (25%-75%) of range
//  * in top quarter of range
//  * avove range max
export const enum RangePosition {
    Below = 0,
    Bottom,
    Middle,
    Top,
    Above,
    Unknown
}

// Card component for displaying distribution of company's employees within their respective
// pay ranges, as well as where this employee falls in their own
export class RangeDistributionCard extends React.PureComponent<RangeDistributionCardProps, {}> {
    private static _positionStrings: string[];

    constructor(props: RangeDistributionCardProps) {
        super(props);

        // build this 'dynamically' in constructor vs defining as const variable above
        // to allow for overloading of the strings
        RangeDistributionCard._positionStrings = RangeDistributionCard._positionStrings ||
            [
                strings.below,
                strings.bottom,
                strings.middle,
                strings.top,
                strings.above
            ];
    }

    // Helper method for consumers to know if component can display anything
    // meaningful with these values
    static isValidData(rangeMin: number, rangeMax: number, value: number): boolean {
        return rangeMin != null && rangeMax != null && value != null;
    }

    // Given EE's pay, and the range min+max, determine which
    // third-ile they fall into, or whether they're above/below range
    // !!! public only for testing purposes
    static _computeRangePosition(basePay: number, rangeMin: number, rangeMax: number): RangePosition {
        if (basePay === null || rangeMin === null || rangeMax === null) {
            return RangePosition.Unknown;
        }

        if (basePay < rangeMin) {
            return RangePosition.Below;
        } else if (basePay > rangeMax) {
            return RangePosition.Above;
        }

        const oneQuarterRange = (rangeMax - rangeMin) / 4;
        // If no range (min === max), return 'middle'
        const whichQuarter = (oneQuarterRange === 0) ?
            2 :
            Math.floor((basePay - rangeMin) / oneQuarterRange) + 1;

        if (whichQuarter === 1) {
            return RangePosition.Bottom;
        } else if (whichQuarter === 2 || whichQuarter === 3) {
            return RangePosition.Middle;
        } else {
            return RangePosition.Top;
        }
    }

    render(): JSX.Element {
        const {
            pay,
            isHourlyPay,
            rangeMin,
            rangeMax,
            isHourlyRange,
            employeeName,
            rangeDistribution } = this.props;

        if (!RangeDistributionCard.isValidData(rangeMin, rangeMax, pay)) {
            return null;
        }

        const normalizedRange: PayRange = normalizePayRange(pay, isHourlyPay, rangeMin, rangeMax, isHourlyRange);
        const rangePosition = RangeDistributionCard._computeRangePosition(
            pay,
            normalizedRange.rangeMin,
            normalizedRange.rangeMax);

        // can't render anything meaningful if we don't know the employee's position
        if (rangePosition == null || rangePosition === RangePosition.Unknown) {
            return null;
        }

        // can only render viz if we have both employee position and range distribution
        const canRenderViz = rangeDistribution && rangeDistribution.length > 0;

        return (
            <DetailsCard className="range-dist_card" title={strings.cardTitle}>
                {canRenderViz && this._renderRangeDistributionViz(rangePosition, rangeDistribution)}
                {this._renderRangeDistributionDescription(employeeName, rangePosition, rangeDistribution)}
            </DetailsCard>
        );
    }

    // Given an array of counts of employees in each bucket, returns and array of
    // values representing % of employees in each bucket
    private static _computeCohortPercentages(rangeDistribution: number[]): number[] {
        // range distribution has 6 buckets when we get it -- below range, 0-25%,
        // 25-50%, 50-75%, 75-100%, above range. However, we want to combine the 25-50 and 50-75%
        // segments
        const modifiedDistribution = [
            rangeDistribution[0],
            rangeDistribution[1],
            rangeDistribution[2] + rangeDistribution[3],
            rangeDistribution[4],
            rangeDistribution[5]
        ];

        // range distribution vals are counts of employees in each bucket.  Map
        // to whole-number percentage value
        const totalCount = modifiedDistribution.reduce((val, acc) => acc + val, 0);
        return modifiedDistribution.map(val => totalCount ? Math.round(val / totalCount * 100) : 0);
    }

    private _renderRangeDistributionDescription(
            firstName: string,
            rangePosition: RangePosition,
            rangeValues: number[]): JSX.Element {

        // need to customize text to whether the EE is inside or outside the range
        const outsideRange = rangePosition === RangePosition.Above  || rangePosition === RangePosition.Below;
        const subject = firstName || strings.thisEmployee;
        const part1 = rangeValues ?
            replaceTokens(
                outsideRange ?
                    strings.descriptionOutRange :
                    strings.descriptionInRange,
                subject,
                `${RangeDistributionCard._computeCohortPercentages(rangeValues)[rangePosition]}%`) :
            replaceTokens(
                outsideRange ?
                    strings.descriptionOutRangeSingular :
                    strings.descriptionInRangeSingular,
                subject);

        const part2 = outsideRange ?
            strings.descriptionPositionOutRange :
            strings.descriptionPositionInRange;

        return (
            <div className="range-dist-card__desc">
                <span>{part1}</span>
                <span className="range-dist-card__desc-position">
                    {` ${RangeDistributionCard._positionStrings[rangePosition].toLowerCase()} `}
                </span>
                <span>{part2}</span>
            </div>
        );
    }

    // Renders visual (bar chart) displaying distribution of employees into range
    // distribution 'buckets'
    private _renderRangeDistributionViz(rangePosition: RangePosition, rangeDistribution: number[]): JSX.Element {
        const classNames = [
            'range-dist-card__viz__bar--out-range',
            'range-dist-card__viz__bar--in-range',
            'range-dist-card__viz__bar--in-range',
            'range-dist-card__viz__bar--in-range',
            'range-dist-card__viz__bar--out-range'];

        const rangeValues = RangeDistributionCard._computeCohortPercentages(rangeDistribution);
        const bars = RangeDistributionCard._positionStrings.map((label, index) => {
            const active = index === rangePosition;
            return {
                value: rangeValues[index],
                axisLabel: label,
                className: `${classNames[index]}${active ? '--active' : ''}`,
                label: active ? `${rangeValues[index]}%` : null
            };
        });

        return (
            <div className="range-dist-card__viz">
                <BarChart bars={bars} />
            </div>
        );
    }
}

export default RangeDistributionCard;