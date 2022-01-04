import * as path from 'path';
import { fileURLToPath } from 'url';
import { strict as assert } from 'assert';
import { TestRunner } from 'test-runner';
import { Board } from '../src/board.js';
import { assertEqualBoards } from '../src/utils/_test-utils.js';
import { Obstacle } from '../src/piece/obstacle.js';
import { Bonus } from '../src/piece/bonus.js';
import { Snake } from '../src/piece/snake.js';
import { Piece } from '../src/piece.js';
import { Apple } from '../src/piece/apple.js';
import { Atom } from '../src/atom.js';
import { gridForEach } from '../src/utils/grid-foreach.js';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const suite = new TestRunner(path.basename(__filename));

suite.test('static empty board', () => {
	let b = new Board(3, 3);
	// prettier-ignore
	assertEqualBoards(b.toString(), `
		[ ][ ][ ]
		[ ][ ][ ]
		[ ][ ][ ]
	`);
});

suite.test('static empty board with single piece', () => {
	let b = new Board(3, 3);
	b.setPiece(1, 2, new Obstacle());
	// prettier-ignore
	assertEqualBoards(b.toString(), `
		[ ][ ][ ]
		[ ][ ][ ]
		[ ][#][ ]
	`);
});

suite.test('coordinates overflow', () => {
	let b = new Board(2, 3);

	// prettier-ignore
	[
		[0, 0], [1, 1], [2, 0], [3, 1], [-1, 1], [-2, 0], [-3, 1], [-4, 0], [-9, 1]
	].forEach(([input, expected]) => {
		const actual = b.normalizeX(input);
		assert(
			actual === expected,
			`b.normalizeX(${input}) !== ${expected} ... Actual: ${actual}`
		);
	});

	// prettier-ignore
	[
		[0, 0], [1, 1], [2, 2], [3, 0], [-1, 2], [-2, 1], [-3, 0], [-4, 2], [-5, 1]
	].forEach(([input, expected]) => {
		const actual = b.normalizeY(input);
		assert(
			actual === expected,
			`b.normalizeY(${input}) !== ${expected} ... Actual: ${actual}`
		);
	});
});

suite.test('static board with single atom pieces', () => {
	let b = new Board(3, 3);

	b.setPiece(1, 0, new Obstacle());
	b.setPiece(1, 1, new Apple());

	// simulate overwrite (and with overflowed coordinates)
	b.setPiece(1, 2, new Obstacle());
	b.setPiece(-2, -4, new Bonus());

	// prettier-ignore
	assertEqualBoards(b.toString(), `
		[ ][#][ ]
		[ ][@][ ]
		[ ][+][ ]
	`);
});

suite.test('static board with multiple atom pieces (NORTH)', () => {
	let b = new Board(3, 3);
	b.setPiece(1, 0, new Snake(2, Piece.DIRECTION.NORTH));
	// prettier-ignore
	assertEqualBoards(b.toString(), `
		[ ][$][ ]
		[ ][s][ ]
		[ ][ ][ ]
	`);
});

suite.test('static board with multiple atom pieces (EAST)', () => {
	let b = new Board(3, 3);
	b.setPiece(2, 1, new Snake(2, Piece.DIRECTION.EAST));
	// prettier-ignore
	assertEqualBoards(b.toString(), `
		[ ][ ][ ]
		[ ][s][$]
		[ ][ ][ ]
	`);
});

suite.test('static board with multiple atom pieces (SOUTH)', () => {
	let b = new Board(3, 3);
	b.setPiece(1, 2, new Snake(2, Piece.DIRECTION.SOUTH));
	// prettier-ignore
	assertEqualBoards(b.toString(), `
		[ ][ ][ ]
		[ ][s][ ]
		[ ][$][ ]
	`);
});

suite.test('static board with multiple atom pieces (WEST)', () => {
	let b = new Board(3, 3);
	b.setPiece(0, 1, new Snake(2, Piece.DIRECTION.WEST));
	// prettier-ignore
	assertEqualBoards(b.toString(), `
		[ ][ ][ ]
		[$][s][ ]
		[ ][ ][ ]
	`);
});

