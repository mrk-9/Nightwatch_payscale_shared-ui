import { parsePath } from '../HistoryUtils';
import LocationContext from '../Types/locationContext';
import HistoryApi from '../Types/historyApi';

export const enum NavigationAction {
    Unknown = 'unknown',
    Back = 'back',
    Forward = 'forward',
    Push = 'push',
    Replace = 'replace'
}

export interface NavigationListener {
    (location: LocationContext, action: NavigationAction): void;
}

export interface NavigationFilterCallback {
    (location: LocationContext, action: NavigationAction): boolean;
}

export interface HistoryState {
    historyIndex: number;
    historyStack: string[];
}

// Returns a LocationContext object representing the current browser location
// (exported solely for testing purposes)
export const getCurrentLocation = (windowRef: Window): LocationContext => {
    const location: Location = windowRef ? windowRef.location : {} as Location;
    return {
        hash: location.hash || '',
        host: location.host || '',
        hostName: location.hostname || '',
        href: location.href || '',
        origin: location.origin || '',
        pathname: location.pathname || '',
        port: location.port || '',
        protocol: location.protocol || '',
        search: location.search || ''
    };
};

// Returns true if a given popstate event is an extraneous WebKit event.
// Accounts for the fact that Chrome on iOS fires real popstate events
// containing undefined state when pressing the back button.
const isExtraneousPopstateEvent = (event: PopStateEvent): boolean => {
    return event && event.state === undefined && navigator.userAgent.indexOf('CriOS') === -1;
};

// Wrapper around html5 history API
// Largely inspired by: https://www.npmjs.com/package/history
export class BrowserHistory implements HistoryApi {
    // collection of registered filter callbacks
    private _navigationFilters: NavigationFilterCallback[];

    // collection of registered navigation listener callbacks
    private _navigationListeners: NavigationListener[];

    // Our own history stack to track navigation within our app.
    // Stack of hashes of urls
    private _historyStack: string[];

    // Current index into our history stack
    private _historyIndex: number;

    // if we're in the process of restoring to previous state when
    // 'pop' navigation (going back or forward in history) is rejected
    private _restoringPosition: boolean;

    // reference to window.history
    private _globalHistory: History;

    // event handler for global popState event
    private _popStateHandler: (event: PopStateEvent) => void;

    // reference to window object (which may be mocked) so that
    // we can inspect the current location
    private _window: Window;

    constructor(windowRef: Window) {
        this._navigationFilters = [];
        this._navigationListeners = [];
        this._restoringPosition = false;
        this._popStateHandler = (event: PopStateEvent) => this._handlePopState(event);

        this._window = windowRef;
        this._globalHistory = windowRef.history;
        windowRef.addEventListener('popstate', this._popStateHandler);

        // try to load off current stored state, if it exists
        const { historyStack, historyIndex } = BrowserHistory.getHistoryState(windowRef);
        if (historyStack && typeof historyIndex !== 'undefined') {
            this._historyStack = historyStack.slice(0);
            this._historyIndex = historyIndex;
            // if we load up our history and are at index 0, that means we've navigated
            // forward back into MX.  Index 0 is specially there to be able to capture
            // back navigations to block them, so move forward to index 1
            if (this._historyIndex === 0) {
                this._globalHistory.forward();
            }
        } else {
            this._initHistoryState();
        }
    }

    // Returns the current window/history state, or an empty
    // object if fails for some reason
    static getHistoryState(windowRef: Window): HistoryState {
        try {
            return windowRef.history.state || {};
        } catch (e) {
            // IE 11 sometimes throws when accessing window.history.state
            // See https://github.com/ReactTraining/history/pull/289
            return {} as HistoryState;
        }
    }

    // Returns the current location
    location(): LocationContext {
        return getCurrentLocation(this._window);
    }

    // Returns whether we can navigate backwards in the history
    // NOTE: this returns true only if the user has navigated forward
    // since the page was loaded
    canGoBack(): boolean {
        // this checks for '1' instead of '0' because we push
        // an extra element on the history stack in initHistoryState()
        // to ensure we can always filter 'back' navigation
        return this._historyIndex > 1;
    }

    // Navigate backwards in history one step
    goBack(): void {
        return this._globalHistory.back();
    }

    // Navigate forwards in history one step
    goForward(): void {
        return this._globalHistory.forward();
    }

    // Push a new URI onto the history stack, making that URI
    // the current one
    push(path: string): void {
        if (path === getCurrentLocation(this._window).pathname) {
            // turn pushes to same location into a replace
            return this.replace(path);
        }

        if (!this._allowNavigation(path, NavigationAction.Push)) {
            return;
        }

        const key = BrowserHistory._createKey();
        this._historyStack.splice(this._historyIndex + 1);
        this._historyStack.push(key);
        this._historyIndex += 1;

        this._globalHistory.pushState(this._getState(), '', path);
        this._notifyListeners(getCurrentLocation(this._window), NavigationAction.Push);
    }

    // Replace the current URI with the provided one
    // Doesn't add a history item to the stack
    replace(path: string): void {
        if (!this._allowNavigation(path, NavigationAction.Replace)) {
            return;
        }

        const key = BrowserHistory._createKey();
        this._historyStack[this._historyIndex] = key;

        this._globalHistory.replaceState(this._getState(), '', path);
        this._notifyListeners(getCurrentLocation(this._window), NavigationAction.Replace);
    }

