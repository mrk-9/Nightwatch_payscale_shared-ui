import * as React from 'react';

export interface TreeChartLineProps {
  direction: string; // 'up' | 'straight' | 'down' are the options. The direction for the line.
  fraction: number; // The fraction of the total profile count for this line, used to determine thickness.
}

export interface LineProps {
  size: 'sm' | 'md' | 'lg'; // The size of the line.
}

export interface SingleLineProps {
  color: string; // The color of the line
  zIndex: number; // The order of where to show the line (overlap, behind, etc.)
}

const TreeChartLine = (props: TreeChartLineProps) => {
  const { direction, fraction } = props;

  const size = fraction > 0.2 ? 'lg' : fraction > 0.08 ? 'md' : 'sm';

  switch (direction) {
    case 'up':
      return <Up size={size} />;
    case 'straight':
      return <Straight size={size} />;
    case 'down':
      return <Down size={size} />;
    default:
      return null;
  }
};

export const Down = (props: LineProps) => {
  const { size } = props;

  // tslint:disable max-line-length
  switch (size) {
    case 'sm':
      return (
        <svg width="151px" height="111px" viewBox="0 0 151 111" className="tree-chart__lines--down tree-chart__lines--sm">
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <path d="M0,108.5 L19.7101992,108.5 C52.4210178,108.5 81.331361,87.2289911 91.0652075,56 L94.7602508,44.1452336 C102.314073,19.9103914 124.616956,3.2981265 150,3 L150,3" stroke="#00AAA4" strokeWidth="5" transform="translate(75.000000, 55.750000) scale(1, -1) translate(-75.000000, -55.750000) " />
          </g>
        </svg>
      );
    case 'md':
      return (
        <svg width="151px" height="116px" viewBox="0 0 151 116" className="tree-chart__lines--down tree-chart__lines--md">
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <path d="M0,110.5 L19.7101992,110.5 C52.4210178,110.5 81.331361,89.2289911 91.0652075,58 L94.7602508,46.1452336 C102.314073,21.9103914 124.616956,5.2981265 150,5 L150,5" stroke="#00817D" strokeWidth="10" transform="translate(75.000000, 57.750000) scale(1, -1) translate(-75.000000, -57.750000) " />
          </g>
        </svg>
        );
    case 'lg':
      return (
        <svg width="151px" height="121px" viewBox="0 0 151 121" className="tree-chart__lines--down tree-chart__lines--lg" >
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <path d="M0,113.5 L19.7101992,113.5 C52.4210178,113.5 81.331361,92.2289911 91.0652075,61 L94.7602508,49.1452336 C102.314073,24.9103914 124.616956,8.2981265 150,8 L150,8" stroke="#004E4B" strokeWidth="15" transform="translate(75.000000, 60.750000) scale(1, -1) translate(-75.000000, -60.750000) " />
          </g>
        </svg>
      );
    default:
      return null;
  }
};

export const Up = (props: LineProps) => {
  const { size } = props;

  switch (size) {
    case 'sm':
      return (
        <svg width="151px" height="110px" viewBox="0 0 151 110" className="tree-chart__lines--up tree-chart__lines--sm" >
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <path d="M0,107.503557 L19.7101992,107.503557 C52.4210178,107.503557 81.331361,86.2325484 91.0652075,55.0035573 L94.7602508,43.1487909 C102.278005,19.0296651 124.738155,2.70685427 150,3.00355727 L150,3.00355727" stroke="#00AAA4" strokeWidth="5" />
          </g>
        </svg>
      );
    case 'md':
      return (
        <svg width="151px" height="115px" viewBox="0 0 151 115" className="tree-chart__lines--up tree-chart__lines--md" >
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <path d="M0,109.503557 L19.7101992,109.503557 C52.4210178,109.503557 81.331361,88.2325484 91.0652075,57.0035573 L94.7602508,45.1487909 C102.278005,21.0296651 124.738155,4.70685427 150,5.00355727 L150,5.00355727" stroke="#00817D" strokeWidth="10" />
          </g>
        </svg>
      );
    case 'lg':
      return (
        <svg width="151px" height="120px" viewBox="0 0 151 120" className="tree-chart__lines--up tree-chart__lines--lg" >
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <path d="M0,112.503557 L19.7101992,112.503557 C52.4210178,112.503557 81.331361,91.2325484 91.0652075,60.0035573 L94.7602508,48.1487909 C102.278005,24.0296651 124.738155,7.70685427 150,8.00355727 L150,8.00355727" stroke="#004E4B" strokeWidth="15" />
            </g>
        </svg>
      );
    default:
        return null;
  }
};

export const Straight = (props: LineProps) => {
  const { size } = props;
  let width;
  let color;

  switch (size) {
    case 'sm':
      width = 5;
      color = '#00AAA4';
      break;
    case 'md':
      width = 10;
      color = '#00817D';
      break;
    case 'lg':
    default:
      width = 15;
      color = '#004E4B';
      break;

  }

  return (
    <svg
      height={width}
      className={`tree-chart__lines--straight tree-chart__lines--${size}`}
    >
      <rect fill={color} x="0" y="0" width="100%" height={width} />
    </svg>
  );
};

export default TreeChartLine;