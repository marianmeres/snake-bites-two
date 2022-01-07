import * as path from 'path';
import { strict as assert } from 'assert';
import { Board } from '../src/board.js';
import { Obstacle } from '../src/piece/obstacle.js';
import { fileURLToPath } from 'url';
import { TestRunner } from 'test-runner';
import { Snake } from '../src/piece/snake.js';
import { Piece } from '../src/piece.js';
import { assertEqualBoards } from '../src/utils/_test-utils.js';
import { gridCreate } from '../dist/utils/grid-create.js';
import isEqual from 'lodash-es/isEqual.js';

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

suite.test('rel dir works', () => {
	const b = new Board(5, 5);
	const s = new Snake(5, Piece.DIRECTION.EAST);
	b.setPiece(4, 1, s);

	s.turnSouth().update();
	s.turnWest().update();
	s.turnSouth().update();

	assertEqualBoards(
		b.toString(),
		`
		[ ][ ][ ][ ][ ]
		[ ][ ][ ][s][s]
		[ ][ ][ ][s][s]
		[ ][ ][ ][$][ ]
		[ ][ ][ ][ ][ ]
	`
	);

	const prevExpected = [null, 'S', 'W', 'S', 'E'];
	const nextExpected = ['N', 'E', 'N', 'W', null];
	const prevActual = [];
	const nextActual = [];

	s.atoms.forEach((a) => {
		prevActual.push(a.dirToPrevious);
		nextActual.push(a.dirToNext);
	});

	assert(isEqual(prevExpected, prevActual));
	assert(isEqual(nextExpected, nextActual));
});

//
export default suite;
