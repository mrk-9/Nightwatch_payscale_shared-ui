import * as React from 'react';
import { shallow, mount, ReactWrapper } from 'enzyme';
import RangeDistributionCard from '../index';

describe('RangeDistributionCard', () => {
    let mountedComponent: ReactWrapper;

    afterEach(() => {
        if (mountedComponent) {
            mountedComponent.unmount();
            mountedComponent = null;
        }
    });

    it('should render nothing if value not provided',  () => {
        const result = shallow(
            <RangeDistributionCard
                rangeDistribution={[1, 2, 3, 4, 5, 6]}
                rangeMin={10}
                rangeMax={100}
            />
        );
        expect(result.isEmptyRender()).toBe(true);
    });

    it('should render nothing if value is null',  () => {
        const result = shallow(
            <RangeDistributionCard
                rangeDistribution={[1, 2, 3, 4, 5, 6]}
                rangeMin={10}
                rangeMax={100}
                pay={null}
            />
        );
        expect(result.isEmptyRender()).toBe(true);
    });

    it('should render if value is zero',  () => {
        const result = shallow(
            <RangeDistributionCard
                rangeDistribution={[1, 2, 3, 4, 5, 6]}
                rangeMin={10}
                rangeMax={100}
                pay={0}
            />
        );
        expect(result.isEmptyRender()).toBe(false);
    });

    it('should render nothing if rangeMin not provided',  () => {
        const result = shallow(
            <RangeDistributionCard
                rangeDistribution={[1, 2, 3, 4, 5, 6]}
                rangeMax={100}
                pay={50}
            />
        );
        expect(result.isEmptyRender()).toBe(true);
    });

    it('should render nothing if rangeMin is null',  () => {
        const result = shallow(
            <RangeDistributionCard
                rangeDistribution={[1, 2, 3, 4, 5, 6]}
                rangeMin={null}
                rangeMax={100}
                pay={50}
            />
        );
        expect(result.isEmptyRender()).toBe(true);
    });

    it('should render if rangeMin is zero',  () => {
        const result = shallow(
            <RangeDistributionCard
                rangeDistribution={[1, 2, 3, 4, 5, 6]}
                rangeMin={0}
                rangeMax={100}
                pay={10}
            />
        );
        expect(result.isEmptyRender()).toBe(false);
    });

    it('should render nothing if rangeMax not provided',  () => {
        const result = shallow(
            <RangeDistributionCard
                rangeDistribution={[1, 2, 3, 4, 5, 6]}
                rangeMin={10}
                pay={50}
            />
        );
        expect(result.isEmptyRender()).toBe(true);
    });

    it('should render nothing if rangeMax is null',  () => {
        const result = shallow(
            <RangeDistributionCard
                rangeDistribution={[1, 2, 3, 4, 5, 6]}
                rangeMax={null}
                rangeMin={10}
                pay={50}
            />
        );
        expect(result.isEmptyRender()).toBe(true);
    });

    it('should render description',  () => {
        const result = shallow(
            <RangeDistributionCard
                rangeMin={10}
                rangeMax={100}
                pay={50}
                rangeDistribution={[1, 2, 3, 4, 5, 6]}
            />
        );
        expect(result.find('.range-dist-card__desc').length).toBe(1);
    });

    it('should render description with correct percentage',  () => {
        const result = shallow(
            <RangeDistributionCard
                rangeMin={10}
                rangeMax={100}
                pay={50}
                rangeDistribution={[5, 10, 40, 30, 10, 5]}
            />
        );
        expect(result.find('.range-dist-card__desc').length).toBe(1);
        expect(result.find('.range-dist-card__desc').text()).toContain('70%');
    });

    it('should render viz',  () => {
        const result = shallow(
            <RangeDistributionCard
                rangeMin={10}
                rangeMax={100}
                pay={50}
                rangeDistribution={[1, 2, 3, 4, 5, 6]}
            />
        );
        expect(result.find('.range-dist-card__viz').length).toBe(1);
    });

    it('should render viz with correct number of bars',  () => {
        mountedComponent = mount(
            <RangeDistributionCard
                rangeMin={10}
                rangeMax={100}
                pay={50}
                rangeDistribution={[1, 2, 3, 4, 5, 6]}
            />
        );
        expect(mountedComponent.find('.range-dist-card__viz').length).toBe(1);
        expect(mountedComponent.find('.barchart__bar-column').length).toBe(5);
    });

    it('should render viz with correct bar label',  () => {
        mountedComponent = mount(
            <RangeDistributionCard
                rangeDistribution={[5, 10, 40, 30, 10, 5]}
                rangeMin={10}
                rangeMax={100}
                pay={0}
            />
        );
        expect(mountedComponent.find('.range-dist-card__viz').length).toBe(1);
        expect(mountedComponent.find('.barchart__bar-column').length).toBe(5);
        const barLabel = mountedComponent.find('.barchart__bar-label');
        expect(barLabel.text()).toBe('5%');
    });

    it('should render viz with correct bar label if pay and range are hourly',  () => {
        mountedComponent = mount(
            <RangeDistributionCard
                rangeDistribution={[5, 10, 40, 30, 10, 5]}
                rangeMin={10}
                rangeMax={100}
                isHourlyRange={true}
                pay={12}
                isHourlyPay={true}
            />
        );
        expect(mountedComponent.find('.range-dist-card__viz').length).toBe(1);
        const barLabel = mountedComponent.find('.barchart__bar-label');
        expect(barLabel.text()).toBe('10%');
    });

    it('should render viz with correct bar label if pay is hourly and range is annual',  () => {
        mountedComponent = mount(
            <RangeDistributionCard
                rangeDistribution={[5, 10, 40, 30, 10, 5]}
                rangeMin={10 * 2080}
                rangeMax={100 * 2080}
                isHourlyRange={false}
                pay={12}
                isHourlyPay={true}
            />
        );
        expect(mountedComponent.find('.range-dist-card__viz').length).toBe(1);
        const barLabel = mountedComponent.find('.barchart__bar-label');
        expect(barLabel.text()).toBe('10%');
    });

    it('should render viz with correct bar label if pay is annual and range is hourly',  () => {
        mountedComponent = mount(
            <RangeDistributionCard
                rangeDistribution={[5, 10, 40, 30, 10, 5]}
                rangeMin={10}
                rangeMax={100}
                isHourlyRange={true}
                pay={12 * 2080}
                isHourlyPay={false}
            />
        );
        expect(mountedComponent.find('.range-dist-card__viz').length).toBe(1);
        const barLabel = mountedComponent.find('.barchart__bar-label');
        expect(barLabel.text()).toBe('10%');
    });

    it('should not render viz if range distribution not provided',  () => {
        const result = shallow(
            <RangeDistributionCard
                rangeDistribution={null}
                rangeMin={0}
                rangeMax={100}
                pay={50}
            />
        );
        expect(result.find('.range-dist-card__viz').length).toBe(0);
    });

    it('should not render viz if range distribution is empty',  () => {
        const result = shallow(
            <RangeDistributionCard
                rangeDistribution={[]}
                rangeMin={0}
                rangeMax={100}
                pay={50}
            />
        );
        expect(result.find('.range-dist-card__viz').length).toBe(0);
    });

    it('should not render correctly if range distribution is all zeros',  () => {
        mountedComponent = mount(
            <RangeDistributionCard
                rangeDistribution={[0, 0, 0, 0, 0, 0]}
                rangeMin={0}
                rangeMax={100}
                pay={50}
            />
        );
        expect(mountedComponent.find('.range-dist-card__desc').length).toBe(1);
        expect(mountedComponent.find('.range-dist-card__desc').text()).not.toContain('NaN%');

        expect(mountedComponent.find('.range-dist-card__viz').length).toBe(1);
        const barLabel = mountedComponent.find('.barchart__bar-label');
        expect(barLabel.text()).not.toBe('NaN%');
    });
});
