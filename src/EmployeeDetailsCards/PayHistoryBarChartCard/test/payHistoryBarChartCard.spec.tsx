import * as React from 'react';
import { mount } from 'enzyme';
import PayHistoryBarChartCard, { PayHistoryBarChartCardProps } from '..';

describe('PayHistoryBarChartCard', () => {
    let oldIntl: {};
    beforeEach(() => {
        // ensure intl is null for test stability
        oldIntl = (window as any).Intl; // tslint:disable-line no-any
        (window as any).Intl = null;    // tslint:disable-line no-any
    });

    afterEach(() => {
        (window as any).Intl = oldIntl;    // tslint:disable-line no-any
    });

    const initProps: PayHistoryBarChartCardProps = {
        currency: 'USD',
        baseSalary: 85000,
        payEffectiveDate: '2019-06-05T00:00:00Z'
    };

    describe('empty state', () => {
        it('should use base salary if no history exists', () => {
            const result = mount(
                <PayHistoryBarChartCard {...initProps} />
            );

            const label = result.find('.barchart__bar-label span');
            expect(label.length).toBe(1);
            expect(label.text()).toEqual('85K');
        });

        it('should use base salary if empty history', () => {
            const result = mount(
                <PayHistoryBarChartCard {...initProps} historyDataPoints={[]} />
            );

            const label = result.find('.barchart__bar-label span');
            expect(label.length).toBe(1);
            expect(label.text()).toEqual('85K');
        });
    });

    it('should render a bar for each data point', () => {
        const dataPoints = [
            { baseSalary: 30000, createdAt: '2019-06-05T00:00:00Z' },
            { baseSalary: 20000, createdAt: '2018-06-05T00:00:00Z' },
            { baseSalary: 10000, createdAt: '2017-06-05T00:00:00Z' }
        ];

        const result = mount(
            <PayHistoryBarChartCard {...initProps} historyDataPoints={dataPoints} />
        );

        const labels = result.find('.barchart__bar-label span');
        expect(labels.length).toBe(3);
        expect(labels.at(0).text()).toEqual('10K');
        expect(labels.at(1).text()).toEqual('20K');
        expect(labels.at(2).text()).toEqual('30K');

        const axisLabels = result.find('.barchart .barchart__cat-axis-label');
        expect(axisLabels.length).toBe(3);
        expect(axisLabels.at(0).text()).toEqual('06/17');
        expect(axisLabels.at(1).text()).toEqual('06/18');
        expect(axisLabels.at(2).text()).toEqual('06/19');
    });

    it('should sort data points by created at ascending', () => {
        const dataPoints = [
            { baseSalary: 20000, createdAt: '2018-06-05T00:00:00Z' },
            { baseSalary: 10000, createdAt: '2017-06-05T00:00:00Z' },
            { baseSalary: 30000, createdAt: '2019-06-05T00:00:00Z' }
        ];

        const result = mount(
            <PayHistoryBarChartCard {...initProps} historyDataPoints={dataPoints} />
        );

        const labels = result.find('.barchart__bar-label span');
        expect(labels.length).toBe(3);
        expect(labels.at(0).text()).toEqual('10K');
        expect(labels.at(1).text()).toEqual('20K');
        expect(labels.at(2).text()).toEqual('30K');
    });

    it('should only render latest 5 data points', () => {
        const dataPoints = [
            { baseSalary: 60000, createdAt: '2019-06-05T00:00:00Z' },
            { baseSalary: 50000, createdAt: '2019-05-05T00:00:00Z' },
            { baseSalary: 40000, createdAt: '2019-04-05T00:00:00Z' },
            { baseSalary: 30000, createdAt: '2018-06-05T00:00:00Z' },
            { baseSalary: 20000, createdAt: '2018-02-05T00:00:00Z' },
            { baseSalary: 10000, createdAt: '2015-06-05T00:00:00Z' }
        ];

        const result = mount(
            <PayHistoryBarChartCard {...initProps} historyDataPoints={dataPoints} />
        );

        const labels = result.find('.barchart__bar-label span');
        expect(labels.length).toBe(5);
        expect(labels.at(0).text()).toEqual('20K');
        expect(labels.at(1).text()).toEqual('30K');
        expect(labels.at(2).text()).toEqual('40K');
        expect(labels.at(3).text()).toEqual('50K');
        expect(labels.at(4).text()).toEqual('60K');
    });
});