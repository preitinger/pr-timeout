export default function timeout<T>(timeoutMs: number, signal: AbortSignal, result?: T): Promise<T|undefined> {
    return new Promise((resolve, reject) => {
        function handleAbort() {
            clearTimeout(to);
            signal.removeEventListener('abort', handleAbort);
            reject(new Error('AbortError'))
        }
        const to = setTimeout(() => {
            signal.removeEventListener('abort', handleAbort);
            resolve(result);
        }, timeoutMs);
        signal.addEventListener('abort', handleAbort)
    })
}

export function timeoutWithResult<T>(timeoutMs: number, signal: AbortSignal, result: T): Promise<T> {
    return new Promise((resolve, reject) => {
        function handleAbort() {
            clearTimeout(to);
            signal.removeEventListener('abort', handleAbort);
            reject(new Error('AbortError'))
        }
        const to = setTimeout(() => {
            signal.removeEventListener('abort', handleAbort);
            resolve(result);
        }, timeoutMs);
        signal.addEventListener('abort', handleAbort)
    })
}
