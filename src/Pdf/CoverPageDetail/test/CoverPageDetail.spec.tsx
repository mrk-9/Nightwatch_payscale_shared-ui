import * as React from 'react';
import { shallow } from 'enzyme';
import { CoverPageDetail } from '..';

describe('CoverPageDetail', () => {
    it('should render the icon', () => {
        const element = shallow(
            <CoverPageDetail icon="icon-ok" name="Department" value="Product" />
        );

        expect(element.find('.cover-page-detail__icon').first().childAt(0).props().className).toBe('icon-ok');
    });

    it('should render the name', () => {
        const element = shallow(
            <CoverPageDetail icon="icon-ok" name="Department" value="Product" />
        );

        expect(element.find('.cover-page-detail__name').first().text()).toBe('Department');
    });

    it('should render the value', () => {
        const element = shallow(
            <CoverPageDetail icon="icon-ok" name="Department" value="Product" />
        );

        expect(element.find('.cover-page-detail__value').first().text()).toBe('Product');
    });
});
