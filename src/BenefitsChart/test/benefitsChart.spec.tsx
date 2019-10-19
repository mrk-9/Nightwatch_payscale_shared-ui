import * as React from 'react';
import { shallow } from 'enzyme';
import { BenefitsChart, BenefitsChartProps, BenefitDetailsItem } from '../index';

describe('BenefitsCard', () => {
  const tcc: BenefitDetailsItem[] = [
    {label: 'basePay', value: 100000},
    {label: 'lumpSum', value: 5000},
    {label: 'bonus', value: 5000}
  ];
  const benefits: BenefitDetailsItem[] = [
    {label: 'medical', value: 5000},
    {label: 'duck donuts', value: 3000},
    {label: 'chikfila', value: 3000}
  ];
  const uncalculated = [
    {label: 'test', value: 1}
  ];
  const initialProps: BenefitsChartProps = {
    className: 'test',
    totalCashCompensation: tcc,
    companyContributions: benefits,
    uncalculatedBenefits: uncalculated
  };
  it('should apply className from props', () => {
    const result = shallow(
      <BenefitsChart {...initialProps} />
    );
    expect(result.find('.test').length).toBe(1);
  });

  it('should adjust the margin top of tcc to line up with bar chart', () => {
    const result = shallow(
      <BenefitsChart {...initialProps} />
    );
    let tccPanel = result.find('.employee-benefits-chart__tcc-panel');
    const initialTccMargin = tccPanel.props().style.marginTop;
    const newCompanyContributions = [
      {label: 'medical', value: 20000},
      {label: 'duck donuts', value: 3000},
      {label: 'chikfila', value: 3000}
    ];
    result.setProps({
      companyContributions: newCompanyContributions
    });
    tccPanel = result.find('.employee-benefits-chart__tcc-panel');
    const newTccMargin = tccPanel.prop('style').marginTop;
    expect(initialTccMargin).not.toBe(newTccMargin);
  });

  it('has three company contributions and three items that make up tcc', () => {
    const result = shallow(
      <BenefitsChart {...initialProps} />
    );
    const companyContributionPanel = result.find('.employee-benefits-chart__company-panel');
    const tccPanel = result.find('.employee-benefits-chart__tcc-panel');
    const companyContributionItems = companyContributionPanel.find('.employee-benefits-chart__benefit');
    const tccItems = tccPanel.find('.employee-benefits-chart__benefit-items')
      .at(0).find('.employee-benefits-chart__benefit');
    expect(companyContributionItems.length).toBe(3);
    expect(tccItems.length).toBe(3);
  });
});