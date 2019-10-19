import * as React from 'react';
import EmployeeDetailsCard from '../index';
import strings from '../../../Strings';
import { moduleName } from '../strings';
import { shallow, ShallowWrapper } from 'enzyme';

describe('EmployeeDetailsCard', () => {

    const dateOfHire = '2014-10-11';
    const id = 453636;
    const location = 'my house';
    const manager = 'snuffleupagus';
    const email = 'email@who.underpaid.com';
    const department = 'mom\'s basement';
    const formatFunc = (hireDate: string, formatStr: string): string => `__${hireDate}%%`;

    // Helper function to validate a single detail item
    const checkItem = (result: ShallowWrapper, iconClass: string, header: string, value: string) => {
        const detailsItems = result.find('.ee-details-card__item');
        expect(detailsItems.length).toBe(1);

        // check icon
        expect(detailsItems.at(0).find('.ee-details-card__item-icon').hasClass(iconClass)).toBe(true);

        // check header
        expect(detailsItems.at(0).find('.ee-details-card__item-header').text()).toBe(header);

        // check value
        expect(detailsItems.at(0).find('.ee-details-card__item-value').text()).toBe(value);
    };

    it('should not render if no data at all', () => {
        const result: ShallowWrapper = shallow(<EmployeeDetailsCard dateFormatter={null}/>);
        expect(result.isEmptyRender()).toBe(true);
    });

    it('should render if some data is present', () => {
        const result: ShallowWrapper = shallow(
            <EmployeeDetailsCard
                dateOfHire={dateOfHire}
                dateFormatter={null}
            />
        );

        expect(result.isEmptyRender()).toBe(false);
    });

    it('should render hireDate if present', () => {
        const result: ShallowWrapper = shallow(
            <EmployeeDetailsCard
                dateOfHire={dateOfHire}
                dateFormatter={formatFunc}
            />
        );

        checkItem(result,
            'icon-calendar',
            strings[moduleName].hireDate,
            formatFunc(dateOfHire, ''));
    });

    it('should render employeeId if present', () => {
        const result: ShallowWrapper = shallow(
            <EmployeeDetailsCard
                employeeId={id}
                dateFormatter={null}
            />
        );

        checkItem(result,
            'icon-v-card',
            strings[moduleName].employeeId,
            id.toString());
    });

    it('should render location if present', () => {
        const result: ShallowWrapper = shallow(
            <EmployeeDetailsCard
                workLocation={location}
                dateFormatter={null}
            />
        );

        checkItem(result,
            'icon-location',
            strings[moduleName].location,
            location);
    });

    it('should render manager if present', () => {
        const result: ShallowWrapper = shallow(
            <EmployeeDetailsCard
                managerName={manager}
                dateFormatter={null}
            />
        );

        checkItem(result,
            'icon-user',
            strings[moduleName].manager,
            manager);
    });

    it('should render email if present', () => {
        const result: ShallowWrapper = shallow(
            <EmployeeDetailsCard
                email={email}
                dateFormatter={null}
            />
        );

        checkItem(result,
            'icon-paper-plane',
            strings[moduleName].email,
            email);

        // expect email to be a link
        expect(result.find('a').text()).toBe(email);
    });

    it('should render department if present', () => {
        const result: ShallowWrapper = shallow(
            <EmployeeDetailsCard
                department={department}
                dateFormatter={null}
            />
        );

        checkItem(result,
            'icon-sitemap',
            strings[moduleName].department,
            department);
    });

    it('should render everything if present', () => {
        const result: ShallowWrapper = shallow(
            <EmployeeDetailsCard
                dateOfHire={dateOfHire}
                email={email}
                managerName={manager}
                workLocation={location}
                employeeId={id}
                department={department}
                dateFormatter={formatFunc}
            />
        );

        const detailsItems = result.find('.ee-details-card__item');
        expect(detailsItems.length).toBe(6);
    });
});