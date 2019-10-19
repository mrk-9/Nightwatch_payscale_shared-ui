import * as React from 'react';
import { buildClassString } from '../StringUtils';
import { Tooltip } from '../Tooltip';
import './style/index.scss';

export interface BarProps {
    value: number;        // data value to be represented by bar
    label?: string;       // label to be shown associated with data/bar
    axisLabel?: string;   // label to show on categorical axis (below bar)
    className?: string;   // class applied to bar+label+axislabel
    empty?: boolean;      // is this bar an empty bar (rendered at min height)?
}

export interface BarChartProps {
    bars: BarProps[];             // bars to show in viz
    showGridLines?: boolean;      // whether to show quant axis grid lines
    showQuantAxis?: boolean;      // whether to show the quant axis/labels
    verticalBarChart?: boolean;
    minBarHeight?: number;        // minimum height a bar can have
    minBars?: number;             // minimum number of bars to shown, adds empty bars as padding
    minBarLoc?: 'left' | 'right'; // where to show empty bars, defaults to left
    showDeltaTooltip?: boolean;   // display tooltip with percentage change?
    // Function for formatting values on quant axis
    // Second parameter is default formatting function which will truncate fractional
    // digits based on increment/spacing of axis ticks
    quantAxisFormatFunc?: (val: number, defaultFormatFunc: (val: number) => string) => string;
}

export interface Range {
    min: number;
    max: number;
}

export interface BarChunk {
    percentHeight: number;
    percentTop: number;
}

interface BarChartState {
    bars: BarProps[];
}

export class BarChart extends React.PureComponent<BarChartProps, BarChartState> {

    constructor(props: BarChartProps) {
        super(props);
        this.state = Object.assign({}, {
            bars: this._getBars(props)
        });
    }

    // Computes the charts quantitative range, with padding, based on
    // the individual bar values and presence of labels
    // !!!Public for test purposes only
    static computeDataRange(bars: BarProps[]): Range {
        const chartRange: Range = {
            min: 0,
            max: 0
        };

        if (!bars) {
            return chartRange;
        }

        // margin/padding to guarantee past range of data
        const margin = 0.05;

        // find min/max values of data
        const minVal = bars.reduce((acc, bar) => Math.min(acc, bar.value), 0);
        const maxVal = bars.reduce((acc, bar) => Math.max(acc, bar.value), 0);

        // compute bottom margin %.  Default to 5%, but add another 10% if there are labels to show
        const hasBarNegativeLabels = bars.some(bar => !!bar.label && bar.value < 0);
        const bottomMargin = margin + (hasBarNegativeLabels ? margin * 2 : 0);

        // compute top margin %.  Default to 5%, but add another 10% if there are labels to show
        const hasBarPositiveLabels = bars.some(bar => !!bar.label && bar.value >= 0);
        const topMargin = margin + (hasBarPositiveLabels ? margin * 2 : 0);

        // compute expanded range based on desired margins
        const range = maxVal - minVal;
        const expandedRange = range / (1.0 - topMargin - bottomMargin);

        // adjust min and max vals based on margin
        chartRange.min = minVal - (expandedRange * bottomMargin);
        chartRange.max = maxVal + expandedRange * topMargin;

        return chartRange;
    }

    // Helper method to count decimal places of axis increment
    // Scoped to this class rather than a common utility as makes assumptions
    // based on context of use
    // !!!Public for testing purposes only
    static countDecimalPlaces(val: number): number {
        // This method is intended to be used for formatting values displayed on the
        // axis.  Our goal here is to isolate/work around the messiness of floating-point
        // representations on computers.
        //
        // The provided value may be stored as something slightly smaller or slightly larger
        // than the exact value.  To handle the slightly smaller case, we add some
        // fractional amount to the value to "round up" to ensure we're slightly larger.
        // To handle slightly larger values, we only look at consecutive non-zero digits
        //
        // Note that this will only work correctly within the constraints of our increment
        // decision algorithm below (computeQuantAxisMarkerVals)

        // isolate fractional part of value
        val = Math.abs(val - Math.trunc(val));
        if (val === 0) { return 0; }

        // 'round' up for values slightly smaller than actual
        val += val * .001;

        let places = 0;

        // count leading zeros
        while (Math.floor(val * 10) === 0) {
            val *= 10;
            ++places;
        }

        // then count consecutive non-zero digits
        while (Math.floor(val * 10) % 10 !== 0) {
            val *= 10;
            ++places;
        }

        return places;
    }

