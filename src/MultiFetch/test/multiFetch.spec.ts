import multiFetch from '../index';

describe('multiFetch', () => {

    const spyOnFetch = <T>(returnObject: T, delay: number = 0, numberOfDelayedCalls: number = -1): jasmine.Spy => {
        let count: number = 0;
        return spyOn(window, 'fetch').and.callFake(() => {
            const response = {
                ok: true,
                json: () =>
                    new Promise<T>(r => r(returnObject)),
                headers: {
                    get: (key: string) => key
                }
            };

            return delay && (numberOfDelayedCalls === -1 || ++count <= numberOfDelayedCalls) ?
                new Promise((res, rej) => setTimeout(() => res(response), delay)) :
                new Promise((res, rej) => res(response));
        });
    };

    it('should call fetch', async () => {
        // tslint:disable-next-line no-any
        const expected: any = { order: 'fish tacos' };
        const fetchSpy = spyOnFetch(expected);
        const url = '/fancyfishdinner';

        const result = await multiFetch(url, undefined, undefined, undefined, undefined);

        expect(fetchSpy.calls.count()).toBe(1);
        expect(fetchSpy.calls.mostRecent().args[0]).toBe(url);

        const actual = await result.json();
        expect(actual).toBe(expected);
    });

    it('should reject on timeout', async (done: Function) => {
        // tslint:disable-next-line no-any
        const expected: any = { order: 'fish tacos' };
        const delay: number = 5000;
        const fetchSpy = spyOnFetch(expected, delay);
        const url = '/fancyfishdinner';

        let errorMessage = '';
        try {
            await multiFetch(url, undefined, 1, 10, 50);
        } catch (error) {
            errorMessage = error.message;
        }

        expect(fetchSpy.calls.count()).toBe(1);
        expect(errorMessage).toBe('Request timed out');
        done();
    });

    it('should reject on timeout after all retries', async (done: Function) => {
        // tslint:disable-next-line no-any
        const expected: any = { order: 'fish tacos' };
        const delay: number = 5000;
        const fetchSpy = spyOnFetch(expected, delay);
        const url = '/fancyfishdinner';

        let errorMessage = '';
        try {
            await multiFetch(url, undefined, 3, 10, 10);
        } catch (error) {
            errorMessage = error.message;
        }
        expect(fetchSpy.calls.count()).toBe(3);
        expect(errorMessage).toBe('Request timed out');
        done();
    });

    it('should reject on 404 with retry-header after all retries', async (done: Function) => {
        const url = '/fancyfishdinner';

        // mock fetch headers object, as apparently you can't just create
        // one here
        const headers = {
            get: (key: string) => key === 'Retry-After' ? '0.01' : null
        };
        const fetchSpy = spyOn(window, 'fetch').and.callFake(() => {
            return new Promise((res, rej) => {
                setTimeout(() => res({
                    status: 404,
                    headers
                }), 10);
            });
        });

        let errorMessage = '';
        try {
            await multiFetch(url, undefined, 3, 10, 500);
        } catch (error) {
            errorMessage = error.message;
        }
        expect(fetchSpy.calls.count()).toBe(3);
        expect(errorMessage).toBe('404');
        done();
    });

    it('should resolve even after a timeout', async (done: Function) => {
        // tslint:disable-next-line no-any
        const expected: any = { order: 'fish tacos' };
        const delay: number = 1000;
        const fetchSpy = spyOnFetch(expected, delay, 1);
        const url = '/fancyfishdinner';

        const result = await multiFetch(url, undefined, 3, 50, 500);
        expect(fetchSpy.calls.count()).toBe(2);
        const actual = await result.json();
        expect(actual).toBe(expected);

        done();
    });

    it('should reject if fetch throws an Error', async () => {
        const noStockError = new Error(`We're out of that`);

        spyOn(window, 'fetch').and.callFake(() => {
            return new Promise((res, rej) => { throw noStockError; });
        });

        try {
            await multiFetch('/fancyfishdiner', undefined, 1, 0, 500);
        } catch (error) {
            expect(error).toBe(noStockError);
        }
    });
});
