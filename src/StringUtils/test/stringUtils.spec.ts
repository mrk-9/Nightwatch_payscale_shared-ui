import {
    replaceTokens,
    buildClassString } from '../index';

describe('StringUtils', () => {
    describe('replaceTokens', () => {
        it('should replace a single token', () => {
            const formatStr = 'mmm, tastes like {0}';
            const parameter = 'chicken';
            const expectedResult = 'mmm, tastes like chicken';

            const result = replaceTokens(formatStr, parameter);
            expect(result).toBe(expectedResult);
        });

        it('should replace multiple tokens', () => {
            const formatStr = 'the {0} goes {1}';
            const parameter1 = 'cow';
            const parameter2 = 'mooooo!';
            const expectedResult = 'the cow goes mooooo!';

            const result = replaceTokens(formatStr, parameter1, parameter2);
            expect(result).toBe(expectedResult);
        });

        it('should replace a repeated token', () => {
            const formatStr = 'do the {0}, come on and do the {0}';
            const parameter = 'Humpty Hump';
            const expectedResult = 'do the Humpty Hump, come on and do the Humpty Hump';

            const result = replaceTokens(formatStr, parameter);
            expect(result).toBe(expectedResult);
        });

        it('should replace multiple repeated tokens', () => {
            const formatStr = 'My {0} is too {1}.  My {0} is too {1}!';
            const parameter1 = 'spoon';
            const parameter2 = 'big';
            const expectedResult = 'My spoon is too big.  My spoon is too big!';

            const result = replaceTokens(formatStr, parameter1, parameter2);
            expect(result).toBe(expectedResult);
        });

        it('should not recursively replace', () => {
            const formatStr = 'the {0} goes {1}';
            const parameter1 = '{1}';
            const parameter2 = 'mooooo!';
            const expectedResult = 'the {1} goes mooooo!';

            const result = replaceTokens(formatStr, parameter1, parameter2);
            expect(result).toBe(expectedResult);
        });

        it('should not replace tokens if value not present', () => {
            const formatStr = 'the {0} goes {1}';
            const parameter1 = 'cow';
            const expectedResult = 'the cow goes {1}';

            const result = replaceTokens(formatStr, parameter1);
            expect(result).toBe(expectedResult);
        });
    });

    describe('buildClassString', () => {
        it('should include single class if true passed', () => {
            const className = 'foo';
            const result = buildClassString({
                [className]: true
            });
            expect(result).toBe(className);
        });

        it('should exclude single class if false passed', () => {
            const className = 'foo';
            const result = buildClassString({
                [className]: false
            });
            expect(result).toBe('');
        });

        it('should include multiple classes if true passed', () => {
            const className1 = 'foo';
            const className2 = 'bar';
            const result = buildClassString({
                [className1]: true,
                [className2]: true
            });
            expect(result).toBe(`${className1} ${className2}`);
        });

        it('should exclude multiple classes if false passed', () => {
            const className1 = 'foo';
            const className2 = 'bar';
            const result = buildClassString({
                [className1]: false,
                [className2]: false
            });
            expect(result).toBe('');
        });

        it('should only include classes with true passed', () => {
            const className1 = 'foo';
            const className2 = 'bar';
            const result = buildClassString({
                [className1]: false,
                [className2]: true
            });
            expect(result).toBe(className2);
        });

        it('should handle undefined classname', () => {
            const className1 = 'foo';
            const className2: string = undefined;
            const result = buildClassString({
                [className1]: true,
                [className2]: !!className2
            });
            expect(result).toBe(className1);
        });
    });
});