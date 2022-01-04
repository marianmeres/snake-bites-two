import * as path from 'path';
import { strict as assert } from 'assert';
import { Board } from '../src/board.js';
import { assertEqualBoards } from '../src/utils/_test-utils.js';
import { Apple } from '../src/piece/apple.js';
import { Piece } from '../src/piece.js';
import { Snake } from '../src/piece/snake.js';
import { fileURLToPath } from 'url';
import { TestRunner } from 'test-runner';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const suite = new TestRunner(path.basename(__filename));

suite.test('move test', () => {
	let b = new Board(3, 3);
	const progress = [
		b.setPiece(1, 1, new Snake(2, Piece.DIRECTION.NORTH)).toString(),
		b.movePiece(1, 1, 0, 0).toString(),
	];

	// prettier-ignore
	assertEqualBoards(progress, `
		[ ][ ][ ]   [$][ ][ ]
		[ ][$][ ]   [s][ ][ ]
		[ ][s][ ]   [ ][ ][ ]
	`);
});

suite.test('single atom piece tick update (NORTH)', () => {
	let b = new Board(3, 3);

	const p = new Apple();
	p.speed = 1;
	p.direction = Piece.DIRECTION.NORTH;

	const progress = [
		b.setPiece(1, 0, p).toString(),
		b.update().toString(),
		b.update().toString(),
		b.update().toString(),
	];

	// prettier-ignore
	assertEqualBoards(progress, `
		[ ][@][ ]   [ ][ ][ ]   [ ][ ][ ]   [ ][@][ ]
		[ ][ ][ ]   [ ][ ][ ]   [ ][@][ ]   [ ][ ][ ]
		[ ][ ][ ]   [ ][@][ ]   [ ][ ][ ]   [ ][ ][ ]
	`);
});

suite.test('single atom piece tick update (EAST)', () => {
	let b = new Board(3, 3);

	const p = new Apple();
	p.speed = 1;
	p.direction = Piece.DIRECTION.EAST;

	const progress = [
		b.setPiece(1, 0, p).toString(),
		b.update().toString(),
		b.update().toString(),
		b.update().toString(),
	];

	// prettier-ignore
	assertEqualBoards(progress, `
		[ ][@][ ]   [ ][ ][@]   [@][ ][ ]   [ ][@][ ]
		[ ][ ][ ]   [ ][ ][ ]   [ ][ ][ ]   [ ][ ][ ]
		[ ][ ][ ]   [ ][ ][ ]   [ ][ ][ ]   [ ][ ][ ]
	`);
});

suite.test('single atom piece tick update (SOUTH)', () => {
	let b = new Board(3, 3);

	const p = new Apple();
	p.speed = 1;
	p.direction = Piece.DIRECTION.SOUTH;

	const progress = [
		b.setPiece(1, 0, p).toString(),
		b.update().toString(),
		b.update().toString(),
		b.update().toString(),
	];

	// prettier-ignore
	assertEqualBoards(progress, `
		[ ][@][ ]   [ ][ ][ ]   [ ][ ][ ]   [ ][@][ ]
		[ ][ ][ ]   [ ][@][ ]   [ ][ ][ ]   [ ][ ][ ]
		[ ][ ][ ]   [ ][ ][ ]   [ ][@][ ]   [ ][ ][ ]
	`);
});

suite.test('single atom piece tick update (WEST)', () => {
	let b = new Board(3, 3);

	const p = new Apple();
	p.speed = 1;
	p.direction = Piece.DIRECTION.WEST;

	const progress = [
		b.setPiece(1, 0, p).toString(),
		b.update().toString(),
		b.update().toString(),
		b.update().toString(),
	];

	// prettier-ignore
	assertEqualBoards(progress, `
		[ ][@][ ]   [@][ ][ ]   [ ][ ][@]   [ ][@][ ]
		[ ][ ][ ]   [ ][ ][ ]   [ ][ ][ ]   [ ][ ][ ]
		[ ][ ][ ]   [ ][ ][ ]   [ ][ ][ ]   [ ][ ][ ]
	`);
});

