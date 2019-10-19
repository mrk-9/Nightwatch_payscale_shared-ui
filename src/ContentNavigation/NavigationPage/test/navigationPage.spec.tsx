import * as React from 'react';
import { shallow, mount } from 'enzyme';

import NavigationPage from '../index';

describe('NavigationPage', () => {
    it('should render with no title and no generated nav items', () => {
        const component = shallow(
            <NavigationPage>
                <span>Test</span>
            </NavigationPage>
        );

        expect(component.find('.nav-page__nav-header').length).toBe(0);
        expect(component.find('.nav-page__nav-items').children().length).toBe(
            0
        );
    });

    it('should render with title and no generated nav items', () => {
        const component = shallow(
            <NavigationPage navHeaderText="Test Header">
                <span>Test</span>
            </NavigationPage>
        );
        const header = component.find('.nav-page__nav-header');
        expect(header.length).toBe(1);
        expect(header.text()).toBe('Test Header');
        expect(component.find('.nav-page__nav-items').children().length).toBe(
            0
        );
    });

    it('should render with title and generated nav items', async () => {
        const component = mount(
            <NavigationPage navHeaderText="Test Header">
                <a>test</a>
            </NavigationPage>
        );
        const header = component.find('.nav-page__nav-header');
        expect(header).toBeDefined();
        expect(header.text()).toBe('Test Header');
        expect(component.find('.nav-page__nav-items').children().length).toBe(
            1
        );
    });

    it('should render with nav items at differing levels of nesting', async () => {
        const component = mount(
            <NavigationPage navHeaderText="Test Header">
                <a>test</a>
                <div>
                    <a>test 2</a>
                    <div>
                        <a>test 3</a>
                    </div>
                </div>
            </NavigationPage>
        );
        const header = component.find('.nav-page__nav-header');
        expect(header).toBeDefined();
        expect(header.text()).toBe('Test Header');
        expect(component.find('.nav-page__nav-items').children().length).toBe(
            3
        );
    });

    it('should render with nav items at a maximum level nesting of 1', async () => {
        const component = mount(
            <NavigationPage navHeaderText="Test Header" maxLevel={1}>
                <a>test</a>
                <div>
                    <a>test 2</a>
                    <div>
                        <a>test 3</a>
                    </div>
                </div>
            </NavigationPage>
        );
        const header = component.find('.nav-page__nav-header');
        expect(header).toBeDefined();
        expect(header.text()).toBe('Test Header');
        // Test 2 is nested one level deep
        expect(component.find('.nav-page__nav-items').children().length).toBe(
            2
        );
    });
});
