import * as React from 'react';
import { shallow, mount } from 'enzyme';
import FormattedCurrency from '../../common/FormattedCurrency';
import RangePenetrationCard from '../index';

describe('RangePenetration', () => {
    it('should show correct range penetration % when in the range for hourly', () => {
        const component = shallow(
            <RangePenetrationCard
                pay={50}
                isHourlyPay={true}
                currency={'USD'}
                rangeMin={30}
                rangeMax={70}
                isHourlyRange={true}
            />);

        expect(component.find('.range-pen-card__viz-thumb-label').first().text()).toBe('50%');
    });

    it('should show correct range penetration % when in the range for salary', () => {
        const component = shallow(
            <RangePenetrationCard
                pay={50000}
                currency={'USD'}
                rangeMin={10000}
                rangeMax={100000}
            />);

        expect(component.find('.range-pen-card__viz-thumb-label').first().text()).toBe('44%');
    });

    it('should show correct range penetration % below the range for salary', () => {
        const component = shallow(
            <RangePenetrationCard
                pay={5000}
                currency={'USD'}
                isHourlyPay={false}
                rangeMin={10000}
                rangeMax={100000}
            />);

        expect(component.find('.range-pen-card__viz-thumb-label').first().text()).toBe('-6%');
    });

    it('should show correct range penetration % above the range for salary', () => {
        const component = shallow(
            <RangePenetrationCard
                pay={110000}
                currency={'USD'}
                isHourlyPay={false}
                rangeMin={10000}
                rangeMax={100000}
            />);

        expect(component.find('.range-pen-card__viz-thumb-label').first().text()).toBe('111%');
    });

    it('should show correct range penetration % when pay is hourly and range is annual', () => {
        const component = shallow(
            <RangePenetrationCard
                currency={'USD'}
                pay={15}
                isHourlyPay={true}
                rangeMin={10 * 2080}
                rangeMax={20 * 2080}
            />);

        expect(component.find('.range-pen-card__viz-thumb-label').first().text()).toBe('50%');
    });

    it('should show correct range penetration % when pay is annual and range is hourly', () => {
        const component = shallow(
            <RangePenetrationCard
                currency={'USD'}
                pay={15 * 2080}
                isHourlyPay={false}
                rangeMin={10}
                rangeMax={20}
                isHourlyRange={true}
            />);

        expect(component.find('.range-pen-card__viz-thumb-label').first().text()).toBe('50%');
    });

    it('should not interpret null pay as hourly', () => {
        const component = mount(
            <RangePenetrationCard
                pay={null}
                currency={'USD'}
                rangeMin={10 * 2080}
                rangeMax={20 * 2080}
            />);

        expect(
            component.find('.range-pen-card__range-min')
            .find(FormattedCurrency).text())
            .toBe('20800');
        component.unmount();
    });

    it('should show range pen % to the left of the line when above 50% ', () => {
        const component = shallow(
            <RangePenetrationCard
                pay={70000}
                currency={'USD'}
                isHourlyPay={false}
                rangeMin={10000}
                rangeMax={100000}
            />);

        const label = component.find('.range-pen-card__viz-thumb-label').first();
        expect(label.props().style.transform).toBeDefined();
    });

    it('should show range pen % to the right of the line when below 50% ', () => {
        const component = shallow(
            <RangePenetrationCard
                pay={20000}
                currency={'USD'}
                rangeMin={10000}
                rangeMax={100000}
            />);

        const label = component.find('.range-pen-card__viz-thumb-label').first();
        expect(label.props().style.transform).toBeUndefined();
    });

    it('should show range pen % to the left of the line when at 50% ', () => {
        const component = shallow(
            <RangePenetrationCard
                pay={55000}
                currency={'USD'}
                rangeMin={10000}
                rangeMax={100000}
            />);

        const label = component.find('.range-pen-card__viz-thumb-label').first();
        expect(label.props().style.transform).toBeDefined();
    });

    it('should set invalid class if does not have valid range', () => {
        const component = shallow(
            <RangePenetrationCard
                pay={55000}
                currency={'USD'}
                rangeMin={null}
                rangeMax={100000}
            />);

        expect(component.find('.range-pen-card__viz').hasClass('invalid')).toBe(true);
    });

    it('should hide thumb if does not have valid range', () => {
        const component = shallow(
            <RangePenetrationCard
                pay={55000}
                currency={'USD'}
                rangeMin={null}
                rangeMax={100000}
            />);

        expect(component.find('.range-pen-card__viz').hasClass('hide-thumb')).toBe(true);
    });

    it('should hide thumb if does not have valid pay', () => {
        const component = shallow(
            <RangePenetrationCard
                pay={null}
                currency={'USD'}
                rangeMin={5000}
                rangeMax={100000}
            />);

        expect(component.find('.range-pen-card__viz').hasClass('hide-thumb')).toBe(true);
    });

    it('should not render viz labels if range invalid', () => {
        const component = shallow(
            <RangePenetrationCard
                pay={50000}
                currency={'USD'}
                rangeMin={null}
                rangeMax={100000}
            />);

        expect(component.find(FormattedCurrency).length).toBe(0);
    });

    it('should set mouseflow attribute on penetration label', () => {
        const component = shallow(
            <RangePenetrationCard
                pay={50000}
                currency={'USD'}
                rangeMin={10000}
                rangeMax={100000}
            />);
        expect(component.find('.range-pen-card__viz-thumb-label').prop('data-mf-replace-inner'))
            .toBeDefined();
    });
});