suite.test('multiple atoms piece tick update (NORTH)', () => {
	let b = new Board(3, 3);

	const progress = [
		b.setPiece(1, 1, new Snake(2, Piece.DIRECTION.NORTH)).toString(),
		b.update().toString(),
		b.update().toString(),
		b.update().toString(),
	];

	// prettier-ignore
	assertEqualBoards(progress, `
		[ ][ ][ ]   [ ][$][ ]   [ ][s][ ]   [ ][ ][ ]
		[ ][$][ ]   [ ][s][ ]   [ ][ ][ ]   [ ][$][ ]
		[ ][s][ ]   [ ][ ][ ]   [ ][$][ ]   [ ][s][ ]
	`);
});

suite.test('multiple atoms piece tick update (EAST)', () => {
	let b = new Board(3, 3);

	const progress = [
		b.setPiece(1, 1, new Snake(2, Piece.DIRECTION.EAST)).toString(),
		b.update().toString(),
		b.update().toString(),
		b.update().toString(),
	];

	// prettier-ignore
	assertEqualBoards(progress, `
		[ ][ ][ ]   [ ][ ][ ]   [ ][ ][ ]   [ ][ ][ ]
		[s][$][ ]   [ ][s][$]   [$][ ][s]   [s][$][ ]
		[ ][ ][ ]   [ ][ ][ ]   [ ][ ][ ]   [ ][ ][ ]
	`);
});

suite.test('multiple atoms piece tick update (SOUTH)', () => {
	let b = new Board(3, 3);

	const progress = [
		b.setPiece(1, 1, new Snake(2, Piece.DIRECTION.SOUTH)).toString(),
		b.update().toString(),
		b.update().toString(),
		b.update().toString(),
	];

	// prettier-ignore
	assertEqualBoards(progress, `
		[ ][s][ ]   [ ][ ][ ]   [ ][$][ ]   [ ][s][ ]
		[ ][$][ ]   [ ][s][ ]   [ ][ ][ ]   [ ][$][ ]
		[ ][ ][ ]   [ ][$][ ]   [ ][s][ ]   [ ][ ][ ]
	`);
});

suite.test('single atoms piece tick change direction', () => {
	let b = new Board(3, 3);

	const p = new Apple();
	p.speed = 1;
	p.direction = Piece.DIRECTION.NORTH;

	const progress = [
		b.setPiece(1, 1, p).toString(),
		b.update().toString(),
		p.turnEast().board.update().toString(),
		p.turnSouth().board.update().toString(),
		p.turnWest().board.update().toString(),
		p.turnEast().board.update().toString(), // turn no effect
	];

	// prettier-ignore
	assertEqualBoards(progress, `
		[ ][ ][ ]   [ ][@][ ]   [ ][ ][@]   [ ][ ][ ]   [ ][ ][ ]   [ ][ ][ ]
		[ ][@][ ]   [ ][ ][ ]   [ ][ ][ ]   [ ][ ][@]   [ ][@][ ]   [@][ ][ ]
		[ ][ ][ ]   [ ][ ][ ]   [ ][ ][ ]   [ ][ ][ ]   [ ][ ][ ]   [ ][ ][ ]
	`);
});

suite.test('snake move', () => {
	let b = new Board(3, 3);

	const p = new Snake(2, Piece.DIRECTION.NORTH);

	const progress = [
		b.setPiece(0, 1, p).toString(),
		p.turnEast().board.update().toString(),
		b.update().toString(),
		b.update().toString(),
		p.turnNorth().board.update().toString(),
		p.turnWest().board.update().toString(),
		p.turnNorth().board.update().toString(),
		b.update().toString(),
	];

	// console.log(p.atoms);

	// prettier-ignore
	assertEqualBoards(progress, `
		[ ][ ][ ]   [ ][ ][ ]   [ ][ ][ ]   [ ][ ][ ]   [$][ ][ ]   [s][ ][$]   [ ][ ][s]   [ ][ ][ ]
		[$][ ][ ]   [s][$][ ]   [ ][s][$]   [$][ ][s]   [s][ ][ ]   [ ][ ][ ]   [ ][ ][ ]   [ ][ ][$]
		[s][ ][ ]   [ ][ ][ ]   [ ][ ][ ]   [ ][ ][ ]   [ ][ ][ ]   [ ][ ][ ]   [ ][ ][$]   [ ][ ][s]
	`);
});

