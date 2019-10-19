import * as React from 'react';
import DetailsCard from '../common/DetailsCard';
import { replaceTokens } from '../../StringUtils';
import strings from './strings';
import './style/index.scss';

export interface PerformanceRatingCardProps {
    firstName?: string;            // EE's first name, for display
    performanceRating?: string;    // EE's performance rating value/string/bucket
}

// Card component which displays an employee's performance rating value
export class PerformanceRatingCard extends React.PureComponent<PerformanceRatingCardProps, {}> {
    static isValidData(performanceRating: string): boolean {
        return !!performanceRating;
    }

    render(): JSX.Element {
        const { performanceRating, firstName } = this.props;
        if (!PerformanceRatingCard.isValidData(performanceRating)) {
            return null;
        }

        // if EE's name is missing, use generic 'this employee' text
        const subject = firstName || strings.thisEmployee;

        return (
            <DetailsCard className="perf-rating-card" title={strings.cardTitle}>
                <div className="perf-rating-card__rating">
                    {performanceRating}
                </div>
                <div className="perf-rating-card__description">
                    <span>{replaceTokens(strings.descriptionPrefix, subject)}</span>
                    <span className="perf-rating-card__rating-desc">{` ${performanceRating} `}</span>
                    <span>{strings.descriptionSuffix}</span>
                </div>
            </DetailsCard>
        );
    }
}

export default PerformanceRatingCard;