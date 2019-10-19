import * as React from 'react';
import { shallow } from 'enzyme';
import { PdfHeader } from '..';

describe('PdfHeader', () => {
    it('should add className if given', () => {
        const element = shallow(
            <PdfHeader className="test" />
        );

        expect(element.hasClass('test')).toBe(true);
    });

    it('should not add className if not given', () => {
        const element = shallow(
            <PdfHeader />
        );

        expect(element.props().className).not.toContain('test');
    });

    it('should have children if given', () => {
        const element = shallow(
            <PdfHeader>
                <div className="meh" />
            </PdfHeader>
        );

        expect(element.childAt(0).props().className).toBe('meh');
    });

    it('should not have children if not given', () => {
        const element = shallow(
            <PdfHeader />
        );

        expect(element.childAt(0).isEmptyRender()).toBe(true);
    });
});