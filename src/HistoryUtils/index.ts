import LocationContext from '../Types/locationContext';

const protocolRegEx = '((?:https?|ftp):)?';
const hostRegEx = '([^\/\?:#]+)?';
const portRegEx = '(?::(\\d+))?';
const pathRegEx = '(\/?(?:[^\/\?#][^\?#]*)?)*';
const queryRegEx = '(\\?[^#]*)?';
const hashRegEx = '(#\\w*)?';
const urlRegEx = `^${protocolRegEx}(?:\/\/)?${hostRegEx}${portRegEx}${pathRegEx}${queryRegEx}${hashRegEx}\$`;

// Parses the specified path into a LocationContext object, separating
// out the pathname, search, and hash components
export const parsePath = (path: string): LocationContext => {
    const matches = path  && path.match(urlRegEx) || [];

    const href = matches[0] || '';
    const protocol = matches[1] || '';
    const hostName = matches[2] || '';
    const port = matches[3] || '';
    const pathname = matches[4] || '';
    const search = matches[5] || '';
    const hash = matches[6] || '';
    const host = hostName ? `${hostName}${port ? `:${port}` : ''}` : '';

    return {
        hash: hash.length > 1 ? hash : '',
        host,
        hostName,
        href,
        origin: (protocol && host) ? `${protocol}//${host}` : '',
        pathname,
        port,
        protocol,
        search: search.length > 1 ? search : ''
    };
};

// Parses a query string of form "?foo=bar&stuff=things" and returns a dictionary of
// key-value pairs (eg {foo: bar, stuff: things})
export const parseQueryParams = (queryString: string): {[key: string]: string|string[]} => {
    const params = {} as {[key: string]: string|string[]};
    if (!queryString) {
        return params;
    }

    const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (const paramStr of pairs) {
        if (!paramStr) { continue; }

        const pair = paramStr.split('=');
        const key = decodeURIComponent(pair[0]);
        const value = decodeURIComponent(pair[1] || '');

        const existingValue = params[key];
        if (existingValue != null) {
            // if key is repeated, should return array of values rather than overwrite
            // (at least that's what Mr Mike says)
            const values = (Array.isArray(existingValue) ? existingValue : [existingValue]) as string[];
            values.push(value);
            params[key] = values;
        } else {
            params[key] = value;
        }
    }

    return params;
};