suite.test('long snake move', () => {
	let b = new Board(5, 5);

	const p = new Snake(4, Piece.DIRECTION.SOUTH);

	const progress = [
		b.setPiece(1, 3, p).toString(),
		p.turnEast().board.update().toString(),
		p.turnSouth().board.update().toString(),
		p.turnEast().board.update().toString(),
		p.turnNorth().board.update().toString(),
		b.update().toString(),
		p.turnWest().board.update().toString(),
		p.turnNorth().board.update().toString(),
	];

	// prettier-ignore
	assertEqualBoards(progress, `
		[ ][s][ ][ ][ ]   [ ][ ][ ][ ][ ]   [ ][ ][ ][ ][ ]   [ ][ ][ ][ ][ ]   [ ][ ][ ][ ][ ]   [ ][ ][ ][ ][ ]   [ ][ ][ ][ ][ ]   [ ][ ][ ][ ][ ]
		[ ][s][ ][ ][ ]   [ ][s][ ][ ][ ]   [ ][ ][ ][ ][ ]   [ ][ ][ ][ ][ ]   [ ][ ][ ][ ][ ]   [ ][ ][ ][ ][ ]   [ ][ ][ ][ ][ ]   [ ][ ][$][ ][ ]
		[ ][s][ ][ ][ ]   [ ][s][ ][ ][ ]   [ ][s][ ][ ][ ]   [ ][ ][ ][ ][ ]   [ ][ ][ ][ ][ ]   [ ][ ][ ][$][ ]   [ ][ ][$][s][ ]   [ ][ ][s][s][ ]
		[ ][$][ ][ ][ ]   [ ][s][$][ ][ ]   [ ][s][s][ ][ ]   [ ][s][s][ ][ ]   [ ][ ][s][$][ ]   [ ][ ][ ][s][ ]   [ ][ ][ ][s][ ]   [ ][ ][ ][s][ ]
		[ ][ ][ ][ ][ ]   [ ][ ][ ][ ][ ]   [ ][ ][$][ ][ ]   [ ][ ][s][$][ ]   [ ][ ][s][s][ ]   [ ][ ][s][s][ ]   [ ][ ][ ][s][ ]   [ ][ ][ ][ ][ ]
	`);
});

suite.test('long snake move across border', () => {
	let b = new Board(4, 4);

	// b.pubsub.subscribe(Game.EVENT.TICK_UPDATE, (board: Board) => {
	// 	console.log('\n' + board.toString());
	// });

	const p = new Snake(4, Piece.DIRECTION.SOUTH);

	const progress = [
		b.setPiece(1, 3, p).toString(),
		b.update().toString(),
		p.turnWest().board.update().toString(),
		b.update().toString(),
		p.turnNorth().board.update().toString(),
		p.turnEast().board.update().toString(),
		b.update().toString(),
		b.update().toString(),
	];

	// prettier-ignore
	assertEqualBoards(progress, `
		[ ][s][ ][ ]   [ ][$][ ][ ]   [$][s][ ][ ]   [s][s][ ][$]   [s][s][ ][s]   [s][ ][ ][s]   [ ][ ][ ][s]   [ ][ ][ ][ ]
		[ ][s][ ][ ]   [ ][s][ ][ ]   [ ][ ][ ][ ]   [ ][ ][ ][ ]   [ ][ ][ ][ ]   [ ][ ][ ][ ]   [ ][ ][ ][ ]   [ ][ ][ ][ ]
		[ ][s][ ][ ]   [ ][s][ ][ ]   [ ][s][ ][ ]   [ ][ ][ ][ ]   [ ][ ][ ][ ]   [ ][ ][ ][ ]   [ ][ ][ ][ ]   [ ][ ][ ][ ]
		[ ][$][ ][ ]   [ ][s][ ][ ]   [ ][s][ ][ ]   [ ][s][ ][ ]   [ ][ ][ ][$]   [$][ ][ ][s]   [s][$][ ][s]   [s][s][$][s]
	`);
});

//
export default suite;
