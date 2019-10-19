import * as React from 'react';
import { shallow } from 'enzyme';
import { PdfContent } from '..';

describe('PdfContent', () => {
    it('should have children if given', () => {
        const element = shallow(
            <PdfContent>
                <div className="meh" />
            </PdfContent>
        );

        expect(element.childAt(0).props().className).toBe('meh');
    });

    it('should not have children if not given', () => {
        const element = shallow(
            <PdfContent />
        );

        expect(element.childAt(0).isEmptyRender()).toBe(true);
    });
});