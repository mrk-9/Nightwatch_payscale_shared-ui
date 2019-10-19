import {
    parsePath,
    parseQueryParams } from '../index';

describe('HistoryUtils', () => {
    describe('parsePath()', () => {
        describe('protocol', () => {
            it('should parse http', () => {
                const location = parsePath('http://www.underpaid.com');
                expect(location.protocol).toBe('http:');
            });

            it('should parse https', () => {
                const location = parsePath('https://www.underpaid.com');
                expect(location.protocol).toBe('https:');
            });

            it('should parse ftp', () => {
                const location = parsePath('ftp://ftp.underpaid.com');
                expect(location.protocol).toBe('ftp:');
            });

            it('should return empty string when no protocol', () => {
                const location = parsePath('www.underpaid.com');
                expect(location.protocol).toBe('');
            });
        });

        describe('hostName', () => {
            it('should parse basic hostname', () => {
                const location = parsePath('http://underpaid.com');
                expect(location.hostName).toBe('underpaid.com');
            });

            it('should parse complex hostname', () => {
                const location = parsePath('http://www.underpaid.com');
                expect(location.hostName).toBe('www.underpaid.com');
            });

            it('should parse hostname with no protocol', () => {
                const location = parsePath('www.underpaid.com');
                expect(location.hostName).toBe('www.underpaid.com');
            });
        });

        describe('port', () => {
            it('should parse port if provided', () => {
                const location = parsePath('http://underpaid.com:9004');
                expect(location.port).toBe('9004');
            });

            it('should return empty string if no port provided', () => {
                const location = parsePath('http://underpaid.com');
                expect(location.port).toBe('');
            });

            it('should parse port if provided yet no protocol', () => {
                const location = parsePath('underpaid.com:9004');
                expect(location.port).toBe('9004');
            });
        });

        describe('host', () => {
            it('should include hostname and port if provided', () => {
                const location = parsePath('http://underpaid.com:9004');
                expect(location.host).toBe('underpaid.com:9004');
            });

            it('should include only hostname if no port provided', () => {
                const location = parsePath('http://underpaid.com');
                expect(location.host).toBe('underpaid.com');
            });

            it('should return empty string if not hostname', () => {
                const location = parsePath('http://:5000');
                expect(location.host).toBe('');
            });
        });

        describe('pathname', () => {
            it('should include simple path', () => {
                const location = parsePath('http://underpaid.com:9004/my');
                expect(location.pathname).toBe('/my');
            });

            it('should include simple path that ends in slash', () => {
                const location = parsePath('http://underpaid.com:9004/my/');
                expect(location.pathname).toBe('/my/');
            });

            it('should include complex path', () => {
                const location = parsePath('http://underpaid.com:9004/my/spoon/is/too/big');
                expect(location.pathname).toBe('/my/spoon/is/too/big');
            });
        });

        describe('origin', () => {
            it('should include protocol, hostname, and port', () => {
                const location = parsePath('http://underpaid.com:9004/my/spoon');
                expect(location.origin).toBe('http://underpaid.com:9004');
            });

            it('should include protocol and hostname if no port', () => {
                const location = parsePath('https://underpaid.com/my/spoon');
                expect(location.origin).toBe('https://underpaid.com');
            });
        });

        describe('search', () => {
            it('should return empty search when not present', () => {
                const pathname = '/mypath';

                const location = parsePath(`${pathname}`);
                expect(location.pathname).toBe(pathname);
                expect(location.search).toBe('');
            });

            it('should return empty search when no text after ?', () => {
                const pathname = '/mypath';

                const location = parsePath(`${pathname}?`);
                expect(location.pathname).toBe(pathname);
                expect(location.search).toBe('');
            });

            it('should parse search when present', () => {
                const pathname = '/mypath';
                const search = '?mySearch';

                const location = parsePath(`${pathname}${search}`);
                expect(location.pathname).toBe(pathname);
                expect(location.search).toBe(search);
            });
        });

        describe('hash', () => {
            it('should return empty hash when not present', () => {
                const pathname = '/mypath';

                const location = parsePath(`${pathname}`);
                expect(location.pathname).toBe(pathname);
                expect(location.hash).toBe('');
            });

            it('should return empty hash when no text after hash', () => {
                const pathname = '/mypath';

                const location = parsePath(`${pathname}#`);
                expect(location.pathname).toBe(pathname);
                expect(location.hash).toBe('');
            });

            it('should parse hash when present', () => {
                const pathname = '/mypath';
                const hash = '#myhash';

                const location = parsePath(`${pathname}${hash}`);
                expect(location.pathname).toBe(pathname);
                expect(location.hash).toBe(hash);
            });

            it('should parse hash when no pathname', () => {
                const origin = 'http://foo.bar';
                const hash = '#hashyhash';
                const location = parsePath(`${origin}${hash}`);
                expect(location.hash).toBe(hash);
            });
        });

        it('should parse all components when present', () => {
            const protocol = 'http:';
            const port = '5678';
            const hostName = 'www.underpaid.com';
            const pathname = '/mypath/subpath';
            const search = '?mySearch';
            const hash = '#myhash';

            const location = parsePath(`${protocol}//${hostName}:${port}${pathname}${search}${hash}`);
            expect(location.protocol).toBe(protocol);
            expect(location.hostName).toBe(hostName);
            expect(location.port).toBe(port);
            expect(location.pathname).toBe(pathname);
            expect(location.search).toBe(search);
            expect(location.hash).toBe(hash);
        });
    });

    describe('parseQueryParams()', () => {
        it('should return empty object when passed empty string', () => {
            const result = parseQueryParams('');
            expect(typeof result).toBe('object');
            expect(Object.keys(result).length).toBe(0);
        });

        it('should return empty object when passed null', () => {
            const result = parseQueryParams(null);
            expect(typeof result).toBe('object');
            expect(Object.keys(result).length).toBe(0);
        });

        it('should return empty object when passed question mark', () => {
            const result = parseQueryParams('?');
            expect(typeof result).toBe('object');
            expect(Object.keys(result).length).toBe(0);
        });

        it('should parse single parameter', () => {
            const key = 'foo';
            const value = 'bar';
            const result = parseQueryParams(`?${key}=${value}`);
            expect(typeof result).toBe('object');
            expect(Object.keys(result).length).toBe(1);
            expect(result[key]).toBe(value);
        });

        it('should parse multiple parameters', () => {
            const key1 = 'foo';
            const value1 = 'bar';
            const key2 = 'key2';
            const value2 = 'value2';
            const result = parseQueryParams(`?${key1}=${value1}&${key2}=${value2}`);
            expect(typeof result).toBe('object');
            expect(Object.keys(result).length).toBe(2);
            expect(result[key1]).toBe(value1);
            expect(result[key2]).toBe(value2);
        });

        it('should parse parameter with key but  no value', () => {
            const key = 'foo';
            const result = parseQueryParams(`?${key}=`);
            expect(typeof result).toBe('object');
            expect(Object.keys(result).length).toBe(1);
            expect(result[key]).toBe('');
        });

        it('should handle escaped characters', () => {
            const key = 'foo';
            const value = 'foo bar'; // ' ' = %20
            const result = parseQueryParams(`?${key}=${encodeURIComponent(value)}`);
            expect(typeof result).toBe('object');
            expect(Object.keys(result).length).toBe(1);
            expect(result[key]).toBe(value);
        });

        it('should return array of values for repeated key', () => {
            const key = 'foo';
            const value1 = 'bar';
            const value2 = 'value2';
            const result = parseQueryParams(`?${key}=${value1}&${key}=${value2}`);
            expect(typeof result).toBe('object');
            expect(Object.keys(result).length).toBe(1);
            expect(Array.isArray(result[key])).toBe(true);
            expect(result[key].length).toBe(2);
            expect(result[key][0]).toBe(value1);
            expect(result[key][1]).toBe(value2);
        });

        it('should return array of values for thrice-repeated key', () => {
            const key = 'foo';
            const value1 = 'bar';
            const value2 = 'value2';
            const value3 = 'value3';
            const result = parseQueryParams(`?${key}=${value1}&${key}=${value2}&${key}=${value3}`);
            expect(typeof result).toBe('object');
            expect(Object.keys(result).length).toBe(1);
            expect(Array.isArray(result[key])).toBe(true);
            expect(result[key].length).toBe(3);
            expect(result[key][0]).toBe(value1);
            expect(result[key][1]).toBe(value2);
            expect(result[key][2]).toBe(value3);
        });
    });
});
