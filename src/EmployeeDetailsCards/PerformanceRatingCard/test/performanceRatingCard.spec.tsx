import * as React from 'react';
import { shallow } from 'enzyme';
import PerformanceRatingCard from '../index';
import strings from '../../../Strings';
import { moduleName } from '../strings';

describe('PerformanceRatingCard', () => {
    const firstName = 'April';
    const performanceRating = 'Meets expectation';

    it ('should render when performanceRating is passed', () => {
        const performanceCard = shallow(
            <PerformanceRatingCard
                firstName={firstName}
                performanceRating={performanceRating}
            />
        );

        expect(performanceCard.find('.perf-rating-card__rating').text()).toBe(performanceRating);
    });

    it ('should not render when performanceRating is not passed', () => {
        const performanceCard = shallow(
            <PerformanceRatingCard
                firstName={firstName}
            />
        );
        expect(performanceCard.isEmptyRender()).toBe(true);
    });

    it ('should not render when performanceRating is null', () => {
        const performanceCard = shallow(
            <PerformanceRatingCard
                firstName={firstName}
                performanceRating={null}
            />
        );
        expect(performanceCard.isEmptyRender()).toBe(true);
    });

    it ('should replace employee first name with backup text if it\'s null', () => {
        const performanceCard = shallow(
            <PerformanceRatingCard
                firstName={null}
                performanceRating={performanceRating}
            />
        );

        const perfDescription = performanceCard.find('.perf-rating-card__description');
        expect(perfDescription.text()).toContain(strings[moduleName].thisEmployee);
    });
});
