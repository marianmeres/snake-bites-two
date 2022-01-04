import * as path from 'path';
import { strict as assert } from 'assert';
import { createGameLoop } from '../src/utils/create-game-loop.js';
import { delay } from '../src/utils/delay.js';
import { fileURLToPath } from 'url';
import { TestRunner } from 'test-runner';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const suite = new TestRunner(path.basename(__filename));

suite.test('game loop test', async () => {
	let updateCounter = 0;
	let renderCounter = 0;
	const loop = createGameLoop(
		() => ({ updateTickFrequencyHz: 20 }), // ~ 50ms interval
		(delta, totalElapsedMs) => {
			// console.log('updated', delta, totalElapsedMs);
			updateCounter++;
		},
		(ts) => {
			// console.log('rendered', ts);
			renderCounter++;
		}
	);

	loop.start();

	// wait little more than 1 update interval (~50ms), but less than 2 (~100ms)
	const wait = 70;
	await delay(wait);

	loop.stop();

	// initial + 1
	assert(updateCounter === 2);

	// console.log(renderCounter - 1, Math.floor(wait / 16.666));
	// render fires ~ 16.6Hz, so it should be (minus the kicked-off initial)
	assert(renderCounter - 1 === Math.floor(wait / 16.666));
});

suite.test('game loop pause resume test', async () => {
	let updateCounter = 0;
	let renderCounter = 0;
	const loop = createGameLoop(
		() => ({ updateTickFrequencyHz: 20 }), // ~ 50ms interval
		(delta, totalElapsedMs) => {
			// console.log('updated', delta, totalElapsedMs);
			updateCounter++;
		},
		(ts) => {
			// console.log('rendered', ts);
			renderCounter++;
		}
	);

	loop.start();
	loop.pause();

	await delay(70);

	loop.resume();

	// wait little more than 1 update interval (~50ms), but less than 2 (~100ms)
	const wait = 70;
	await delay(wait);

	loop.stop();

	// initial + 1
	assert(updateCounter === 2);

	// render fires ~ 16.6Hz, so it should be (minus the kicked-off initial)
	assert(renderCounter - 1 === Math.floor(wait / 16.666));
});

//
export default suite;
