import { throttle, debounce } from '../index';

describe('TimingUtils', () => {
    // timed callback to spy on
    let timedCallback = (str: string, bool: boolean) => {};

    beforeEach(() => {
        timedCallback = jasmine.createSpy('timedCallback');
        jasmine.clock().install();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    describe('Throttle', () => {
        it('should invoke function parameter', () => {
            // throttled function to ensure only one call per animation frame
            const throttledTestFunction = throttle(timedCallback);
            throttledTestFunction('', false);
            expect(timedCallback).not.toHaveBeenCalled();
            jasmine.clock().tick(100);
            expect(timedCallback).toHaveBeenCalled();
        });

        it('should pass the most recent parametrs', () => {
            const throttledTestFunction = throttle(timedCallback);
            throttledTestFunction('a', false);
            throttledTestFunction('b', true);
            expect(timedCallback).not.toHaveBeenCalled();
            jasmine.clock().tick(100);
            expect(timedCallback).toHaveBeenCalledWith('b', true);
        });
    });

    describe('Debounce', () => {
        let debouncedFunction: typeof timedCallback;

        beforeEach(() => {
            // debounced function to ensure only one call within the interval
            debouncedFunction = debounce(timedCallback, 100);
        });

        it('should invoke function parameter', () => {
            debouncedFunction('', false);
            jasmine.clock().tick(150);
            expect(timedCallback).toHaveBeenCalled();
        });

        it('should call provided function only once despite being invoked multiple times', () => {
            for (let i = 0; i < 5; i++) {
                debouncedFunction('', false);
                jasmine.clock().tick(99);
            }
            jasmine.clock().tick(150);
            expect(timedCallback).toHaveBeenCalledTimes(1);
        });

        it('should call debounced function with most recent parameters', () => {
            let param = '';
            let boolParam = false;
            for (let i = 0; i < 5; i++) {
                param += 'a';
                boolParam = !boolParam;
                debouncedFunction(param, boolParam);
                jasmine.clock().tick(99);
            }
            jasmine.clock().tick(150);
            expect(timedCallback).toHaveBeenCalledTimes(1);
            expect(timedCallback).toHaveBeenCalledWith(param, boolParam);
        });
    });
});