    // Given range of bar data, compute quant axis marker/tick values that make
    // sense
    // !!!Public for test purposes only
    static computeQuantAxisMarkerVals(chartRange: Range): number[] {
        // compute a reasonable grid line increment
        const possibleIncrements = [1, 2, 2.5, 5];
        const maxMarkerCount = 5;
        let increment;
        let markerMax;

        // Compute starting magnitude that's likely one power below desired
        // (subtract one to make sure we're one magnitude smaller than that of the delta.  That way, if
        // delta is 0.1, our multiplier is 0.01 to start)
        let magnitude = Math.pow(10, Math.floor(Math.log10(chartRange.max - chartRange.min)) - 1);

        // iterate through our possible increments at different magnitudes (powers of 10) until we end up
        // with a reasonable number of markers
        let markerCount = maxMarkerCount + 1;
        while (markerCount > maxMarkerCount) {
            for (const possibleIncrement of possibleIncrements) {
                increment = possibleIncrement * magnitude;

                // Use this if we always want a grid line above max value and below min value
                // markerMax = Math.ceil(hartRange.max / increment) * increment;
                // markerMin = Math.floor(chartRange.min / increment) * increment;

                // if data would be more than 1/3 of way above max marker, show marker above
                markerMax = Math.trunc(chartRange.max / increment + 0.66) * increment;

                // if data would be more than 1/3 of way below min marker, show marker below
                const markerMin = Math.trunc(chartRange.min / increment - 0.66) * increment;

                markerCount = (markerMax - markerMin) / increment + 1;
                if (markerCount <= maxMarkerCount) {
                    break;
                }
            }
            magnitude *= 10;
        }

        // now that we know our increment, populate our array of values
        const markerVals = [];
        for (let i = 0; i < markerCount; i++) {
            markerVals.push(markerMax - (i * increment));
        }

        return markerVals;
    }

    componentWillReceiveProps(nextProps: BarChartProps): void {
        this.setState({ bars: this._getBars(nextProps) });
    }

    render(): JSX.Element {
        const { showGridLines, showQuantAxis, verticalBarChart } = this.props;
        const { bars } = this.state;
        if (!bars || bars.length === 0) {
            return null;
        }

        const dataRange = BarChart.computeDataRange(bars);            // get min/max range of data
        const quantAxisMarkers = (showGridLines || showQuantAxis) ?   // compute marker positions based on range
            BarChart.computeQuantAxisMarkerVals(dataRange) :
            null;

        // range should be max extents of data and quant markers, on the chance
        // quant markers extend beyond data (possible/likely)
        const chartRange = quantAxisMarkers ?
            {
                min: Math.min(dataRange.min, quantAxisMarkers[quantAxisMarkers.length - 1]),
                max: Math.max(dataRange.max, quantAxisMarkers[0])
            } :
            dataRange;

        return (
            <div className="barchart">
                <div className="barchart__horiz-container">
                    {this._renderQuantAxis(chartRange, quantAxisMarkers)}
                    <div className="barchart__chart-body">
                        {this._renderGridLines(chartRange, quantAxisMarkers)}
                        {verticalBarChart ? this._renderVerticalBar() : this._renderBars(chartRange)}
                    </div>
                </div>
                {this._renderCatAxis(quantAxisMarkers)}
            </div>
        );
    }

    private static _getAxisIncrementDigits(quantAxisMarkers: number[]): number {
        const increment = quantAxisMarkers.length >= 2 ?
            quantAxisMarkers[0] - quantAxisMarkers[1] :
            0;
        return BarChart.countDecimalPlaces(increment);
    }

    private _getBars(props: BarChartProps): BarProps[] {
        const { bars, minBars, minBarLoc } = props;

        // Pad bars on left or right if necessary
        const emptyBars: BarProps[] = [];
        if (minBars && bars.length < minBars) {
            for (let i = 0; i < minBars - bars.length; i++) {
                emptyBars.push({ value: 1, empty: true });
            }
        }

        const combinedBars = (minBarLoc || 'left') === 'left' ? emptyBars.concat(bars) : bars.concat(emptyBars);
        return combinedBars;
    }

    // Given a numeric value, format for display as a quant axis
    // label (ie add sign, and % symbol)
    private _formatQuantAxisValue(value: number, fractionalDigits: number): string {
        const { quantAxisFormatFunc } = this.props;

        // Use toLocaleString() with options to limit the fractional digits
        // output and also to handle commas, etc
        const defaultFormatFunc = (val: number) => val.toLocaleString(undefined, {
                maximumFractionDigits: Math.max(0, fractionalDigits) // < 0 causes exception
        });

        return quantAxisFormatFunc ?
            quantAxisFormatFunc(value, defaultFormatFunc) :
            defaultFormatFunc(value);
    }

