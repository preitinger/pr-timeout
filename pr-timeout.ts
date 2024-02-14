export default function timeout(timeoutMs: number, signal: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
        function handleAbort() {
            signal.removeEventListener('abort', handleAbort);
            reject(new Error('AbortError'))
        }
        const to = setTimeout(() => {
            signal.removeEventListener('abort', handleAbort);
            resolve();
        }, timeoutMs);
        signal.addEventListener('abort', handleAbort)
    })
}