import * as React from 'react';
import { shallow } from 'enzyme';
import { CoverPage } from '..';
import { PdfFooter } from '../../PdfFooter/';

describe('CoverPage', () => {
    it('should not render the header if logoPath is not given', () => {
        const element = shallow(
            <CoverPage formattedDate={'1/2/03'} logoPath="" />
        );

        expect(element.find('.cover-page__header').length).toBe(0);
    });

    it('should render the header if logoPath is given', () => {
        const element = shallow(
            <CoverPage formattedDate={'1/2/03'} logoPath="logo" />
        );

        expect(element.find('.cover-page__header').length).toBe(1);
    });

    it('should not render the title if not given', () => {
        const element = shallow(
            <CoverPage formattedDate={'1/2/03'} />
        );

        expect(element.find('.cover-page__title').length).toBe(0);
    });

    it('should render the title if given', () => {
        const element = shallow(
            <CoverPage formattedDate={'1/2/03'} title="title" />
        );

        expect(element.find('.cover-page__title').first().text()).toBe('title');
    });

    it('should not render the subtitle if not given', () => {
        const element = shallow(
            <CoverPage formattedDate={'1/2/03'} />
        );

        expect(element.find('.cover-page__subtitle').length).toBe(0);
    });

    it('should render the subtitle if given', () => {
        const element = shallow(
            <CoverPage formattedDate={'1/2/03'} subtitle="subtitle" />
        );

        expect(element.find('.cover-page__subtitle').first().text()).toBe('subtitle');
    });

    it('should not render the details if coverPageDetails is not given', () => {
        const element = shallow(
            <CoverPage formattedDate={'1/2/03'} coverPageDetails={null} />
        );

        expect(element.find('.cover-page__details').length).toBe(0);
    });

    it('should render the details if coverPageDetails is given', () => {
        const element = shallow(
            <CoverPage formattedDate={'1/2/03'} coverPageDetails={[{ name: 'a', value: 'b', icon: 'c' }]} />
        );

        expect(element.find('.cover-page__details').first().children().length).toBe(1);
    });

    it('should pass the date to the footer', () => {
        const element = shallow(
            <CoverPage formattedDate={'1/2/03'} />
        );

        expect(element.find(PdfFooter).first().props().formattedDate).toBe('1/2/03');
    });

    it('should pass the footerImagePath to the footer', () => {
        const element = shallow(
            <CoverPage formattedDate={'1/2/03'} footerImagePath="qwerty" />
        );

        expect(element.find(PdfFooter).first().props().footerImagePath).toBe('qwerty');
    });

    it('should pass the footerImageAltText to the footer', () => {
        const element = shallow(
            <CoverPage formattedDate={'1/2/03'} footerImageAltText="aaaaa" />
        );

        expect(element.find(PdfFooter).first().props().footerImageAltText).toBe('aaaaa');
    });
});