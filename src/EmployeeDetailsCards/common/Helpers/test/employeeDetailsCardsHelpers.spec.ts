import { normalizePayRange, PayRange, hourlyConversionFactor } from '../index';

describe('EmployeeDetailsCardsHelpers', () => {
    describe('normalizePayRange', () => {
        it('should do no conversion if pay and range are hourly', () => {
            const rangeMin = 2013;
            const rangeMax = 3987;
            const pay = 2357;
            const hourlyPay = true;
            const hourlyRange = true;

            const normalizedRange: PayRange = normalizePayRange(pay, hourlyPay, rangeMin, rangeMax, hourlyRange);
            expect(normalizedRange.rangeMin).toBe(rangeMin);
            expect(normalizedRange.rangeMax).toBe(rangeMax);
        });

        it('should do no conversion if pay and range are annual', () => {
            const rangeMin = 20130;
            const rangeMax = 39870;
            const pay = 23570;
            const hourlyPay = true;
            const hourlyRange = true;

            const normalizedRange: PayRange = normalizePayRange(pay, hourlyPay, rangeMin, rangeMax, hourlyRange);
            expect(normalizedRange.rangeMin).toBe(rangeMin);
            expect(normalizedRange.rangeMax).toBe(rangeMax);
        });

        it('should convert range to hourly if pay hourly and range annual', () => {
            const rangeMin = 20130;
            const rangeMax = 39870;
            const pay = 2357;
            const hourlyPay = true;
            const hourlyRange = false;

            const normalizedRange: PayRange = normalizePayRange(pay, hourlyPay, rangeMin, rangeMax, hourlyRange);
            expect(normalizedRange.rangeMin).toBe(rangeMin / hourlyConversionFactor);
            expect(normalizedRange.rangeMax).toBe(rangeMax / hourlyConversionFactor);
        });

        it('should convert range to annual if pay is annual and range hourly', () => {
            const rangeMin = 2013;
            const rangeMax = 3987;
            const pay = 23570;
            const hourlyPay = false;
            const hourlyRange = true;

            const normalizedRange: PayRange = normalizePayRange(pay, hourlyPay, rangeMin, rangeMax, hourlyRange);
            expect(normalizedRange.rangeMin).toBe(rangeMin * hourlyConversionFactor);
            expect(normalizedRange.rangeMax).toBe(rangeMax * hourlyConversionFactor);
        });
    });
});