    // Register a callback to be notified upon navigation
    // Returns a function which, when called, will unregister
    // the listener/callback passed in
    listen(callback: NavigationListener): { (): void } {
        this._navigationListeners = this._navigationListeners || [];
        this._navigationListeners.push(callback);
        return () => this._removeNavigationListener(callback);
    }

    // Adds a filter which will be called back on each pending navigation.
    // If the callback/filter returns 'true', navigation will be blocked
    // Returns a function which when called will unregister the listener/remove
    // the filter
    filter(filter: NavigationFilterCallback): { (): void } {
        this._navigationFilters = this._navigationFilters || [];
        this._navigationFilters.push(filter);
        return () => this._removeNavigationFilter(filter);
    }

    // PUBLIC FOR TESTING PURPOSES ONLY. DON'T CALL DIRECTLY
    // (keeping private naming convention)
    _removeNavigationFilter(filter: NavigationFilterCallback): void {
        if (!this._navigationFilters) { return; }

        const index = this._navigationFilters.indexOf(filter);
        if (index !== -1) {
            this._navigationFilters.splice(index, 1);
        }
    }

    // Creates a unique key to be used to represent a given location/entry
    // in the history stack.  A bit of magic here (just using random number),
    // but all that matters is we have a unique string to represent this location
    // in the history at this time
    private static _createKey(): string {
        return Math.random().toString(36).substr(2, 8);
    }

    // Builds + returns a HistoryState object representing the current
    // history stack and the current location within it
    private _getState(): HistoryState {
        return {
            historyStack: this._historyStack.slice(0),
            historyIndex: this._historyIndex
        };
    }

    // Event handler for window's PopState event, triggered whenever
    // the user navigates forward/back in the history
    private _handlePopState(event: PopStateEvent): void {
        // Ignore extraneous popstate events in WebKit.
        if (isExtraneousPopstateEvent(event)) {
            return;
        }

        // if we're trying to restore our position due to a rejected
        // backward/forward navigation, there's no bookkeeping/notification
        // to be done here, so just reset our internal state and return
        if (this._restoringPosition) {
            this._restoringPosition = false;
            return;
        }

        const location = getCurrentLocation(this._window);
        let navAction: NavigationAction = NavigationAction.Unknown;
        let foundIndex = -1;

        // Seeing errors in production in Safari9 (on OSX 10.11) where event.state is
        // null, so protect against that here
        if (event && event.state) {
            const { historyStack, historyIndex } = event.state;

            // try to figure out whether this is a forward or backward
            // navigation, so we can pass that information to registered
            // filters
            if (historyStack && typeof historyIndex !== 'undefined') {
                const key = historyStack[historyIndex];
                foundIndex = this._historyStack.indexOf(key);

                if (foundIndex >= 0 && foundIndex < this._historyIndex) {
                    navAction = NavigationAction.Back;
                } else if (foundIndex > this._historyIndex) {
                    navAction = NavigationAction.Forward;
                }
            }

            // Give filters opportunity to reject this navigation
            if (!this._allowNavigation(location.pathname, navAction)) {
                this._rejectPop(location, navAction, foundIndex);
                return;
            }

            if (historyIndex === 0 && navAction === NavigationAction.Back) {
                // Handle special case due to us automatically adding an extra
                // history element to make our life easier
                this._globalHistory.back();
            }
        }

        if (foundIndex === -1) {
            // bad things -- either the new location's state wasn't
            // stored correctly, or we just couldn't find the current item?
            // start over if that's the case
            this._initHistoryState();
        } else {
            this._historyIndex = foundIndex;
            this._globalHistory.replaceState(this._getState(), '', location.href);
        }

        this._notifyListeners(location, navAction);
    }

    // Restore state to where we were before the current Pop event, if possible
    private _rejectPop(location: LocationContext, action: NavigationAction, popIndex: number): void {
        if (popIndex === -1) {
            // if we don't know where we navigated to, we can't restore
            // to where we were, so reset our stat and notify listeners
            this._initHistoryState();
            this._notifyListeners(location, action);
        } else {
            const delta = this._historyIndex - popIndex;
            if (delta !== 0) {
                this._restoringPosition = true;
                this._globalHistory.go(delta);
            }
        }

        return;
    }

    // Initialize our internal history state
    private _initHistoryState(): void {
        this._historyIndex = 0;
        this._historyStack = [BrowserHistory._createKey()];
        this._globalHistory.replaceState(this._getState(), '', this._window.location.href);

        // ensure there's an extra item so we can catch 'back' button at all times
        this._historyStack.push(BrowserHistory._createKey());
        this._historyIndex = 1;
        this._globalHistory.pushState(this._getState(), '', this._window.location.href);
    }

    // Returns whether or not we should allow the proposed navigation, asking
    // any registered filters if they'd like to block
    private _allowNavigation(uri: string, action: NavigationAction): boolean {
        let block = false;
        const location = parsePath(uri);
        this._navigationFilters.forEach(filter => {
            block = filter(location, action) || block;
        });

        return !block;
    }

    // Notify all listeners of the current navigation change
    private _notifyListeners(location: LocationContext, action: NavigationAction): void {
        this._navigationListeners.forEach(listener => {
            listener(location, action);
        });
    }

    private _removeNavigationListener(listener: NavigationListener): void {
        if (!this._navigationListeners) { return; }

        const index = this._navigationListeners.indexOf(listener);
        if (index !== -1) {
            this._navigationListeners.splice(index, 1);
        }
    }
}

export default BrowserHistory;
