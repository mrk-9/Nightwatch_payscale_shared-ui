const sleep = (timeout: number, errorMsg: string) => {
    return new Promise((_, reject) => setTimeout(() => reject(new Error(errorMsg)), timeout));
};

// Wraps fetch, allowing for specifying retry and timeout value.
// Will retry the specified number of times if the call times out or, if
// the response is a 404 with a Retry-After header.
export const multiFetch = (
    url: string,
    options: RequestInit,
    numberOfTries: number = 3,
    retryDelay: number = 1000,
    timeout: number = 30000
): Promise<Response> => {
    let currentTry = 0;

    return new Promise((resolve, reject) => {
        const tryFetch = async () => {
            // function to call when fetch fails, re-trying the call as
            // appropriate, or failing if no retries left
            const handleError = (error: Error, customRetryDelay: number) => {
                if (currentTry < numberOfTries) {
                    setTimeout(tryFetch, customRetryDelay || retryDelay);
                } else {
                    reject(error);
                }
            };

            try {
                currentTry++;
                const response: Response = await Promise.race([
                    window.fetch(url, options),
                    sleep(timeout, 'Request timed out')
                ]) as Response;

                // 404 status will come back as a successful call, and may have 'retry'
                // details in the header we should pay attention to
                if (response && response.status === 404 && response.headers) {
                    const retryAfterHeader = response.headers.get('Retry-After');
                    // put upper bound on our retry to something reasonable
                    const retrySeconds = Math.min(parseInt(retryAfterHeader, 10), 5);
                    handleError(new Error('404'), retrySeconds * 1000);
                } else {
                    resolve(response);
                }
            } catch (error) {
                handleError(error, null);
            }
        };

        tryFetch();
    });
};

export default multiFetch;
