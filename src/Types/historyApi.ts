export interface HistoryApi {
    // Navigate backwards in history one step
    goBack: () => void;

    // Navigate forwards in history one step
    goForward: () => void;

    // Push a new URI onto the history stack, making that URI
    // the current one
    push: (url: string) => void;

    // Replace the current URI with the provided one
    // Doesn't add a history item to the stack
    replace: (url: string) => void;
}

export default HistoryApi;