    // Renders quantitative (Y) axis if specified, showing marker labels
    // that will align with gridlines if enabled
    private _renderQuantAxis(chartRange: Range, quantAxisMarkers: number[]): JSX.Element {
        const { showQuantAxis } = this.props;
        if (!showQuantAxis) {
            return null;
        }

        const fractionalDigits = BarChart._getAxisIncrementDigits(quantAxisMarkers);
        const rangeSpan = chartRange.max - chartRange.min;
        const axisLabels = quantAxisMarkers.map(val => this._formatQuantAxisValue(val, fractionalDigits));

        return (
            <div className="barchart__quant-axis">
                {
                    // Render hidden instance of longest quant axis label to size the container,
                    // as the markers themselves are absolutely positioned
                    this._renderQuantAxisPlaceholder(quantAxisMarkers)
                }
                { quantAxisMarkers.map((val, i) => {
                    const top = (chartRange.max - val) / rangeSpan * 100;
                    const labelClass = buildClassString({
                        'barchart__quant-axis-label': true,
                        'zero': val === 0
                    });
                    return (
                        <div
                            className={labelClass}
                            style={{top: `${top}%`}}
                            key={axisLabels[i]}
                        >
                            {axisLabels[i]}
                        </div>
                    );
                })}
            </div>
        );
    }

    // Renders hidden label which is used to preserve spacing/layout between the
    // quant axis and the cat axis, keeping cat axis aligned with the chart area
    private _renderQuantAxisPlaceholder(quantAxisMarkers: number[]): JSX.Element {
        const fractionalDigits = BarChart._getAxisIncrementDigits(quantAxisMarkers);
        const axisLabels = quantAxisMarkers.map(val => this._formatQuantAxisValue(val, fractionalDigits));
        const longestValue = axisLabels.reduce((label, acc) => {
            return label.length > acc.length ? label : acc;
        }, '');

        return <div className="barchart__quant-axis-label hidden">{longestValue}</div>;
    }

    // renders gridlines in chart body, according to quant axis markers
    private _renderGridLines(chartRange: Range, quantAxisMarkers: number[]): JSX.Element {
        const { showGridLines } = this.props;
        if (!showGridLines) {
            return null;
        }

        const rangeSpan = chartRange.max - chartRange.min;
        return (
            <div className="barchart__grid-line-container">
                { quantAxisMarkers.map(val => {
                    const top = (chartRange.max - val) / rangeSpan * 100;
                    const gridlineClass = buildClassString({
                        'barchart__grid-line': true,
                        'zero': val === 0
                    });
                    return (
                        <div
                            className={gridlineClass}
                            style={{top: `${top}%`}}
                            key={val}
                        />
                    );
                })}
            </div>
        );
    }

    private _renderVerticalBar(): JSX.Element {
        const { bars } = this.state;

        const totalRange = bars.reduce((acc, bar) => acc + bar.value, 0);
        const barElts: JSX.Element[] = [];
        bars.forEach((bar: BarProps, index: number) => {
            barElts.push(this._renderVerticalBarColumn(index, bar, totalRange));
        });

        return (
            <div className="barchart__bar-container barchart__bar-container--vertical">
                {barElts}
            </div>
        );
    }

    private _renderVerticalBarColumn(index: number, bar: BarProps, totalRange: number): JSX.Element {
        if (!bar || bar.value <= 0 || totalRange <= 0) {
            return null;
        }
        const { value, className } = bar;
        const barClassName = buildClassString({
            barchart__bar: true,
            [className]: !!className
        });
        let barHeight = 0;
        if (totalRange) {
            barHeight = (Math.max(0, value) / totalRange) * 100;
        }
        const barStyle = {
            height: `${barHeight}%`
        };

        return (
            <div className={barClassName} style={barStyle}/>
        );
    }

    // Renders the actual bars (and bar labels if specified)
    private _renderBars(chartRange: Range): JSX.Element {
        const { bars } = this.state;

        const barElts: JSX.Element[] = [];
        bars.forEach((bar: BarProps, index: number) => {
            // each bar has a padding element on each side, to allow flexibility in
            // how the padding is specified -- can be fixed pixels, or percentage values, etc
            barElts.push(<div className="barchart__bar-column-padding" key={`${index}-bar-before`}/>);
            barElts.push(this._renderBarColumn(index, bar, chartRange));
            barElts.push(<div className="barchart__bar-column-padding" key={`${index}-bar-after`}/>);
        });

        return (
            <div className="barchart__bar-container">
                {barElts}
            </div>
        );
    }

