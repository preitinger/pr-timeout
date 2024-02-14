import FixedAbortController from "../../FixedAbortController"
import PromiseChecker from "../../pr-test-utils/PromiseChecker";
import timeout from "../pr-timeout";

jest.useFakeTimers();

describe('timeout provides an abortable promise that is resolved after some milliseconds', () => {
    it('resolves the promise if the abort signal is not aborted', async () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        const ms = 100;
        const timeoutPromise = timeout(ms, signal)
        const timeoutCheck = new PromiseChecker(timeoutPromise);

        function controlTimeoutAfter() {
            expect(timeoutCheck.hasResolved()).toBe(true);
            expect(timeoutCheck.hasRejected()).toBe(false);
        }
        const toAfter = setTimeout(controlTimeoutAfter, ms + 1);

        const controlPromiseBefore = new Promise<void>((resolve) => {
            setTimeout(controlTimeoutBefore, ms - 1);

            function controlTimeoutBefore() {
                expect(timeoutCheck.hasResolved()).toBe(false);
                expect(timeoutCheck.hasRejected()).toBe(false);
                resolve();
            }
        })

        const controlPromiseAfter = new Promise<void>((resolve) => {
            const toAfter = setTimeout(controlTimeoutAfter, ms + 1);

            function controlTimeoutAfter() {
                expect(timeoutCheck.hasResolved()).toBe(true);
                expect(timeoutCheck.hasRejected()).toBe(false);
                resolve();
            }

        })

        jest.advanceTimersByTime(ms - 1);
        await controlPromiseBefore;
        jest.advanceTimersByTime(1);
        await timeoutPromise;
        jest.advanceTimersByTime(1);
        await controlPromiseAfter;
    })

    it('simpler alternative test', async () => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const timeoutMs = 100;
        const promise = timeout(timeoutMs, signal);
        expect(promise).resolves.toBe(undefined);
        const promiseChecker = new PromiseChecker(promise);
        await jest.advanceTimersByTimeAsync(timeoutMs - 1);
        expect(promiseChecker.hasResolved()).toBe(false);
        expect(promiseChecker.hasRejected()).toBe(false);
        await jest.advanceTimersByTimeAsync(1);
        expect(promiseChecker.hasResolved()).toBe(true);
        expect(promiseChecker.hasRejected()).toBe(false);

        await promise;
    })

    it('rejects if the signal is aborted', async () => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const timeoutMs = 100;
        const promise = timeout(timeoutMs, signal);
        const promiseChecker = new PromiseChecker(promise);
        await jest.advanceTimersByTimeAsync(timeoutMs * 0.5);
        expect(promiseChecker.hasResolved()).toBe(false);
        expect(promiseChecker.hasRejected()).toBe(false);
        abortController.abort();
        await jest.advanceTimersByTimeAsync(1);
        expect(promiseChecker.hasResolved()).toBe(false);
        expect(promiseChecker.hasRejected()).toBe(true);

        expect(promise).rejects.toThrow('AbortError');
        try {
            await promise;
        } catch (reason) {
            expect(reason).toBeInstanceOf(Error);
            const error = reason as Error;
            expect(error.message).toBe('AbortError');
        }
    })

    it('tidies up abort event listeners on resolution', async () => {
        // const abortController = new AbortController();
        // const signal = abortController.signal;
        // const timeoutMs = 100;
        // const promise = timeout(timeoutMs, signal);
        // await jest.advanceTimersByTimeAsync(timeoutMs * 0.5);

        // 
        console.warn('Unknown how to be implemented. Seems to be testable only interactively using breakpoints and browser inspection tools');
    })

    it('tidies up abort event listeners on rejection', async () => {
        console.warn('Unknown how to be implemented. Seems to be testable only interactively using breakpoints and browser inspection tools');

    })
})