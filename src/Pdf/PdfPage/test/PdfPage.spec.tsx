import * as React from 'react';
import { shallow } from 'enzyme';
import { PdfPage } from '..';

describe('PdfPage', () => {
    it('should add className if given', () => {
        const element = shallow(
            <PdfPage className="test" />
        );

        expect(element.hasClass('test')).toBe(true);
    });

    it('should not add className if not given', () => {
        const element = shallow(
            <PdfPage />
        );

        expect(element.props().className).not.toContain('test');
    });

    it('should have children if given', () => {
        const element = shallow(
            <PdfPage>
                <div className="meh" />
            </PdfPage>
        );

        expect(element.find('.pdf-page__inner').first().childAt(0).props().className).toBe('meh');
    });

    it('should not have children if not given', () => {
        const element = shallow(
            <PdfPage />
        );

        expect(element.find('.pdf-page__inner').first().childAt(0).isEmptyRender()).toBe(true);
    });
});