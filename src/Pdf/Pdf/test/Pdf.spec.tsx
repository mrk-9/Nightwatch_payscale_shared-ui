import * as React from 'react';
import { shallow } from 'enzyme';
import { Pdf } from '..';

describe('Pdf', () => {
    it('should add className if given', () => {
        const element = shallow(
            <Pdf className="test" />
        );

        expect(element.hasClass('test')).toBe(true);
    });

    it('should not add className if not given', () => {
        const element = shallow(
            <Pdf />
        );

        expect(element.props().className).not.toContain('test');
    });

    it('should have children if given', () => {
        const element = shallow(
            <Pdf>
                <div className="meh" />
            </Pdf>
        );

        expect(element.childAt(0).props().className).toBe('meh');
    });

    it('should not have children if not given', () => {
        const element = shallow(
            <Pdf />
        );

        expect(element.childAt(0).isEmptyRender()).toBe(true);
    });
});