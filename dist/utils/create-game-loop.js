import { assertTypeFn, isFn } from './is-fn.js';
import { createStore } from './create-store.js';
// creating fallbacks so it can be tested outside of browser (see tests)
const now = () => (typeof window !== 'undefined' ? window.performance.now() : Date.now());
const requestAF = (() => {
    const fallback = (cb) => setTimeout(() => cb(now()), 1000 / 60);
    return typeof window !== 'undefined' ? window.requestAnimationFrame : fallback;
})();
const cancelAF = (() => {
    return typeof window !== 'undefined' ? window.cancelAnimationFrame : clearTimeout;
})();
export const createGameLoop = (configFn, updateFn, renderFn, setUpFn = null, tearDownFn = null) => {
    assertTypeFn([configFn, updateFn, renderFn], '[createGameLoop]');
    // Unlike typical approaches found on the web for html5 js gaming with single raf loop
    // (e.g: https://developer.mozilla.org/en-US/docs/Games/Anatomy)
    // I feel like creating two separate loops (one for game updates, one for render)
    // is nicer and conceptually cleaner...
    let isRunning = false;
    let isPaused = false;
    let wasRunning = false;
    const state = createStore({ wasRunning, isRunning, isPaused });
    let totalElapsedMs = 0;
    // UPDATE logic
    let updateId;
    let updateLast;
    const _updateTick = () => {
        let interval = 1000 / configFn().updateTickFrequencyHz;
        updateId = setTimeout(_updateTick, interval);
        updateLast = updateLast === void 0 ? now() : updateLast;
        const updateStart = now();
        let delta = updateStart - updateLast;
        totalElapsedMs += delta;
        // Normally, this should be exactly 1.
        // If it is large, then either the game was asleep, or the machine cannot keep up.
        let queueCount = Math.max(1, Math.floor(delta / interval));
        // for obscure cases (left running loop in the background tab for too long),
        // limit the queue length so we don't kill the thread when resumed...
        queueCount = Math.min(10, queueCount);
        while (queueCount--) {
            !isPaused && updateFn(delta, totalElapsedMs);
        }
        updateLast = updateStart;
    };
    // RENDER logic
    let renderId;
    const _renderTick = (ts) => {
        renderId = requestAF(_renderTick);
        !isPaused && renderFn(ts);
    };
    const _reset = () => {
        isPaused = false;
        totalElapsedMs = 0;
        updateLast = void 0;
    };
    const _publishState = () => state.set({ isRunning, isPaused, wasRunning });
    //
    return {
        start: () => {
            if (!isRunning) {
                isRunning = true;
                wasRunning = true;
                _publishState();
                isFn(setUpFn) && setUpFn();
                _updateTick();
                _renderTick(now());
            }
        },
        stop: (...tearDownArgs) => {
            if (isRunning) {
                isRunning = false;
                updateId && clearTimeout(updateId);
                renderId && cancelAF(renderId);
                _reset();
                _publishState();
                isFn(tearDownFn) && tearDownFn(...tearDownArgs);
            }
        },
        pause: () => {
            isPaused = true;
            _publishState();
        },
        resume: () => {
            isPaused = false;
            _publishState();
        },
        togglePause: () => {
            isPaused = !isPaused;
            _publishState();
        },
        get isPaused() {
            return isPaused;
        },
        get isRunning() {
            return isRunning;
        },
        get wasRunning() {
            return wasRunning;
        },
        get state() {
            return state;
        },
    };
};
