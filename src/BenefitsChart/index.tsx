import * as React from 'react';
import BarChart, { BarProps } from '../BarChart';
import { buildClassString } from '../StringUtils';
import { FormattedCurrency, CurrencyFormatFunc } from '../EmployeeDetailsCards/common/FormattedCurrency';
import './style/index.scss';

export interface BenefitDetailsItem {
  label: string;      // Label for the benefit
  value: number;      // Cash value of the benefit
}

export interface BenefitsChartProps {
  className?: string;                           // (optional) className to be added to the parent element
  totalCashCompensation: BenefitDetailsItem[];  // total cash items for the employee
  companyContributions: BenefitDetailsItem[];   // company contributions benefiting the employee
  uncalculatedBenefits: BenefitDetailsItem[];   // benefits provided to the employee that are not used in calcs
  height?: number;                              // (optional) height of the rendered dom element
  currency?: string;                            // (optional) currency of comp value
  currencyFormatter?: CurrencyFormatFunc;       // (optional) formatter to use to display values
}

export class BenefitsChart extends React.PureComponent<BenefitsChartProps> {
  constructor(props: BenefitsChartProps) {
    super(props);
  }

  render(): JSX.Element {
    const {
      className,
      totalCashCompensation,
      companyContributions,
      height,
      currencyFormatter } = this.props;
    const bars: BarProps[] = [];
    let tccTotal: number = 0;
    let contributionsTotal: number = 0;
    if (totalCashCompensation && totalCashCompensation.length > 0) {
      tccTotal = totalCashCompensation.reduce((prevValue, currentValue) => {
        return prevValue + Number(currentValue.value);
      }, 0);
      bars.push({
        value: tccTotal,
        className: 'employee-benefits-chart__total-cash'
      });
    }

    if (companyContributions && companyContributions.length > 0) {
      contributionsTotal = companyContributions.reduce((prevValue, currentValue) => {
        return prevValue + Number(currentValue.value);
      }, 0);
      bars.push({
        value: contributionsTotal,
        className: 'employee-benefits-chart__company-contributions'
      });
    }

    let compensationRatio = 0;

    if (tccTotal && contributionsTotal) {
      compensationRatio = contributionsTotal / (contributionsTotal + tccTotal);
    }

    const benefitsCardClassName = buildClassString({
      'employee-benefits-chart': true,
      [className]: !!className
    });

    const cardHeight = height ? height : 500;
    // Move the TCC down to line up with TCC Vertical Bar
    const totalCompMarginTop = cardHeight * compensationRatio;

    const benefitBarStyle = {
      height: cardHeight + 'px'
    };

    const totalCompStyle = {
      marginTop: totalCompMarginTop + 'px'
    };

    return (
      <div className={benefitsCardClassName}>
        <div className="employee-benefits-chart__tcc-panel" style={totalCompStyle}>
          <div className="tcc-panel__header">
            <div className="tcc-panel__title">
              <div className="tcc-panel__title-text">Total Cash<br />Compensation</div>
            </div>
            <div className="tcc-panel__value">
              <div className="tcc-panel__line" />
              <FormattedCurrency
                val={tccTotal}
                sensitiveValue={false}
                formatFunc={currencyFormatter}
              />
            </div>
          </div>
          {totalCashCompensation && this._renderBenefitItems(totalCashCompensation, 'totalCompensation')}
          {this._renderUncalculatedBenefits()}
        </div>
        <div className="employee-benefits-chart__bar-chart" style={benefitBarStyle}>
          <BarChart bars={bars} verticalBarChart={true} />
        </div>
        <div className="employee-benefits-chart__company-panel">
          {
            companyContributions && companyContributions.length > 0 && (
              <React.Fragment>
                <div className="company-panel__header">
                  <div className="company-panel__line" />
                  <div className="company-panel__title">
                    <div className="tcc-panel__title-text">Company<br />Contributions</div>
                  </div>
                  <div className="company-panel__value">
                    <FormattedCurrency
                        val={contributionsTotal}
                        sensitiveValue={false}
                        formatFunc={currencyFormatter}
                    />
                  </div>
                </div>
                {this._renderBenefitItems(companyContributions, 'companyContribution')}
              </React.Fragment>
            )
          }
        </div>
      </div>
    );
  }

  private _renderBenefitItems(benefitItems: BenefitDetailsItem[], benefitName: string): JSX.Element {
    const benefits: JSX.Element[] = [];

    benefitItems.forEach((benefit) => {
      benefits.push(this._renderBenefit(benefit));
    });

    return (
      <div className="employee-benefits-chart__benefit-items" key={benefitName}>
        {benefits}
      </div>
    );
  }

  private _renderBenefit(benefit: BenefitDetailsItem): JSX.Element {
    return (
      <div className="employee-benefits-chart__benefit" key={benefit.label}>
        <span className="employee-benefits-chart__benefit-title" key={`${benefit.label}Title`}>{benefit.label}</span>
        <span className="employee-benefits-chart__benefit-value" key={`${benefit.label}Value`}>
          <FormattedCurrency
              val={benefit.value}
              sensitiveValue={false}
          />
        </span>
      </div>
    );
  }

  private _renderUncalculatedBenefits(): JSX.Element {
    const { uncalculatedBenefits } = this.props;
    if (!uncalculatedBenefits || uncalculatedBenefits.length <= 0) {
      return null;
    }
    return (
      <div className="employee-benefits-chart__uncalculated-panel">
        <div className="uncalculated-panel__header">
          Not included in your total
        </div>
        <div className="uncalculated-panel__container">
          <span className="uncalculated-panel__title">Paid Leave</span>
          <div className="uncalculated-panel__paid-leave">
            {this._renderBenefitItems(uncalculatedBenefits, 'paidLeave')}
          </div>
        </div>
      </div>
    );
  }
}

export default BenefitsChart;