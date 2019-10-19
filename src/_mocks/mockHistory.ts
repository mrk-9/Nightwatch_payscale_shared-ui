class MockHistory implements History {
    length: number;
    scrollRestoration: ScrollRestoration;
    state: object;

    private _stateStack: Object[];
    private _locationStack: string[];
    private _stackIndex: number;
    private _locationCallback: (href?: string, pathname?: string, search?: string, hash?: string) => void;
    private _popStateCallback: Function;

    constructor(
        locationCallback: (href?: string, pathname?: string, search?: string, hash?: string) => void,
        popStateCallback: Function
    ) {
        this.length = 0,
        this.scrollRestoration = 'auto';
        this.state =  {};
        this._stateStack = [];
        this._locationStack = [];
        this._stackIndex = -1;
        this.length = 0;
        this._locationCallback = locationCallback;
        this._popStateCallback = popStateCallback;
    }

    back(): void {
        if (this._stackIndex === -1) {
            return;
        }

        --this._stackIndex;
        this._updateState();
        this._updateLocation();
        this._notifyPop();
    }

    forward(): void {
        if (this._stackIndex === this.length - 1) {
            return;
        }

        ++this._stackIndex;
        this._updateState();
        this._updateLocation();
        this._notifyPop();
    }

    go(delta?: number): void {
        this._stackIndex += delta;
        this._stackIndex = Math.max(0, Math.min(this._stackIndex, this.length - 1));
        this._updateState();
        this._updateLocation();
        this._notifyPop();
    }

    pushState(data: Object, title: string, url?: string | null): void {
        this._stateStack = this._stateStack.slice(0, this._stackIndex + 1);
        this._locationStack = this._locationStack.slice(0, this._stackIndex + 1);
        this._stateStack.push(data);
        this._locationStack.push(url);
        this._stackIndex++;
        this.length = this._locationStack.length;
        this._updateState();
        this._updateLocation();
    }

    replaceState(data: Object, title: string, url?: string | null): void {
        if (this._stackIndex === -1) {
            this._stackIndex = 0;
            this.length = 1;
        }
        this._stateStack[this._stackIndex] = data;
        this._locationStack[this._stackIndex] = url;
        this._updateState();
        this._updateLocation();
    }

    private _updateLocation(): void {
        if (this._locationCallback) {
            const curLocation = this._locationStack[this._stackIndex];
            this._locationCallback(curLocation, curLocation, null, null);
        }
    }

    private _notifyPop(): void {
        if (this._popStateCallback) {
            const curState = this._stateStack[this._stackIndex];
            this._popStateCallback(curState);
        }
    }

    private _updateState(): void {
        this.state = this._stackIndex >= 0 ? this._stateStack[this._stackIndex] : {};
    }
}

export { MockHistory };
export default MockHistory;
