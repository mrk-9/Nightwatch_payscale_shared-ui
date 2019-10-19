import * as React from 'react';
import { shallow } from 'enzyme';
import { PdfFooter } from '..';

describe('PdfFooter', () => {
    it('should render the page number if given', () => {
        const footer = shallow(
            <PdfFooter formattedDate={'1/2/03'} pageNumber={123} />
        );

        expect(footer.find('.pdf-footer__meta').first().childAt(0).text()).toBe('123');
    });

    it('should not render the page number if not given', () => {
        const footer = shallow(
            <PdfFooter formattedDate={'1/2/03'} />
        );

        expect(footer.find('.pdf-footer__meta').first().childAt(0).text()).not.toBe('123');
    });

    it('should render the date correctly', () => {
        const footer = shallow(
            <PdfFooter formattedDate={'1/2/03'} pageNumber={123} />
        );

        expect(footer.find('.pdf-footer__date').first().text()).toBe('1/2/03');
    });

    it('should not render the logo if the footerImagePath is not given', () => {
        const footer = shallow(
            <PdfFooter formattedDate={'1/2/03'} footerImagePath="" />
        );

        expect(footer.find('.pdf-footer__logo').length).toBe(0);
    });

    it('should render the logo if the footerImagePath is given', () => {
        const footer = shallow(
            <PdfFooter formattedDate={'1/2/03'} footerImagePath="asdf" />
        );

        expect(footer.find('.pdf-footer__logo').length).toBe(1);
    });
});