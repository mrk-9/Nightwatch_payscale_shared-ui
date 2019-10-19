import * as React from 'react';
import { shallow } from 'enzyme';
import { FormattedCurrency, CurrencyFormatFunc } from '../index';
import { FormatOptions } from '../../../../CurrencyUtils';

describe ('FormattedCurrency', () => {
    let oldIntl: {};
    beforeEach(() => {
        // ensure intl is null for test stability
        oldIntl = (window as any).Intl; // tslint:disable-line no-any
        (window as any).Intl = null;    // tslint:disable-line no-any
    });

    afterEach(() => {
        (window as any).Intl = oldIntl;    // tslint:disable-line no-any
    });

    it('should show raw value with no fractional digits if not passed format func', () => {
        const value = 11313.751;
        const result = shallow(<FormattedCurrency val={value}/>);
        expect(result.text()).toBe(value.toFixed(0));

        const negValue = -11313.751;
        const negResult = shallow(<FormattedCurrency val={negValue}/>);
        expect(negResult.text()).toBe(negValue.toFixed(0));
    });

    it('should show raw value with two fractional digits if not passed format func', () => {
        const value = 13.751;
        const result = shallow(<FormattedCurrency val={value}/>);
        expect(result.text()).toBe(value.toFixed(2));

        const negValue = -13.751;
        const negResult = shallow(<FormattedCurrency val={negValue}/>);
        expect(negResult.text()).toBe(negValue.toFixed(2));
    });

    it('should set mouseflow attribute on sensitive values', () => {
        const value = 11313.751;
        const result = shallow(<FormattedCurrency val={value} sensitiveValue={true}/>);
        expect(result.find('span').prop('data-mf-replace-inner')).toBeDefined();
    });

    it('should not set mouseflow attribute on non-sensitive values', () => {
        const value = 11313.751;
        const result = shallow(<FormattedCurrency val={value} sensitiveValue={false}/>);
        expect(result.find('span').prop('data-mf-replace-inner')).toBeUndefined();
    });

    describe('formatFunc', () => {
        it('should pass values to format func', () => {
            const value = 17.23;
            const currency = 'aaf';
            const options: FormatOptions = {
                fractionalDigits: 5,
                includeThousandsSeparator: false
            };

            const formatFunc: jasmine.Spy = jasmine.createSpy('format');
            shallow(
                <FormattedCurrency
                    val={value}
                    currency={currency}
                    options={options}
                    formatFunc={formatFunc}
                />
            );
            expect(formatFunc.calls.count()).toBe(1);
            expect(formatFunc.calls.mostRecent().args.slice(0, 3))
                .toEqual([value, currency, options]);
        });

        it('should render with formatted value when synchronous', () => {
            const value = 17.23;

            const formatFunc: CurrencyFormatFunc = (
                val: number,
                currency: String,
                options: FormatOptions,
                callback: (result: string) => void): void => {
                callback(`***${val}`);
            };

            const result = shallow(
                <FormattedCurrency
                    val={value}
                    currency={''}
                    options={{}}
                    formatFunc={formatFunc}
                />
            );
            expect(result.text()).toBe(`***${value}`);
        });

        it('should render with formatted value when asynchronous', () => {
            const value = 17.23;

            let savedCallback: Function;
            const formatFunc: CurrencyFormatFunc = (
                val: number,
                currency: String,
                options: FormatOptions,
                callback: (result: string) => void): void => {
                savedCallback = callback;
            };

            const result = shallow(
                <FormattedCurrency
                    val={value}
                    currency={''}
                    options={{}}
                    formatFunc={formatFunc}
                />
            );
            expect(result.text()).toBe(value.toString());
            savedCallback(`***${value}`);
            result.update();
            expect(result.text()).toBe(`***${value}`);
        });
    });

    describe('options', () => {
        it('should not include thousands separator by default', () => {
            const value = 1313;
            const result = shallow(<FormattedCurrency val={value}/>);
            expect(result.text()).toBe('1313');
        });

        it('should include zero fractional digits by default', () => {
            const value = 1313.753;
            const result = shallow(<FormattedCurrency val={value}/>);
            expect(result.text()).toBe('1314');
        });

        it('should apply fractional digits option', () => {
            const value = 1313.753;
            const result = shallow(
                <FormattedCurrency
                    val={value}
                    options={{fractionalDigits: 1}}
                />);
            expect(result.text()).toBe('1313.8');
        });
    });
});