    // Helper method which renders a single bar 'column', which includes the bar mark as well
    // as it's label, if specified
    private _renderBarColumn(index: number, bar: BarProps, chartRange: Range): JSX.Element {
        if (!bar) {
            return null;
        }

        const { showDeltaTooltip } = this.props;
        const { bars } = this.state;
        const { value, label, className } = bar;
        const negative = value < 0;
        const range = Math.max(chartRange.max - chartRange.min, 1);
        const barHeight =  Math.abs(value) / range * 100;
        const barTop = (chartRange.max - Math.max(0, value)) / range * 100;

        // if value is negative, put label below bar, otherwise above
        const labelTop = negative ? barTop : barTop - barHeight;
        const labelStyle = {
            top: `${labelTop}%`
        };

        const barClassName = buildClassString({
            'barchart__bar-column': true,
            [className]: !!className
        });

        const labelClassName = buildClassString({
            'barchart__bar-label': true,
            'negative': negative
        });

        const barChunks = this._getBarChunks(index, chartRange);

        const barFragment = (
            <React.Fragment>
                {barChunks.map((chunk, chunkIndex) => (
                    // Selectors first/last-child aren't guaranteed to work, so
                    // denote first and last chunk with class so we can easily target with CSS
                    <div
                        className={`
                            barchart__bar
                            ${bar.empty ?
                                'barchart__bar--empty' :
                                `barchart__bar-chunk-${barChunks.length - chunkIndex}`
                            }
                            ${chunkIndex === 0 ? 'barchart__bar-chunk-first' : ''}
                            ${chunkIndex === barChunks.length - 1 ? 'barchart__bar-chunk-last' : ''}
                        `}
                        style={{ top: `${chunk.percentTop}%`, height: `${chunk.percentHeight}%` }}
                        key={chunkIndex}
                    />
                ))}
                {label && <div className={labelClassName} style={labelStyle}>
                    <span>{label}</span>
                </div>}
            </React.Fragment>
        );

        // Only render tooltip if there's a real preceding bar value
        if (showDeltaTooltip && index > 0 && !bars[index].empty && !bars[index - 1].empty) {
            const pct = ((bars[index].value - bars[index - 1].value) / bars[index - 1].value) * 100;
            const pctChange = `${pct > 0 ? '+' : ''}${pct.toFixed(1)}%`;
            return (
                <Tooltip
                    id={`barchart__bar-${index}`}
                    wrapperClassName={barClassName}
                    place={'left'}
                    content={pctChange}
                    key={index}
                >
                    {barFragment}
                </Tooltip>
            );
        }

        return (
            <div key={index} className={barClassName}>
                {barFragment}
            </div>
        );
    }

    private _getBarChunks(index: number, chartRange: Range): BarChunk[] {
        const { minBarHeight } = this.props;
        const { bars } = this.state;

        // If this bar is denoted as an empty bar, just return 1 chunk with min height
        if (bars[index].empty) {
            const barHeight = minBarHeight || 1;
            return [{ percentHeight: barHeight || 1, percentTop: 95 - barHeight }];
        }

        const chunks: BarChunk[] = [];
        const range = chartRange.max - chartRange.min;
        let curIndex = index;

        const funcBarHeight = (bar: BarProps) => Math.abs(bar.value) / range * 100;
        const barTop = (chartRange.max - Math.max(0, bars[index].value)) / range * 100;

        while (curIndex >= 0) {
            const bar = bars[curIndex];
            let barHeight = funcBarHeight(bar);
            if (curIndex > 0) {
                // If bar has went down in value, or previous bar was empty, just render
                // 1 chunk
                if (bar.value < bars[curIndex - 1].value || bars[curIndex - 1].empty) {
                    chunks.push({ percentHeight: barHeight, percentTop: barTop });
                    break;
                }

                barHeight -= funcBarHeight(bars[curIndex - 1]);
            }

            chunks.push({ percentHeight: barHeight, percentTop: barTop });
            curIndex--;
        }

        // If total bar height would be less than user-defined min, use 1 chunk of min height
        if (minBarHeight) {
            const totalBarHeight = chunks.reduce((a, b) => a + (b.percentHeight || 0), 0);
            if (totalBarHeight < minBarHeight) {
                return [{ percentHeight: minBarHeight, percentTop: 95 - minBarHeight }];
            }
        }

        return chunks;
    }

    // renders our categorical axis/labels
    private _renderCatAxis(quantAxisMarkers: number[]): JSX.Element {
        const { showQuantAxis } = this.props;
        const { bars } = this.state;

        const hasAxisLabels = bars.some((bar: BarProps) => !!bar.axisLabel);
        if (!hasAxisLabels) {
            return null;
        }

        const axisLabels = bars.map((bar: BarProps, index: number) => {
            const { axisLabel, className } = bar;
            const labelClass = buildClassString({
                'barchart__cat-axis-label': true,
                [className]: !!className
            });
            return <div key={index} className={labelClass}>{axisLabel || ''}</div>;
        });

        return (
            <div className="barchart__horiz-container no-grow">
                {
                    // To assure correct layout, render a placeholder/spacer to account
                    // for width of quant axis, which will properly position cat axis
                    // below chart body
                    showQuantAxis &&
                    <div className="barchart__quant-axis-placeholder">
                        {this._renderQuantAxisPlaceholder(quantAxisMarkers)}
                    </div>
                }
                <div className="barchart__cat-axis">
                    {axisLabels}
                </div>
            </div>
        );
    }
}

export default BarChart;
