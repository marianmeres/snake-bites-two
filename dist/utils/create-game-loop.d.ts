import { StoreLike } from './create-store.js';
interface LoopConfig {
    updateTickFrequencyHz: number;
}
export interface GameLoop {
    start: Function;
    stop: Function;
    pause: Function;
    resume: Function;
    togglePause: Function;
    isRunning: boolean;
    wasRunning: boolean;
    isPaused: boolean;
    state: StoreLike;
}
export declare const createGameLoop: (configFn: () => LoopConfig, updateFn: (delta: number, elapsed: number) => void, renderFn: (timestamp: any) => void, setUpFn?: Function, tearDownFn?: Function) => GameLoop;
export {};
