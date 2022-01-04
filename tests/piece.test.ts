import * as path from 'path';
import { strict as assert } from 'assert';
import { Board } from '../src/board.js';
import { Obstacle } from '../src/piece/obstacle.js';
import { fileURLToPath } from 'url';
import { TestRunner } from 'test-runner';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const suite = new TestRunner(path.basename(__filename));

suite.test('piece test', () => {
	const b = new Board(3, 3);
	const o = new Obstacle();
	b.setPiece(1, 2, o);
	assert(o === b.cell(1, 2));
	assert(o.x === 1);
	assert(o.y === 2);
});

//
export default suite;
