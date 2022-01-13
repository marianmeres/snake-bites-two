import { createStore } from "../dist/utils/create-store.js";

export const scores = createStore({ score1: 0, score2: 0 });

export const twoPlayerSwitch = createStore(false);

export const boardHTML = createStore('');

export const gameLoopState = createStore({
	wasRunning: false, isRunning: false, isPaused: false
});

export const lastCollision = createStore({});

export const speed = createStore(5);
