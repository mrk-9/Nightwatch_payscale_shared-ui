import MockHistory from 'mocks/mockHistory';

class MockWindow {
    history: History;
    location: Location;
    private _popStateListeners: EventListener[];

    constructor() {
        const locationCallback = (href?: string, pathname?: string, search?: string, hash?: string): void => {
            this._updateLocation(href, pathname, search, hash);
        };

        const popStateCallback = (state: Object): void => this._notifyPopState(state);

        this._popStateListeners = [];
        this.history = new MockHistory(locationCallback, popStateCallback);
        this.location = {
            hash: '',
            host: '',
            hostname: '',
            href: '',
            origin: '',
            pathname: '',
            port: '',
            protocol: '',
            search: '',
            assign: () => {},
            reload: () => {},
            replace: () => {},
            toString: (): string => ''
        } as unknown as Location;
    }

    addEventListener(type: string, listener: EventListener, useCapture?: boolean): void {
        if (type === 'popstate') {
            this._popStateListeners.push(listener);
        }
    }

    private _updateLocation(href?: string, pathname?: string, search?: string, hash?: string): void {
        this.location.href = href || '';
        this.location.pathname = pathname || '';
        this.location.search = search || '';
        this.location.hash = hash || '';
    }

    private _notifyPopState(state: Object): void {
        const event: PopStateEvent = {
            state
        } as PopStateEvent;

        this._popStateListeners.forEach(listener => listener(event));
    }
}

export { MockWindow };
export default MockWindow;
