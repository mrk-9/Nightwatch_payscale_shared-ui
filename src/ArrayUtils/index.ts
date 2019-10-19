// Returns whether the provided array is null or has zero elements
export const isArrayNullOrEmpty = <T>(arr: T[]): boolean => {
    return !arr || !arr.length;
};

// Given an array, returns a dictionary of items for constant-time lookup.
// getKey is provided as a means of mapping each item to the key used for
// lookup in dictionary
type GetKeyFunc<T> = (item: T) => string;
export const arrayToDictionary = <T>(arr: T[], getKey?: GetKeyFunc<T>): {[key: string]: T} => {
    const dict: {[key: string]: T} = {};
    if (!arr) {
        return dict;
    }

    arr.forEach((item, i) => {
        const key = getKey ? getKey(item) : i.toString();
        dict[key] = item;
    });

    return dict;
};