suite.test('static board with multiple atom pieces overflowed (NORTH)', () => {
	let b = new Board(3, 3);
	b.setPiece(1, 1, new Snake(2, Piece.DIRECTION.NORTH));
	// prettier-ignore
	assertEqualBoards(b.toString(), `
		[ ][ ][ ]
		[ ][$][ ]
		[ ][s][ ]
	`);
});

suite.test('static board with multiple atom pieces overflowed (SOUTH)', () => {
	let b = new Board(3, 5);
	b.setPiece(1, 1, new Snake(4, Piece.DIRECTION.SOUTH));
	// prettier-ignore
	assertEqualBoards(b.toString(), `
		[ ][s][ ]
		[ ][$][ ]
		[ ][ ][ ]
		[ ][s][ ]
		[ ][s][ ]
	`);
});

suite.test('static board with multiple atom pieces overflowed (WEST)', () => {
	let b = new Board(3, 3);
	b.setPiece(1, 1, new Snake(3, Piece.DIRECTION.WEST));
	// prettier-ignore
	assertEqualBoards(b.toString(), `
		[ ][ ][ ]
		[s][$][s]
		[ ][ ][ ]
	`);
});

suite.test('static board with multiple atom pieces overflowed (EAST)', () => {
	let b = new Board(5, 3);
	b.setPiece(3, 1, new Snake(4, Piece.DIRECTION.EAST));
	// prettier-ignore
	assertEqualBoards(b.toString(), `
		[ ][ ][ ][ ][ ]
		[s][s][s][$][ ]
		[ ][ ][ ][ ][ ]
	`);
});

suite.test('static board with multiple atom pieces overflowed combined', () => {
	let b = new Board(6, 6);

	b.setPiece(3, 4, new Snake(3, Piece.DIRECTION.NORTH));
	b.setPiece(4, 2, new Snake(3, Piece.DIRECTION.WEST));
	b.setPiece(2, 1, new Snake(3, Piece.DIRECTION.SOUTH));
	b.setPiece(1, 3, new Snake(3, Piece.DIRECTION.EAST));

	b.setPiece(0, 0, new Apple());
	b.setPiece(0, 5, new Bonus());
	b.setPiece(5, 5, new Obstacle());

	// prettier-ignore
	assertEqualBoards(b.toString(), `
		[@][ ][s][s][ ][ ]
		[ ][ ][$][ ][ ][ ]
		[s][ ][ ][ ][$][s]
		[s][$][ ][ ][ ][s]
		[ ][ ][ ][$][ ][ ]
		[+][ ][s][s][ ][#]
	`);
});

suite.test('empty cells', () => {
	let b = new Board(2, 2);
	b.setPiece(0, 0, new Snake(2, Piece.DIRECTION.NORTH));
	assert(
		JSON.stringify(b.emptyCoords()) ===
			JSON.stringify([
				[1, 0],
				[1, 1],
			])
	);
});

suite.test('set random piece', () => {
	let b = new Board(2, 2);
	b.setPieceAtRandomEmptyXY(new Obstacle());
	b.setPieceAtRandomEmptyXY(new Obstacle());
	b.setPieceAtRandomEmptyXY(new Obstacle());
	// console.log(b.toString());
	assert(b.emptyCoords().length === 1);
});

suite.test('has piece', () => {
	let b = new Board(2, 2);
	b.setPieceAtRandomEmptyXY(new Obstacle());
	assert(b.hasPiece(Obstacle));
	assert(!b.hasPiece(Snake));
});

suite.test('custom renderer', () => {
	Atom.renderer = (a: Atom) => a.xy;
	Board.renderer = (board: Board) => {
		let r = '';
		gridForEach(board.atomize(), (x, y, g) => {
			if (g[x][y]) r += g[x][y].render();
		});
		return r;
	};
	let b = new Board(2, 2);
	b.setPiece(0, 0, new Obstacle());
	b.setPiece(1, 1, new Obstacle());
	assert(b.render() === '0,01,1');
	Atom.renderer = null;
	Board.renderer = null;
});

//
export default suite;
