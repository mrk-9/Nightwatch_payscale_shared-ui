import * as React from 'react';
import { shallow } from 'enzyme';

import { NavigationItem } from '../index';

describe('NavigationItem', () => {
    it('should render an anchor tag and should not be active', () => {
        const component = shallow(
            <NavigationItem title="test">
                <span>Test</span>
            </NavigationItem>
        );

        expect(component.find('a').length).toBe(1);
        expect(component.find('a').text()).toBe('test');
        expect(component.find('a.nav-pageitem__link.active').length).toBe(0);
    });

    it('should render an active anchor', () => {
        const component = shallow(
            <NavigationItem title="test" active={true}>
                <span>Test</span>
            </NavigationItem>
        );

        expect(component.find('a.nav-pageitem__link.active').length).toBe(1);
    });
});
