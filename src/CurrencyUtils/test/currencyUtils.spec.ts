import { formatCurrency } from '../index';

describe('currencyUtils', () => {
    describe('without intl', () => {
        let oldIntl: {};
        beforeEach(() => {
            // ensure intl is null for test stability
            oldIntl = (window as any).Intl; // tslint:disable-line no-any
            (window as any).Intl = null;    // tslint:disable-line no-any
        });

        afterEach(() => {
            (window as any).Intl = oldIntl;    // tslint:disable-line no-any
        });

        describe('formatCurrency', () => {
            it('should not abbreviate by default', () => {
                expect(formatCurrency(1000)).toBe('1000');
            });

            it('should handle abbreviations', () => {
                expect(formatCurrency(999, null, { abbreviate: true })).toBe('999');
                expect(formatCurrency(1000, null, { abbreviate: true })).toBe('1K');
                expect(formatCurrency(1100, null, { abbreviate: true })).toBe('1K');

                expect(formatCurrency(1100, null, { abbreviate: true, fractionalDigits: 1 })).toBe('1.1K');
                expect(formatCurrency(1100, null, { abbreviate: true, fractionalDigits: 2 })).toBe('1.10K');
                expect(formatCurrency(85123, null, { abbreviate: true, fractionalDigits: 1 })).toBe('85.1K');

                expect(formatCurrency(90000, null, { abbreviate: true, fractionalDigits: 1, showDecimalZeros: false }))
                    .toBe('90K');
                expect(formatCurrency(90500, null, { abbreviate: true, fractionalDigits: 2, showDecimalZeros: false }))
                    .toBe('90.5K');

                expect(formatCurrency(1000000, null, { abbreviate: true })).toBe('1M');
                expect(formatCurrency(1000000000, null, { abbreviate: true })).toBe('1B');
            });

            it('should not show decimals by default', () => {
                expect(formatCurrency(1000.123)).toBe('1000');
            });

            it('should default to 2 decimals for amounts less than 100', () => {
                expect(formatCurrency(99.123)).toBe('99.12');
            });

            it('should handle fractional digits', () => {
                expect(formatCurrency(1, null, { fractionalDigits: 3 })).toBe('1.000');
                expect(formatCurrency(1.123, null, { fractionalDigits: 1 })).toBe('1.1');
                expect(formatCurrency(1.123, null, { fractionalDigits: 2 })).toBe('1.12');
                expect(formatCurrency(1.123, null, { fractionalDigits: 3 })).toBe('1.123');
            });

            it('should remove decimal zeros', () => {
                expect(formatCurrency(1, null, { fractionalDigits: 3, showDecimalZeros: false })).toBe('1');
                expect(formatCurrency(1.1, null, { fractionalDigits: 3, showDecimalZeros: false })).toBe('1.1');
                expect(formatCurrency(1.11, null, { fractionalDigits: 3, showDecimalZeros: false })).toBe('1.11');
            });
        });
    });

    describe('with intl', () => {
        beforeEach(() => {
            // tslint:disable-next-line no-any
            if (!(window as any).Intl) {
                pending('Intl not present. Skipping.');
            }
        });

        it('should default to USD', () => {
            expect(formatCurrency(1000, null, { includeThousandsSeparator: true })).toBe('$1,000.00');
        });

        it('should include currency symbol', () => {
            expect(formatCurrency(1000, 'USD', { includeThousandsSeparator: true })).toBe('$1,000.00');
            expect(formatCurrency(1000, 'EUR', { includeThousandsSeparator: true })).toBe('€1,000.00');
        });

        it('should include thousands separator by default', () => {
            expect(formatCurrency(1000)).toBe('$1,000');
        });

        it('should handle thousands separator', () => {
            expect(formatCurrency(1000, null, { includeThousandsSeparator: false })).toBe('$1000.00');
        });

        it('should properly format zero', () => {
            expect(formatCurrency(0)).toBe('$0.00');
        });

        it('should handle decimals', () => {
            expect(formatCurrency(1, null, { fractionalDigits: 3 })).toBe('$1.000');
            expect(formatCurrency(1.123, null, { fractionalDigits: 1 })).toBe('$1.1');
            expect(formatCurrency(1.123, null, { fractionalDigits: 2 })).toBe('$1.12');
            expect(formatCurrency(1.123, null, { fractionalDigits: 3 })).toBe('$1.123');
        });
    });
});