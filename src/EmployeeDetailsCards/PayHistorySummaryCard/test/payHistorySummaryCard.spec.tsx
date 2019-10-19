import * as React from 'react';
import { shallow } from 'enzyme';
import PayHistorySummaryCard from '..';

describe('PayHistorySummaryCard', () => {
    let oldIntl: {};
    beforeEach(() => {
        // ensure intl is null for test stability
        oldIntl = (window as any).Intl; // tslint:disable-line no-any
        (window as any).Intl = null;    // tslint:disable-line no-any
    });

    afterEach(() => {
        (window as any).Intl = oldIntl;    // tslint:disable-line no-any
    });

    it('should render an empty state', () => {
        const result = shallow(
            <PayHistorySummaryCard  employeeName={'Tester McTesterson'} currency={'USD'} />
        );

        const description = result.find('.pay-history-summary-card__description');
        expect(description.length).toBe(1);
        expect(description.text()).toEqual('Tester McTesterson does not have any pay history data.');
    });

    it('should render pay history summary for an increase', () => {
        const result = shallow(
            <PayHistorySummaryCard
                employeeName={'Tester McTesterson'}
                currency={'USD'}
                historyDataPoints={[
                    { baseSalary: 3, createdAt: '2019-06-05T00:00:00Z' },
                    { baseSalary: 2, createdAt: '2018-06-05T00:00:00Z' },
                    { baseSalary: 1, createdAt: '2017-06-05T00:00:00Z' }
                ]}
            />
        );

        const description = result.find('.pay-history-summary-card__description');
        expect(description.length).toBe(1);
        expect(description.text()).toEqual(
            'Tester McTesterson\'s pay increased from 1.00 to 3.00 in the last 2 years.'
        );

        const percentageDescription = result.find('.pay-history-summary-card__percentage-description');
        expect(percentageDescription.length).toBe(1);
        expect(percentageDescription.text()).toEqual('This is an increase of');

        const percentage = result.find('.pay-history-summary-card__percentage');
        expect(percentage.length).toBe(1);
        expect(percentage.text()).toEqual('200%');
    });

    it('should render pay history summary for a decrease', () => {
        const result = shallow(
            <PayHistorySummaryCard
                employeeName={'Tester McTesterson'}
                currency={'USD'}
                historyDataPoints={[
                    { baseSalary: 2, createdAt: '2019-06-05T00:00:00Z' },
                    { baseSalary: 1, createdAt: '2018-06-05T00:00:00Z' },
                    { baseSalary: 3, createdAt: '2017-06-05T00:00:00Z' }
                ]}
            />
        );

        const description = result.find('.pay-history-summary-card__description');
        expect(description.length).toBe(1);
        expect(description.text()).toEqual(
            'Tester McTesterson\'s pay decreased from 3.00 to 2.00 in the last 2 years.'
        );

        const percentageDescription = result.find('.pay-history-summary-card__percentage-description');
        expect(percentageDescription.length).toBe(1);
        expect(percentageDescription.text()).toEqual('This is a decrease of');

        const percentage = result.find('.pay-history-summary-card__percentage');
        expect(percentage.length).toBe(1);
        expect(percentage.text()).toEqual('-33.3%');
    });

    it('should sort data points', () => {
        const result = shallow(
            <PayHistorySummaryCard
                employeeName={'Tester McTesterson'}
                currency={'USD'}
                historyDataPoints={[
                    { baseSalary: 1, createdAt: '2015-06-05T00:00:00Z' },
                    { baseSalary: 5, createdAt: '2019-06-05T00:00:00Z' },
                    { baseSalary: 2, createdAt: '2016-06-05T00:00:00Z' },
                    { baseSalary: 4, createdAt: '2018-06-05T00:00:00Z' },
                    { baseSalary: 3, createdAt: '2017-06-05T00:00:00Z' }
                ]}
            />
        );

        const description = result.find('.pay-history-summary-card__description');
        expect(description.length).toBe(1);
        expect(description.text()).toEqual(
            'Tester McTesterson\'s pay increased from 1.00 to 5.00 in the last 4 years.'
        );

        const percentageDescription = result.find('.pay-history-summary-card__percentage-description');
        expect(percentageDescription.length).toBe(1);
        expect(percentageDescription.text()).toEqual('This is an increase of');

        const percentage = result.find('.pay-history-summary-card__percentage');
        expect(percentage.length).toBe(1);
        expect(percentage.text()).toEqual('400%');
    });
});