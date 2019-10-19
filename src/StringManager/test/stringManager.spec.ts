import StringManager from '../index';

describe('StringManager', () => {
    let stringManager: StringManager;

    // Helper to allow us to keep as much type-safety here as possible,
    // even though means of referencing strings requires use of any
    const lookupString = (moduleName: string, key: string): string => {
        // tslint:disable-next-line no-any
        return (stringManager as any)[moduleName][key];
    };

    beforeEach(() => {
        stringManager = new StringManager();
    });

    describe('load()', () => {
        it('should load single module', () => {
            const key1 = 'firstKey';
            const value1 = 'firstValue';
            const key2 = 'secondKey';
            const value2 = 'secondValue';
            const moduleName = 'testModule';
            stringManager.load(moduleName, {
                [key1]: value1,
                [key2]: value2
            });

            expect(lookupString(moduleName, key1)).toBe(value1);
            expect(lookupString(moduleName, key2)).toBe(value2);
        });

        it('should load multiple modules', () => {
            const key1 = 'firstKey';
            const value1 = 'firstValue';
            const key2 = 'secondKey';
            const value2 = 'secondValue';
            const module1Name = 'testModule1';
            const module2Name = 'testModule2';
            stringManager.load(module1Name, {
                [key1]: value1
            });
            stringManager.load(module2Name, {
                [key2]: value2
            });

            expect(lookupString(module1Name, key1)).toBe(value1);
            expect(lookupString(module1Name, key2)).toBeUndefined();
            expect(lookupString(module2Name, key2)).toBe(value2);
            expect(lookupString(module2Name, key1)).toBeUndefined();
        });

        it('should override existing module with same name', () => {
            const key1 = 'firstKey';
            const value1 = 'firstValue';
            const key2 = 'secondKey';
            const value2 = 'secondValue';
            const moduleName = 'testModule';
            stringManager.load(moduleName, {
                [key1]: value1
            });
            stringManager.load(moduleName, {
                [key2]: value2
            });

            expect(lookupString(moduleName, key1)).toBeUndefined();
            expect(lookupString(moduleName, key2)).toBe(value2);
        });

        it('should ignore load with no name', () => {
            const key1 = 'firstKey';
            const value1 = 'firstValue';
            const key2 = 'secondKey';
            const value2 = 'secondValue';
            const module1Name = 'testModule1';
            const module2Name = '';
            stringManager.load(module1Name, {
                [key1]: value1
            });
            stringManager.load(module2Name, {
                [key2]: value2
            });

            // basically just testing we didn't throw exception above
            expect(lookupString(module1Name, key1)).toBe(value1);
        });

        it('should ignore load with no strings', () => {
            const key1 = 'firstKey';
            const value1 = 'firstValue';
            const module1Name = 'testModule1';
            const module2Name = 'testModule2';
            stringManager.load(module1Name, {
                [key1]: value1
            });
            stringManager.load(module2Name, undefined);

            // basically just testing we didn't throw exception above
            expect(lookupString(module1Name, key1)).toBe(value1);
        });
    });

    describe('override()', () => {
        it('should override strings in existing module', () => {
            const key1 = 'firstKey';
            const value1 = 'firstValue';
            const key2 = 'secondKey';
            const value2 = 'secondValue';
            const value3 = 'thirdValue';
            const moduleName = 'testModule';
            stringManager.load(moduleName, {
                [key1]: value1,
                [key2]: value2
            });

            stringManager.override(moduleName, {
                [key1]: value3
            });

            expect(lookupString(moduleName, key1)).toBe(value3);
            expect(lookupString(moduleName, key2)).toBe(value2);
        });

        it('should treat override as load if module doesn\'t already exist', () => {
            const key1 = 'firstKey';
            const value1 = 'firstValue';
            const key2 = 'secondKey';
            const value2 = 'secondValue';
            const moduleName = 'testModule';
            stringManager.override(moduleName, {
                [key1]: value1,
                [key2]: value2
            });

            expect(lookupString(moduleName, key1)).toBe(value1);
            expect(lookupString(moduleName, key2)).toBe(value2);
        });
    });
});
