export interface FormatOptions {
    abbreviate?: boolean;                 // abbreviate thousands to K, millions to M, etc
    fractionalDigits?: number;            // number of digits after the decimal
    includeThousandsSeparator?: boolean;  // whether to include commas
    showDecimalZeros?: boolean;           // include zeroes in decimals
}

interface Abbreviation {
    floor: number;
    suffix: string;
}

// Basic format function which will leverage Intl library if present, otherwise
// will simply convert the number to a string with the correct # of fractional digits
export const formatCurrency = (val: number, currency?: string, options?: FormatOptions): string => {
    let formattedValue: string;
    let abbreviation: Abbreviation = null;

    // Define abbreviations in *ascending* order by value
    const abbreviations: Abbreviation[] = [
        { floor: 1E3, suffix: 'K' },
        { floor: 1E6, suffix: 'M' },
        { floor: 1E9, suffix: 'B' }
    ];

    if (options && options.abbreviate) {
        for (let i = abbreviations.length - 1; i >= 0; i--) {
            if (val >= abbreviations[i].floor) {
                abbreviation = abbreviations[i];
                break;
            }
        }
    }

    if (abbreviation) {
        val /= abbreviation.floor;
    }

    // for small values (hourly pay, etc), show fractional digits as it's
    // relevant given the magnitude of the value
    const fractionalDigits = options ?
        options.fractionalDigits :
        Math.abs(val) < 100 ? 2 : 0;

    // tslint:disable-next-line no-any
    const intl = (window as any).Intl;
    if (intl) {
        const formatProps = {
            style: 'currency',
            currency: (currency && currency.length >= 3) ? currency.slice(0, 3) : 'USD',
            useGrouping: options ? options.includeThousandsSeparator : true,
            maximumFractionDigits: fractionalDigits,
            minimumFractionDigits: fractionalDigits,

            // Fix for behavior when formatting zero, ensuring proper number of digits
            // If value is 0, fractional digits is 2, and minSignificantDigits is 2,
            // this will format 0 as "0.0" instead of "0.00" as desired. However, with same
            // settings, 0.1 will be formatted as "0.10"
            minimumSignificantDigits: val === 0 ? fractionalDigits + 1 : undefined
        };

        const formatter = new intl.NumberFormat('en-US', formatProps);
        formattedValue = formatter.format(val);
    } else {
        formattedValue = val.toFixed(fractionalDigits);
    }

    if (options && options.showDecimalZeros === false) {
        const formattedValueParts = formattedValue.split('.');
        if (formattedValueParts.length === 2) {
            let decimalPart = formattedValueParts[1];
            const initLen = decimalPart.length;
            for (let i = initLen - 1; i >= 0; i--) {
                if (decimalPart[i] !== '0') {
                    break;
                }
                decimalPart = decimalPart.slice(0, i);
            }
            formattedValue = decimalPart.length > 0 ?
                            `${formattedValueParts[0]}.${decimalPart}` :
                            formattedValueParts[0];
        }
    }

    if (abbreviation) {
        formattedValue += abbreviation.suffix;
    }

    return formattedValue;
};