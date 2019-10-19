import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import TotalCashCompensationCard from '../index';
import FormattedCurrency from '../../common/FormattedCurrency';
import strings from '../strings';

describe('TotalCashCompensationCard', () => {
    let mountedComponent: ReactWrapper = null;

    afterEach(() => {
        if (mountedComponent) {
            mountedComponent.unmount();
            mountedComponent = null;
        }
    });

    it('should show description for TCC', () => {
        mountedComponent = mount(
            <TotalCashCompensationCard
                currency={'USD'}
                totalCashCompensation={100100}
                totalCashCompensationList={[]}
                companyContributionsList={[]}
                uncalculatedBenefitsList={[]}
            />);

        expect(mountedComponent.text().indexOf(strings.description)).not.toBe(-1);
    });

    it('should not show not applicable value if pay not given', () => {
        mountedComponent = mount(
            <TotalCashCompensationCard
                currency={'USD'}
                totalCashCompensation={null}
                totalCashCompensationList={[]}
                companyContributionsList={[]}
                uncalculatedBenefitsList={[]}
            />);

        expect(mountedComponent.text()).toContain(strings.notApplicable);
    });

    it('should flag value as sensitive', () => {
        mountedComponent = mount(
            <TotalCashCompensationCard
                currency={'USD'}
                totalCashCompensation={100100}
                totalCashCompensationList={[]}
                companyContributionsList={[]}
                uncalculatedBenefitsList={[]}
            />);

        expect(mountedComponent.find(FormattedCurrency).at(0).props().sensitiveValue).toBe(true);
    });
});
