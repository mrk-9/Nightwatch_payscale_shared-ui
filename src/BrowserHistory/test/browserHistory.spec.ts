import {
    BrowserHistory,
    NavigationAction,
    HistoryState,
    getCurrentLocation } from '../index';
import MockWindow from 'mocks/mockWindow';
import LocationContext from '../../Types/locationContext';

describe('History', () => {
    let mockWindow: Window;
    let history: BrowserHistory;

    beforeEach(() => {
        // tslint:disable-next-line no-any
        mockWindow = new MockWindow() as any as Window;
        history = new BrowserHistory(mockWindow);
    });

    describe('navigation listeners', () => {
        it('should notify listeners of pushes', () => {
            let notified = false;
            let receivedAction = NavigationAction.Unknown;
            let uri = '';

            const listener = (location: LocationContext, action: NavigationAction): void => {
                notified = true;
                receivedAction = action;
                uri = location.pathname;
            };

            const testUri = '/foobar';
            history.listen(listener);
            history.push(testUri);

            expect(notified).toBe(true);
            expect(receivedAction).toBe(NavigationAction.Push);
            expect(uri).toBe(testUri);
        });

        it('should notify listeners of replaces', () => {
            let notified = false;
            let receivedAction = NavigationAction.Unknown;
            let uri = '';

            const listener = (location: LocationContext, action: NavigationAction): void => {
                notified = true;
                receivedAction = action;
                uri = location.pathname;
            };

            const testUri = '/foobar';
            history.listen(listener);
            history.replace(testUri);

            expect(notified).toBe(true);
            expect(receivedAction).toBe(NavigationAction.Replace);
            expect(uri).toBe(testUri);
        });

        it('should notify listeners of pops', () => {
            let notified = false;
            let receivedAction = NavigationAction.Unknown;
            let uri = '';

            // push some values before attaching listener
            const testUri1 = '/foo';
            const testUri2 = '/bar';
            history.push(testUri1);
            history.push(testUri2);

            const listener = (location: LocationContext, action: NavigationAction): void => {
                notified = true;
                receivedAction = action;
                uri = location.pathname;
            };
            history.listen(listener);
            history.goBack();

            expect(notified).toBe(true);
            expect(receivedAction).toBe(NavigationAction.Back);
            expect(uri).toBe(testUri1);
        });

        it('should properly unregister listeners', () => {
            let notified = false;

            const listener = (location: LocationContext, action: NavigationAction): void => {
                notified = true;
            };
            const unlisten = history.listen(listener);
            history.push('foo');

            expect(notified).toBe(true);

            notified = false;
            unlisten();
            history.push('bar');
            expect(notified).toBe(false);
        });

        it('should notify a POP when going back in history', () => {
            let notified = false;
            let receivedAction = NavigationAction.Unknown;

            // push some values before attaching listener
            const testUri1 = '/foo';
            const testUri2 = '/bar';
            history.push(testUri1);
            history.push(testUri2);

            const listener = (location: LocationContext, action: NavigationAction): void => {
                notified = true;
                receivedAction = action;
            };
            history.listen(listener);
            history.goBack();

            expect(notified).toBe(true);
            expect(receivedAction).toBe(NavigationAction.Back);
        });

        it('should notify FORWARD when going forward in history', () => {
            let notified = false;
            let receivedAction = NavigationAction.Unknown;

            // push some values before attaching listener
            const testUri1 = '/foo';
            const testUri2 = '/bar';
            history.push(testUri1);
            history.push(testUri2);
            history.goBack();

            const listener = (location: LocationContext, action: NavigationAction): void => {
                notified = true;
                receivedAction = action;
            };
            history.listen(listener);
            history.goForward();

            expect(notified).toBe(true);
            expect(receivedAction).toBe(NavigationAction.Forward);
        });
    });

    describe('navigation filters', () => {
        describe('should be notified', () => {
            it('when pushing new location', () => {
                let notified = false;
                let receivedAction = NavigationAction.Unknown;
                let uri = '';

                const filter = (location: LocationContext, action: NavigationAction): boolean => {
                    notified = true;
                    receivedAction = action;
                    uri = location.pathname;
                    return false;
                };

                const testUri = '/foobar';
                history.filter(filter);
                history.push(testUri);

                expect(notified).toBe(true);
                expect(receivedAction).toBe(NavigationAction.Push);
                expect(uri).toBe(testUri);
            });

            it('when replacing location', () => {
                let notified = false;
                let receivedAction = NavigationAction.Unknown;
                let uri = '';

                const filter = (location: LocationContext, action: NavigationAction): boolean => {
                    notified = true;
                    receivedAction = action;
                    uri = location.pathname;
                    return false;
                };

                const testUri = '/foobar';
                history.push('/someplace');
                history.filter(filter);
                history.replace(testUri);

                expect(notified).toBe(true);
                expect(receivedAction).toBe(NavigationAction.Replace);
                expect(uri).toBe(testUri);
            });

            it('when going back in history', () => {
                let notified = false;
                let receivedAction = NavigationAction.Unknown;
                let uri = '';

                const filter = (location: LocationContext, action: NavigationAction): boolean => {
                    notified = true;
                    receivedAction = action;
                    uri = location.pathname;
                    return false;
                };

                const testUri = '/foobar';
                history.push(testUri);
                history.push('/someplace');
                history.filter(filter);
                history.goBack();

                expect(notified).toBe(true);
                expect(receivedAction).toBe(NavigationAction.Back);
                expect(uri).toBe(testUri);
            });

            it('when going forward in history', () => {
                let notified = false;
                let receivedAction = NavigationAction.Unknown;
                let uri = '';

                const filter = (location: LocationContext, action: NavigationAction): boolean => {
                    notified = true;
                    receivedAction = action;
                    uri = location.pathname;
                    return false;
                };

                const testUri = '/foobar';
                const testUri2 = '/someplace';
                history.push(testUri);
                history.push(testUri2);
                history.goBack();
                expect(history.location().pathname).toBe(testUri);

                history.filter(filter);
                history.goForward();

                expect(notified).toBe(true);
                expect(receivedAction).toBe(NavigationAction.Forward);
                expect(uri).toBe(testUri2);
            });
        });

        describe('should block navigaition when filtered', () => {

            it('on push', () => {
                let notified = false;
                let receivedAction = NavigationAction.Unknown;
                let uri = '';

                const filter = (location: LocationContext, action: NavigationAction): boolean => {
                    notified = true;
                    receivedAction = action;
                    uri = location.pathname;
                    return true;
                };

                const testUri = '/foobar';
                const testUri2 = '/someplace';
                history.push(testUri);
                expect(history.location().pathname).toBe(testUri);

                history.filter(filter);
                history.push(testUri2);

                expect(notified).toBe(true);
                expect(receivedAction).toBe(NavigationAction.Push);
                expect(uri).toBe(testUri2);
                expect(history.location().pathname).toBe(testUri);
            });

            it('on replace', () => {
                let notified = false;
                let receivedAction = NavigationAction.Unknown;
                let uri = '';

                const filter = (location: LocationContext, action: NavigationAction): boolean => {
                    notified = true;
                    receivedAction = action;
                    uri = location.pathname;
                    return true;
                };

                const testUri = '/foobar';
                const testUri2 = '/someplace';
                history.push(testUri);
                expect(history.location().pathname).toBe(testUri);

                history.filter(filter);
                history.replace(testUri2);

                expect(notified).toBe(true);
                expect(receivedAction).toBe(NavigationAction.Replace);
                expect(uri).toBe(testUri2);
                expect(history.location().pathname).toBe(testUri);
            });

            it('going backward', () => {
                let notified = false;
                let receivedAction = NavigationAction.Unknown;
                let uri = '';

                const filter = (location: LocationContext, action: NavigationAction): boolean => {
                    notified = true;
                    receivedAction = action;
                    uri = location.pathname;
                    return true;
                };

                const testUri = '/foobar';
                const testUri2 = '/someplace';
                history.push(testUri);
                history.push(testUri2);
                expect(history.location().pathname).toBe(testUri2);

                history.filter(filter);
                history.goBack();

                expect(notified).toBe(true);
                expect(receivedAction).toBe(NavigationAction.Back);
                expect(uri).toBe(testUri);
                expect(history.location().pathname).toBe(testUri2);
            });

            it('going forward', () => {
                let notified = false;
                let receivedAction = NavigationAction.Unknown;
                let uri = '';

                const filter = (location: LocationContext, action: NavigationAction): boolean => {
                    notified = true;
                    receivedAction = action;
                    uri = location.pathname;
                    return true;
                };

                const testUri = '/foobar';
                const testUri2 = '/someplace';
                history.push(testUri);
                history.push(testUri2);
                expect(history.location().pathname).toBe(testUri2);
                history.goBack();
                expect(history.location().pathname).toBe(testUri);

                history.filter(filter);
                history.goForward();

                expect(notified).toBe(true);
                expect(receivedAction).toBe(NavigationAction.Forward);
                expect(uri).toBe(testUri2);
                expect(history.location().pathname).toBe(testUri);
            });
        });

        describe('should not notify listeners when filtered', () => {
            it('on push', () => {
                history.listen((location: LocationContext, action: NavigationAction): void => {
                    notified = true;
                });
                history.filter((location: LocationContext, action: NavigationAction): boolean => {
                    return true;
                });

                let notified = false;
                history.push('foo');
                expect(notified).toBe(false);
            });

            it('on replace', () => {
                history.listen((location: LocationContext, action: NavigationAction): void => {
                    notified = true;
                });
                history.filter((location: LocationContext, action: NavigationAction): boolean => {
                    return true;
                });

                let notified = false;
                history.replace('foo');
                expect(notified).toBe(false);
            });

            it('going backward', () => {
                history.push('foo');
                history.push('bar');
                expect(history.canGoBack()).toBe(true);

                history.listen((location: LocationContext, action: NavigationAction): void => {
                    notified = true;
                });
                history.filter((location: LocationContext, action: NavigationAction): boolean => {
                    return true;
                });

                let notified = false;
                history.goBack();
                expect(notified).toBe(false);
            });

            it('going forward', () => {
                history.push('foo');
                history.push('bar');
                history.goBack();
                expect(history.location().pathname).toBe('foo');

                history.listen((location: LocationContext, action: NavigationAction): void => {
                    notified = true;
                });
                history.filter((location: LocationContext, action: NavigationAction): boolean => {
                    return true;
                });

                let notified = false;
                history.goForward();
                expect(notified).toBe(false);
            });
        });

        it('should be properly unregistered', () => {
            let notified = false;

            const filter = (location: LocationContext, action: NavigationAction): boolean => {
                notified = true;
                return false;
            };

            const testUri = '/foobar';
            const testUri2 = '/foobar2';
            const unfilter = history.filter(filter);
            history.push(testUri);
            expect(notified).toBe(true);

            notified = false;
            unfilter();
            history.push(testUri2);
            expect(notified).toBe(false);
        });
    });

    it('should turn push into replace with same uri', () => {
        let notified = false;
        let receivedAction = NavigationAction.Unknown;
        let uri = '';

        // push value before attaching listener
        const testUri = '/foo';
        history.push(testUri);
        const listener = (location: LocationContext, action: NavigationAction): void => {
            notified = true;
            receivedAction = action;
            uri = location.pathname;
        };
        history.listen(listener);
        history.push(testUri);

        expect(notified).toBe(true);
        expect(receivedAction).toBe(NavigationAction.Replace);
        expect(uri).toBe(testUri);
    });

    describe('canGoBack()', () => {
        it('should return false with no history', () => {
            expect(history.canGoBack()).toBe(false);
        });

        it('should return true with history', () => {
            history.push('foobar');
            expect(history.canGoBack()).toBe(true);
        });
    });

    describe('goForward()', () => {
        it('should do nothing if at end of history', () => {
            const url1 = '/url1';
            history.push(url1);
            expect(history.location().pathname).toBe(url1);

            history.goForward();
            expect(history.location().pathname).toBe(url1);
        });

        it('should go to next location', () => {
            const url1 = '/url1';
            const url2 = '/url2';
            history.push(url1);
            history.push(url2);
            expect(history.location().pathname).toBe(url2);
            history.goBack();
            expect(history.location().pathname).toBe(url1);

            history.goForward();
            expect(history.location().pathname).toBe(url2);
        });
    });

    describe('goBack()', () => {
        it('should do nothing if no history', () => {
            const initialLocation = history.location().pathname;
            history.goBack();
            expect(history.location().pathname).toBe(initialLocation);
        });

        it('should go to previous location', () => {
            const url1 = '/url1';
            const url2 = '/url2';
            history.push(url1);
            history.push(url2);
            expect(history.location().pathname).toBe(url2);
            history.goBack();
            expect(history.location().pathname).toBe(url1);
        });
    });

    describe('push()', () => {
        it('should navigate to new url', () => {
            spyOn(mockWindow.history, 'pushState').and.callThrough();
            const url = '/someplacefun';
            history.push(url);
            expect(mockWindow.history.pushState).toHaveBeenCalled();
            expect(history.location().pathname).toBe(url);
        });
    });

    describe('replace()', () => {
        it('should navigate to new url', () => {
            spyOn(mockWindow.history, 'replaceState').and.callThrough();
            const url = '/someplacefun';
            history.replace(url);
            expect(mockWindow.history.replaceState).toHaveBeenCalled();
            expect(history.location().pathname).toBe(url);
        });
    });

    describe('getHistoryState()', () => {
        it('should return empty object if no history', () => {
            const retval = BrowserHistory.getHistoryState({
                history: {}
            } as Window);

            expect(typeof retval).toBe('object');
            expect(Object.keys(retval).length).toBe(0);
        });

        it('should return state if present', () => {
            const expectedState: HistoryState = {
                historyIndex: 2,
                historyStack: ['', '', '', '']
            };

            const retval = BrowserHistory.getHistoryState({
                history: {
                    state: expectedState
                }
            } as Window);

            expect(retval).toBe(expectedState);
        });
    });

    describe('getCurrentLocation()', () => {
        it('should handle null window', () => {
            const retval = getCurrentLocation(null);
            expect(typeof retval).toBe('object');
            expect(retval.href).toBe('');
            expect(retval.pathname).toBe('');
            expect(retval.search).toBe('');
            expect(retval.hash).toBe('');
        });

        it('should pull values from window\'s location', () => {
            const location = {
                href: 'myHref',
                pathname: 'myPathname',
                search: 'mySearch',
                hash: 'myHash'
            };

            const retval = getCurrentLocation({
                location
            } as Window);

            expect(retval.href).toBe(location.href);
            expect(retval.pathname).toBe(location.pathname);
            expect(retval.search).toBe(location.search);
            expect(retval.hash).toBe(location.hash);
        });
    });
});