import {
    isArrayNullOrEmpty,
    arrayToDictionary } from '../index';

describe('arrayUtils', () => {
    describe('isArrayNullOrEmpty', () => {
        it('should return true when passed null', () => {
            expect(isArrayNullOrEmpty(null)).toBe(true);
        });

        it('should return true when passed undefined', () => {
            expect(isArrayNullOrEmpty(undefined)).toBe(true);
        });

        it('should return true when passed an empty array', () => {
            expect(isArrayNullOrEmpty([])).toBe(true);
        });

        it('should return false when passed an array with one item', () => {
            expect(isArrayNullOrEmpty([6])).toBe(false);
        });

        it('should return false when passed an array with multiple items', () => {
            expect(isArrayNullOrEmpty([6, 3])).toBe(false);
        });
    });

    describe('arrayToDictionary', () => {
        it('should return empty dictionary when passed null', () => {
            expect(arrayToDictionary(null)).toEqual({});
        });

        it('should return empty dictionary when passed undefined', () => {
            expect(arrayToDictionary(undefined)).toEqual({});
        });

        it('should return empty dictionary when passed empty array', () => {
            expect(arrayToDictionary([])).toEqual({});
        });

        it('should use numeric keys when not passed a getKey function', () => {
            const expected = {
                0: 'zero',
                1: 'one'
            };

            expect(arrayToDictionary(['zero', 'one'])).toEqual(expected);
        });

        it('should defined keys based on getKey function', () => {
            const expected = {
                zero: 'zero',
                one: 'one'
            };

            const getKey = (item: string): string => item;
            expect(arrayToDictionary(['zero', 'one'], getKey)).toEqual(expected);
        });
    });
});
