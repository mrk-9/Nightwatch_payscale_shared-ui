// Given a string containing tokens '{0}', '{1}', etc, replaces them with the arguments
// passed to function and returns the resulting string.
// Example: replaceTokens('Hello {0}, happy {1}!', 'jim', 'monday') => 'Hello jim, happy monday!'
export const replaceTokens = (formatStr: string, ...valueArgs: Array<number|string|boolean> ): string => {
    // assume token values are passed in as extra arguments
    const tokenRegex = /{(\d+)}/g;
    const numValues = valueArgs.length;

    // replace tokens (eg '{0}') with the 0th arg, etc.
    return formatStr.replace(tokenRegex, (match, p1) => {
        return p1 < numValues ? valueArgs[+p1].toString() : match;
    });
};

// Given an dictionary of {string, boolean}, builds a space-delimited
// string of classes to apply to a DOM element.  Only values with a
// 'true' boolean value will be included
export interface ClassDictionary { [className: string]: boolean; }
export const buildClassString = (classNames: ClassDictionary): string => {
    const finalClassNames: string[] = [];
    Object.keys(classNames).forEach(className => {
        if (classNames[className] === true) {
            finalClassNames.push(className);
        }
    });
    return finalClassNames.join(' ');
};
