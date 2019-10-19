// Invokes the function parameter, at most, every animation frame.
// Generally matches display refresh rate
// Useful for: scroll, resize, browser event handling
export const throttle = <T extends Function>(func: T): T => {
    let context: {} = null;
    let latestArgs: Array<{}> = null;
    let animationFrame: number = null;
    const later = () => {
        animationFrame = null;
        func.apply(context, latestArgs);
    };

    return ((...args: Array<{}>) => {
        context = this;
        latestArgs = args;
        if (!animationFrame) {
            animationFrame = window.requestAnimationFrame(later);
        }
    }) as any as T; // tslint:disable-line no-any
};

// Delays the invocation of the function parameter
// until the timeout parameter has elapsed
// Useful for: searching, key up, double-submit handling
export const debounce = <T extends Function>(func: T, timeout: number): T => {
    let timeoutId: number;

    return ((...args: Array<{}>): void => {
        if (timeoutId) {
            window.clearTimeout(timeoutId);
        }

        timeoutId = window.setTimeout(func, timeout, ...args);
    }) as any as T; // tslint:disable-line no-any
};
