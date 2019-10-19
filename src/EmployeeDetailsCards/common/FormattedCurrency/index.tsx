import * as React from 'react';
import { formatCurrency, FormatOptions } from '../../../CurrencyUtils';

// Signature of format function
export interface CurrencyFormatFunc {
    (
        val: number,                        // value to be formatted
        currency: string,                   // ISO 4217 currency code
        options: FormatOptions,             // formatting options to be applied
        callback: (result: string) => void  // to allow for async load of format library,
                                            // function to call back with formatted value
    ): void;
}

export interface FormattedCurrencyProps {
    currency?: string;                // The currency we're formatting to (defaults to USD)
    formatFunc?: CurrencyFormatFunc;  // (optional) format function to call
    options?: FormatOptions;          // Options specifying how to format
    val: number;                      // The actual number being formatted
    sensitiveValue?: boolean;         // Whether or not this currency value is sensitive/personal,
                                      // and should be hidden from MouseFlow
}

export interface FormattedCurrencyState {
    formattedValue: string;           // The formatted value to display, if available
}

// Component for displaying a currency value in formatted form
// Has basic built-in behavior (if Intl is present in browser), or allows for a
// function to be passed in to override the default behavior.
// The format function API is async to allow for dependency on async third-party library.
// Once formatted value is provided, the component display will be updated
class FormattedCurrency extends React.Component<FormattedCurrencyProps, FormattedCurrencyState> {
    private _isMounted: boolean;    // need to track isMounted to avoid setState() warnings
    private _handleFormattedValue: (result: string) => void;

    constructor(props: FormattedCurrencyProps) {
        super(props);
        this._isMounted = false;
        this._handleFormattedValue = this._onFormattedValue.bind(this);
        this.state = Object.assign({}, this.state, {
            formattedValue: ''
        });

        if (props) {
            this.componentWillReceiveProps(props);
        }
    }

    componentDidMount(): void {
        this._isMounted = true;
    }

    componentWillUnmount(): void {
        this._isMounted = false;
    }

    // When receiving a new value to display, call out to formatFunc
    // to format for us, or fallback to internal formatter
    componentWillReceiveProps(nextProps: FormattedCurrencyProps): void {
        const { formatFunc, val, currency, options } = nextProps;
        if (formatFunc) {
            formatFunc(val, currency, options, this._handleFormattedValue);
        } else {
            this._formatValue(val, currency, options);
        }
    }

    render(): JSX.Element {
        const { val, sensitiveValue } = this.props;
        const { formattedValue } = this.state;

        return (
            <span data-mf-replace-inner={sensitiveValue ? '***' : undefined}>
                {formattedValue || val}
            </span>
        );
    }

    private _onFormattedValue(formattedValue: string): void {
        const newState = { formattedValue };
        if (this._isMounted) {
            this.setState(newState);
        } else {
            // calling setState when not mounted results in warning from React
            this.state = Object.assign({}, this.state, newState);
        }
    }

    // Basic format function which will leverage Intl library if present, otherwise
    // will simply convert the number to a string with the correct # of fractional digits
    private _formatValue(val: number, currency: string, options: FormatOptions): void {
        this._onFormattedValue(formatCurrency(val, currency, options));
    }
}

export { FormattedCurrency };
export default FormattedCurrency;