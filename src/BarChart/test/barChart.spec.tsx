import * as React from 'react';
import { mount, shallow } from 'enzyme';
import BarChart from '../index';

const getNumber = (input: string | number): number => {
    if (typeof input === typeof 'number') {
        return input as number;
    }
    return parseInt(input as string, 10);
};

describe('BarChart', () => {
    it('should return null if no bar data', () => {
        const result = shallow(<BarChart bars={[]} />);
        expect(result.isEmptyRender()).toBe(true);
    });

    it('should render appropriate number of bars', () => {
        const result = shallow(<BarChart bars={[{value: 1}, {value: 2}]} />);
        expect(result.find('.barchart__bar-column').length).toBe(2);
    });

    describe('bar labels', () => {
        it('should not render bar labels if none exist', () => {
            const result = shallow(<BarChart bars={[{value: 1}, {value: 2}]} />);
            expect(result.find('.barchart__bar-label').length).toBe(0);
        });

        it('should render bar labels if they exist', () => {
            const bars = [
                {value: 1, label: 'bar'},
                {value: 2},
                {value: 3, label: 'foo'}
            ];
            const result = shallow(<BarChart bars={bars} />);
            expect(result.find('.barchart__bar-label').length).toBe(2);
        });

        it('should render bar label below bar for negative values', () => {
            const bars = [
                {value: -1, label: 'bar'}
            ];
            const result = shallow(<BarChart bars={bars} />);
            const labels = result.find('.barchart__bar-label');
            expect(labels.length).toBe(1);

            const label = labels.at(0);
            const bar = result.find('.barchart__bar').at(0);

            // relative offset of bar and label should be same, as label is rendered after
            // bar
            expect(getNumber(bar.props().style.top)).toBe(getNumber(label.props().style.top));
        });

        it('should render bar label above bar for positive values', () => {
            const bars = [
                {value: 1, label: 'bar'}
            ];
            const result = shallow(<BarChart bars={bars} />);
            const labels = result.find('.barchart__bar-label');
            expect(labels.length).toBe(1);

            const label = labels.at(0);
            const bar = result.find('.barchart__bar').at(0);

            // relative offset of bar and label should be same, as label is rendered after
            // bar
            expect(getNumber(bar.props().style.top)).toBeGreaterThan(getNumber(label.props().style.top));
        });
    });

    describe('categorical axis', () => {
        it('should not render cat axis labels if none exist', () => {
            const result = shallow(<BarChart bars={[{value: 1}, {value: 2}]} />);
            expect(result.find('.barchart__cat-axis').length).toBe(0);
        });

        it('should render cat axis labels if any exist', () => {
            const result = shallow(<BarChart bars={[{value: 1}, {value: 2, axisLabel: '4'}]} />);
            expect(result.find('.barchart__cat-axis').length).toBe(1);
            expect(result.find('.barchart__cat-axis-label').length).toBe(2);
        });
    });

    describe('quantitative axis', () => {
        it('should not renderif prop not specified', () => {
            const result = shallow(<BarChart bars={[{value: 1}, {value: 2}]} />);
            expect(result.find('.barchart__quant-axis').length).toBe(0);
        });

        it('should render if prop specified', () => {
            const result = shallow(<BarChart bars={[{value: 1}, {value: 2}]} showQuantAxis={true}/>);
            expect(result.find('.barchart__quant-axis').length).toBe(1);
        });

        it('should format labels correctly', () => {
            const barData = [{value: 1}, {value: 2}];
            const formatFunc = (value: number) => `&&&${value}___`;
            const markerVals = BarChart.computeQuantAxisMarkerVals(BarChart.computeDataRange(barData));
            const expectedLabels = new Set();
            markerVals.forEach(val => expectedLabels.add(formatFunc(val)));

            const result = shallow(
                <BarChart
                    bars={barData}
                    showQuantAxis={true}
                    quantAxisFormatFunc={formatFunc}
                />);

            // note this will have one extra element due to the 'hidden' spacer
            const labels = result.find('.barchart__quant-axis-label').map(elt => elt.text());
            expect(labels.length).toBe(markerVals.length + 1);

            // ensure each label is in the expected set, with correct formatting
            labels.forEach(label => {
                expect(expectedLabels.has(label)).toBe(true);
            });
        });

        it('should render zero grid line class', () => {
            const result = shallow(<BarChart bars={[{value: 1}, {value: -1}]} showQuantAxis={true}/>);
            expect(result.find('.barchart__quant-axis-label.zero').length).toBe(1);
        });
    });

    describe('grid lines', () => {
        it('should not render if prop not specified', () => {
            const result = shallow(<BarChart bars={[{value: 1}, {value: 2}]} />);
            expect(result.find('.barchart__grid-line-container').length).toBe(0);
        });

        it('should render quant axis if prop specified', () => {
            const result = shallow(<BarChart bars={[{value: 1}, {value: 2}]} showGridLines={true}/>);
            expect(result.find('.barchart__grid-line-container').length).toBe(1);
        });

        it('should render same number of grid lines as axis labels', () => {
            const barData = [{value: 1}, {value: 2}];

            const result = shallow(
                <BarChart
                    bars={barData}
                    showQuantAxis={true}
                    showGridLines={true}
                />);

            // note this will have one extra element due to the 'hidden' spacer
            const labels = result.find('.barchart__quant-axis-label');
            const gridLines = result.find('.barchart__grid-line');
            expect(labels.length).toBe(gridLines.length + 1);
        });

        it('should render zero grid line class', () => {
            const result = shallow(<BarChart bars={[{value: 1}, {value: -1}]} showGridLines={true}/>);
            expect(result.find('.barchart__grid-line.zero').length).toBe(1);
        });
    });

    describe('computeDataRange()', () => {
        it('should always include zero for negative values', () => {
            const barData = [{value: -1}, {value: -2}];
            const result = BarChart.computeDataRange(barData);
            expect(result.max).toBeGreaterThanOrEqual(0);
        });

        it('should always include zero for positive values', () => {
            const barData = [{value: 1}, {value: 2}];
            const result = BarChart.computeDataRange(barData);
            expect(result.min).toBeLessThanOrEqual(0);
        });

        it('should pad min and max by 5%', () => {
            const barData = [{value: 1}];
            const result = BarChart.computeDataRange(barData);
            expect(result.max).toBe(1 + (1 / 0.9 * .05)); // should add 5% padding
            expect(result.min).toBe(-(1 / 0.9 * .05)); // should add 5% padding
        });

        it('should pad max by 15% if positive label', () => {
            const barData = [{value: 1, label: 'foo'}];
            const result = BarChart.computeDataRange(barData);
            expect(result.max).toBe(1 + (1 / 0.8 * .15)); // should add 15% padding top, 5% bottom
            expect(result.min).toBe(-(1 / 0.8 * .05)); // should add 5% padding
        });

        it('should pad min by 15% if positive label', () => {
            const barData = [{value: -1, label: 'foo'}];
            const result = BarChart.computeDataRange(barData);
            expect(result.max).toBe((1 / 0.8 * .05)); // should add 5% padding
            expect(result.min).toBe(-1 - (1 / 0.8 * .15)); // should add 15% padding bottom, 5% top
        });
    });

    describe('computeQuantAxisMarkerVals()', () => {
        it('should have at most 5 markers', () => {
            const bigResult = BarChart.computeQuantAxisMarkerVals({min: -10000, max: 10000});
            expect(bigResult.length).toBeLessThanOrEqual(5);
            expect(bigResult.length).toBeGreaterThan(1);

            const smallResult = BarChart.computeQuantAxisMarkerVals({min: 0.0001, max: 0.0002});
            expect(smallResult.length).toBeLessThanOrEqual(5);
            expect(smallResult.length).toBeGreaterThan(1);
        });

        it('should show marker above value if more than 1/3 way there', () => {
            const result = BarChart.computeQuantAxisMarkerVals({min: 0, max: 3.5});
            expect(result).toEqual([4, 3, 2, 1, 0]);
        });

        it('should not show marker above value if less than 1/3 way there', () => {
            const result = BarChart.computeQuantAxisMarkerVals({min: 0, max: 3.3});
            expect(result).toEqual([3, 2, 1, 0]);
        });

        it('should show marker below value if more than 1/3 way there', () => {
            const result = BarChart.computeQuantAxisMarkerVals({min: -3.5, max: 0});
            expect(result).toEqual([0, -1, -2, -3, -4]);
        });

        it('should not show marker below value if less than 1/3 way there', () => {
            const result = BarChart.computeQuantAxisMarkerVals({min: -3.3, max: 0});
            expect(result).toEqual([0, -1, -2, -3]);
        });

        it('should compute expected values', () => {
            // helper to do fuzzy compare of all elements in array
            const testValuesEqual = (test: number[], expected: number[]): void => {
                expect(test.length).toBe(expected.length);
                test.forEach((val, i) => expect(val).toBeCloseTo(expected[i]));
            };

            // not specific edge cases here, but a few varied cases to catch changes in behavior
            let result = BarChart.computeQuantAxisMarkerVals({min: 0, max: 100});
            testValuesEqual(result, [100, 75, 50, 25, 0]);

            result = BarChart.computeQuantAxisMarkerVals({min: 0.01, max: 0.7});
            testValuesEqual(result, [0.8, 0.6, 0.4, 0.2, 0]);

            result = BarChart.computeQuantAxisMarkerVals({min: -.24, max: .65});
            testValuesEqual(result, [0.6, 0.4, 0.2, 0, -0.2]);

            result = BarChart.computeQuantAxisMarkerVals({min: -73, max: 0});
            testValuesEqual(result, [0, -20, -40, -60, -80]);
        });
    });

    describe('countDecimalPlaces()', () => {
        it('should handle values > 1', () => {
            const result = BarChart.countDecimalPlaces(1.5);
            expect(result).toBe(1);
        });

        it('should handle values < -1', () => {
            const result = BarChart.countDecimalPlaces(-1.5);
            expect(result).toBe(1);
        });

        it('should handle positive values < 1', () => {
            const result = BarChart.countDecimalPlaces(0.01);
            expect(result).toBe(2);
        });

        it('should handle negative values > -1', () => {
            const result = BarChart.countDecimalPlaces(-0.01);
            expect(result).toBe(2);
        });

        it('should handle zero', () => {
            const result = BarChart.countDecimalPlaces(0);
            expect(result).toBe(0);
        });

        it('should ignore non-zero values after a trailing zero', () => {
            const result = BarChart.countDecimalPlaces(0.01001);
            expect(result).toBe(2);
        });

        it('should handle values slightly smaller than actual', () => {
            const result = BarChart.countDecimalPlaces(0.009999999999997);
            expect(result).toBe(2); // .01
        });
    });

    describe('vertical bar', () => {
        it('with two bars', () => {
            const props = {
                bars: [
                    {value: 1, className: 'vertical-bar'},
                    {value: 2, className: 'vertical-bar'}
                ],
                verticalBarChart: true
            };
            const result = shallow(<BarChart {...props} />);
            expect(result.find('.barchart__bar-container--vertical').length).toBe(1);
            expect(result.find('.vertical-bar').length).toBe(2);
        });

        it('does not render bars for vertical chart', () => {
            const result = shallow(<BarChart bars={[]} verticalBarChart={true} />);
            const verticalBarContainer = result.find('.barchart__bar-container--vertical');
            expect(verticalBarContainer.length).toBe(0);
            expect(verticalBarContainer.children().length).toBe(0);
        });

        it('will not render a bar without a value', () => {
            const bars = [{value: 0, className: 'vertical-bar'}];
            const result = shallow(<BarChart bars={bars} verticalBarChart={true} />);
            const verticalBarContainer = result.find('.barchart__bar-container--vertical');
            expect(verticalBarContainer.length).toBe(1);
            expect(verticalBarContainer.children().length).toBe(0);
        });
    });

    describe('bar chunks', () => {
        it('should render chunks when values ascend', () => {
            const bars = [{value: 1}, {value: 2}, {value: 3}];
            const result = mount(<BarChart bars={bars} />);

            const barColumns = result.find('.barchart__bar-column');
            expect(barColumns.length).toBe(bars.length);

            const barOne = barColumns.at(0);
            expect(barOne.exists('.barchart__bar-chunk-1')).toBe(true);

            const barTwo = barColumns.at(1);
            expect(barTwo.exists('.barchart__bar-chunk-1')).toBe(true);
            expect(barTwo.exists('.barchart__bar-chunk-2')).toBe(true);

            const barThree = barColumns.at(2);
            expect(barThree.exists('.barchart__bar-chunk-1')).toBe(true);
            expect(barThree.exists('.barchart__bar-chunk-2')).toBe(true);
            expect(barThree.exists('.barchart__bar-chunk-3')).toBe(true);
        });

        it('should render one chunk when value descends', () => {
            const bars = [{value: 1}, {value: 3}, {value: 2}];
            const result = mount(<BarChart bars={bars} />);

            const barColumns = result.find('.barchart__bar-column');
            expect(barColumns.length).toBe(bars.length);

            const barOne = barColumns.at(0);
            expect(barOne.exists('.barchart__bar-chunk-1')).toBe(true);

            const barTwo = barColumns.at(1);
            expect(barTwo.exists('.barchart__bar-chunk-1')).toBe(true);
            expect(barTwo.exists('.barchart__bar-chunk-2')).toBe(true);

            const barThree = barColumns.at(2);
            expect(barThree.exists('.barchart__bar-chunk-1')).toBe(true);
            expect(barThree.exists('.barchart__bar-chunk-2')).toBe(false);
        });

        it('should add empty bars to left by default', () => {
            const result = mount(<BarChart bars={[{value: 1}]} minBars={2} />);

            const barColumns = result.find('.barchart__bar-column');
            expect(barColumns.length).toBe(2);

            const barOne = barColumns.at(0);
            expect(barOne.exists('.barchart__bar--empty')).toBe(true);

            const barTwo = barColumns.at(1);
            expect(barTwo.exists('.barchart__bar-chunk-1')).toBe(true);
        });

        it('should add empty bars to the right', () => {
            const result = mount(<BarChart bars={[{value: 1}]} minBars={3} minBarLoc={'right'} />);

            const barColumns = result.find('.barchart__bar-column');
            expect(barColumns.length).toBe(3);

            const barOne = barColumns.at(0);
            expect(barOne.exists('.barchart__bar-chunk-1')).toBe(true);

            const barTwo = barColumns.at(1);
            expect(barTwo.exists('.barchart__bar--empty')).toBe(true);

            const barThree = barColumns.at(2);
            expect(barThree.exists('.barchart__bar--empty')).toBe(true);
        });
    });
});
