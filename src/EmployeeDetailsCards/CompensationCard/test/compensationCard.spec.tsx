import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import strings from '../strings';
import FormattedCurrency from '../../common/FormattedCurrency';
import EmployeeCompensationCard from '../index';

describe('EmployeeCompensationCard', () => {
    let mountedComponent: ReactWrapper = null;
    const dateFormatter = (date: string, formatStr: string): string => date;

    afterEach(() => {
        if (mountedComponent) {
            mountedComponent.unmount();
            mountedComponent = null;
        }
    });

    it('should show base salary if given', () => {
        mountedComponent = mount(
            <EmployeeCompensationCard
                pay={12345}
                currency={'USD'}
                payEffectiveDate={new Date().toDateString()}
                dateFormatter={dateFormatter}
            />);
        const amount = mountedComponent.find('.compensation-card__amount');
        expect(amount.length).toEqual(1);
        expect(amount.at(0).text()).not.toContain(strings.perHour);
    });

    it('should show hourly rate if given', () => {
        mountedComponent = mount(
            <EmployeeCompensationCard
                currency={'USD'}
                pay={50}
                hourly={true}
                payEffectiveDate={new Date().toDateString()}
                dateFormatter={dateFormatter}
            />);

        const amount = mountedComponent.find('.compensation-card__amount');
        expect(amount.length).toEqual(1);
        expect(amount.at(0).text()).toContain(strings.perHour);
    });

    it('should show pay effective date if given', () => {
        mountedComponent = mount(
            <EmployeeCompensationCard
                pay={12345}
                currency={'USD'}
                payEffectiveDate={new Date().toDateString()}
                dateFormatter={dateFormatter}
            />);

        expect(mountedComponent.find('.compensation-card__effective-date').length).toEqual(1);
    });

    it('should not show pay effective date if not given', () => {
        mountedComponent = mount(
            <EmployeeCompensationCard
                pay={12345}
                currency={'USD'}
                payEffectiveDate={null}
                dateFormatter={dateFormatter}
            />);

        expect(mountedComponent.find('.compensation-card__effective-date').length).toEqual(0);
    });

    it('should not show not applicable value if pay not given', () => {
        mountedComponent = mount(
            <EmployeeCompensationCard
                pay={null}
                currency={'USD'}
                dateFormatter={dateFormatter}
            />);

        expect(mountedComponent.find('.compensation-card__amount').text()).toBe(strings.notApplicable);
    });

    it('should show no pay message if pay not given', () => {
        mountedComponent = mount(
            <EmployeeCompensationCard
                pay={null}
                currency={'USD'}
                dateFormatter={dateFormatter}
            />);

        expect(mountedComponent.text()).toContain(strings.noPayData);
    });

    it('should flag value as sensitive', () => {
        mountedComponent = mount(
            <EmployeeCompensationCard
                pay={12345}
                currency={'USD'}
                payEffectiveDate={new Date().toDateString()}
                dateFormatter={dateFormatter}
            />);
        expect(mountedComponent.find(FormattedCurrency).props().sensitiveValue).toBe(true);
    });
});