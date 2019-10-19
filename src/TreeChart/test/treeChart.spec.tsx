import * as React from 'react';
import { mount} from 'enzyme';
import TreeChart from '../TreeChart/index';
import Leaf from '../Leaf/index';
import TreeChartLine from '../TreeChartLine/index';

const oneLayer = {
    name: 'Architect',
    percentage: .2,
    value: 130000,
    url: '/research/US/Job=Architect/Salary'
};
const twoLayer = {
    name: 'Architect',
    percentage: .4,
    value: 130000,
    url: '/research/US/Job=Architect/Salary',
    leaves: [oneLayer, oneLayer]
};
describe('TreeChart', () => {
    it('should return empty tree', () => {
        const result = mount(<TreeChart treeChartData={{}} />);
        expect(result.find('svg').length).toBe(0);
        expect(result.find('.tree-chart__leaf').length).toBe(0);
    });

    it('there should at least be one svg line and one leaf for one oneLayer', () => {
        const result = mount(<TreeChart key={1} treeChartData={{name: 'SE', leaves: [oneLayer]}} detailToShow="comp"/>);
        expect(result.find('svg').length).toBeGreaterThanOrEqual(1);
        expect(result.find('.tree-chart__leaf').length).toBeGreaterThanOrEqual(1);
    });

    it('number of lines should be equal to number of leaves', () => {
        const result = mount(<TreeChart treeChartData={{name: 'SE', leaves: [twoLayer, oneLayer]}} />);
        expect(result.find('svg').length).toBe(result.find('.tree-chart__leaf').length);
    });

    it('number of lines should be equal to number of leaves', () => {
        const result = mount(<TreeChart treeChartData={{name: 'SE', leaves: [oneLayer, oneLayer, oneLayer]}} />);
        expect(result.find('svg').length).toBe(result.find('.tree-chart__leaf').length);
    });

    it('salary should be shown if comp is selected for detailToShow', () => {
        const result = mount(
            <TreeChart
                treeChartData={{name: 'SE', leaves: [oneLayer, oneLayer]}}
                detailToShow={'comp'}
            />
        );
        expect(result.find('.tree-chart__comp').exists()).toBe(true);
        expect(result.find('.tree-chart__salaries a').exists()).toBe(false);
    });

    it('Link to view salaries should be shown if link is selected for detailToShow', () => {
        const result = mount(
            <TreeChart
                treeChartData={{name: 'SE', leaves: [oneLayer, oneLayer]}}
                detailToShow={'link'}
            />
        );
        expect(result.find('.tree-chart__comp').exists()).toBe(false);
        expect(result.find('.tree-chart__salaries a').exists()).toBe(true);
    });

    it('There should be maximum of three leaf and three lines shown when showTwoLevels is false', () => {
        const result = mount(
            <TreeChart
                treeChartData={{name: 'SE', leaves: [twoLayer, oneLayer]}}
                showTwoLevels={false}
            />
        );
        expect(result.find(Leaf).length).toBeLessThanOrEqual(3);
        expect(result.find(TreeChartLine).length).toBeLessThanOrEqual(3);
    });

    it('There should be maximum of three leaf and three lines shown when showTwoLevels is false', () => {
        const result = mount(
            <TreeChart
                treeChartData={{name: 'SE', leaves: [twoLayer, twoLayer, oneLayer]}}
                showTwoLevels={false}
            />
        );
        expect(result.find(Leaf).length).toBeLessThanOrEqual(3);
        expect(result.find(TreeChartLine).length).toBeLessThanOrEqual(3);
    });
});
