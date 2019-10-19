export interface PayRange {
    rangeMin: number;
    rangeMax: number;
}

export const hourlyConversionFactor = 2080;

// Normalizes pay range to match the units (hourly/annualized) of pay
export const normalizePayRange = (
    pay: number,
    hourlyPay: boolean,
    rangeMin: number,
    rangeMax: number,
    hourlyRange: boolean): PayRange => {

    let normalizedMin = rangeMin;
    let normalizedMax = rangeMax;
    let conversionFactor = 1;

    if (hourlyPay && !hourlyRange) {
        conversionFactor = hourlyConversionFactor;
    } else if (hourlyRange && !hourlyPay) {
        conversionFactor = 1 / hourlyConversionFactor;
    }

    if (normalizedMin) {
        normalizedMin /= conversionFactor;
    }

    if (normalizedMax) {
        normalizedMax /= conversionFactor;
    }

    return {
        rangeMin: normalizedMin,
        rangeMax: normalizedMax
    } as PayRange;
};
