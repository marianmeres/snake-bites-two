import * as path from 'path';
import { strict as assert } from 'assert';
import { fileURLToPath } from 'url';
import { TestRunner } from 'test-runner';
import { Board } from '../src/board.js';
import { assertEqualBoards } from '../src/utils/_test-utils.js';
import { Obstacle } from '../src/piece/obstacle.js';
import { Apple } from '../src/piece/apple.js';
import { Bonus } from '../src/piece/bonus.js';
import { Piece } from '../src/piece.js';
import { Snake } from '../src/piece/snake.js';
import { Collision } from '../src/error/collision.js';
import { GAME_EVENT } from '../dist/constants.js';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const suite = new TestRunner(path.basename(__filename));

suite.test('apple vs obstacle', () => {
	let b = new Board(3, 3);

	const a = new Apple();
	a.direction = Piece.DIRECTION.SOUTH;
	a.speed = 1;

	b.setPiece(1, 0, a);
	b.setPiece(1, 2, new Obstacle());

	const progress = [b.toString(), b.update()];

	// prettier-ignore
	assertEqualBoards(progress, `
		[ ][@][ ]   [ ][ ][ ]
		[ ][ ][ ]   [ ][@][ ]
		[ ][#][ ]   [ ][#][ ]
	`);

	// next update must fail
	assert.throws(() => b.update(), Collision);
});

suite.test('snake vs obstacle', () => {
	let b = new Board(3, 3);

	const s = new Snake(2, Piece.DIRECTION.NORTH);

	b.setPiece(2, 0, new Obstacle());
	b.setPiece(1, 1, s);

	const progress = [b.toString(), b.update().toString()];
	// prettier-ignore
	assertEqualBoards(progress, `
		[ ][ ][#]   [ ][$][#]
		[ ][$][ ]   [ ][s][ ]
		[ ][s][ ]   [ ][ ][ ]
	`);

	// next update must fail
	assert.throws(() => s.turnEast().board.update(), /snake-head vs obstacle/i);
});

suite.test('snake vs apple', () => {
	let b = new Board(1, 3);

	const s = new Snake(2, Piece.DIRECTION.NORTH);
	b.setPiece(0, 0, new Apple());
	b.setPiece(0, 1, s);
	//  [@]
	//  [$]
	//  [s]

	const log = [];
	b.pubsub.subscribe(GAME_EVENT.SNAKE_EATS_APPLE, (snake: Snake) => {
		log.push(snake.id);
	});

	assert(!log.length);

	// next update must NOT fail
	assert.doesNotThrow(() => b.update(), Collision);

	assert(log[0] === s.id);
});

suite.test('snake vs bonus', () => {
	let b = new Board(1, 3);

	const s = new Snake(2, Piece.DIRECTION.NORTH);
	b.setPiece(0, 0, new Bonus());
	b.setPiece(0, 1, s);
	//  [@]
	//  [$]
	//  [s]

	const log = [];
	b.pubsub.subscribe(GAME_EVENT.SNAKE_EATS_BONUS, (snake: Snake) => {
		log.push(snake.id);
	});

	assert(!log.length);

	// next update must NOT fail
	assert.doesNotThrow(() => b.update(), Collision);

	assert(log[0] === s.id);
});

suite.test('snake vs snake', () => {
	let b = new Board(3, 3);

	let loosers;
	b.pubsub.subscribe(GAME_EVENT.COLLISION, ({ collidingPieces }) => {
		loosers = collidingPieces;
	});

	b.setPiece(0, 1, new Snake(2, Piece.DIRECTION.NORTH));
	b.setPiece(1, 0, new Snake(2, Piece.DIRECTION.WEST));

	// prettier-ignore
	assertEqualBoards(b.toString(), `
		[ ][$][s]
		[$][ ][ ]
		[s][ ][ ]
	`);

	// this is special case - both players loose
	assert.throws(() => b.update(), /snake-head vs snake-head/i);

	// both snakes lost!
	assert(loosers.length === 2);
});

suite.test('snake vs snake 2', () => {
	let b = new Board(3, 4);

	let loosers = [];
	b.pubsub.subscribe(GAME_EVENT.COLLISION, ({ collidingPieces }) => {
		loosers = collidingPieces;
	});

	const p = new Snake(2, Piece.DIRECTION.WEST);
	b.setPiece(0, 1, new Snake(2, Piece.DIRECTION.NORTH));
	b.setPiece(1, 1, p);

	// prettier-ignore
	assertEqualBoards(b.toString(), `
		[ ][ ][ ]
		[$][$][s]
		[s][ ][ ]
		[ ][ ][ ]
	`);

	assert.throws(() => b.update(), /snake-head vs snake-body/i);

	// only one looser
	assert(loosers.length === 1);
	assert(loosers[0] === p);
});

suite.test('snake vs apple - atoms added', () => {
	let b = new Board(1, 6);

	b.setPiece(0, 0, new Apple());
	b.setPiece(0, 1, new Snake(2, Piece.DIRECTION.NORTH));

	b.pubsub.subscribe(GAME_EVENT.SNAKE_EATS_APPLE, (snake: Snake) => {
		snake.addPostMoveTailAtoms(2);
	});

	const progress = [
		b.toString(),
		b.update().toString(),
		b.update().toString(),
		b.update().toString(),
		b.update().toString(),
		b.update().toString(),
		b.update().toString(),
	];

	// prettier-ignore
	assertEqualBoards(progress, `
		[@]   [$]   [s]   [s]   [s]   [ ]   [ ]
		[$]   [s]   [s]   [s]   [ ]   [ ]   [$]
		[s]   [s]   [s]   [ ]   [ ]   [$]   [s]
		[ ]   [ ]   [ ]   [ ]   [$]   [s]   [s]
		[ ]   [ ]   [ ]   [$]   [s]   [s]   [s]
		[ ]   [ ]   [$]   [s]   [s]   [s]   [ ]
	`);
});

suite.test('snake vs apple - atoms added tail space height problem', () => {
	let b = new Board(2, 3);

	const p = new Snake(2, Piece.DIRECTION.NORTH);
	b.setPiece(0, 0, new Apple());
	b.setPiece(0, 1, p);

	b.pubsub.subscribe(GAME_EVENT.SNAKE_EATS_APPLE, (snake: Snake) => {
		snake.addPostMoveTailAtoms(2);
	});

	const progress = [
		b.toString(),
		b.update().toString(),

		// tu je problem, ze nie je kam pridat... cize toto musi ostat bez zmeny dlzky
		b.update().toString(),
		b.update().toString(),
		b.update().toString(),

		// az teraz uvolnime miesto - toto prida zvysny atom
		p.turnEast().board.update().toString(),

		// a tu uz normalne tocime...
		p.turnSouth().board.update().toString(),
		b.update().toString(),
	];

	// prettier-ignore
	assertEqualBoards(progress, `
		[@][ ]   [$][ ]   [s][ ]   [s][ ]   [$][ ]   [s][$]   [s][s]   [s][s]
		[$][ ]   [s][ ]   [s][ ]   [$][ ]   [s][ ]   [s][ ]   [s][$]   [ ][s]
		[s][ ]   [s][ ]   [$][ ]   [s][ ]   [s][ ]   [s][ ]   [ ][ ]   [ ][$]
	`);
});

suite.test('snake vs apple - atoms added tail space width problem', () => {
	let b = new Board(3, 2);

	const p = new Snake(2, Piece.DIRECTION.EAST);
	b.setPiece(2, 0, new Apple());
	b.setPiece(1, 0, p);

	b.pubsub.subscribe(GAME_EVENT.SNAKE_EATS_APPLE, (snake: Snake) => {
		snake.addPostMoveTailAtoms(2);
	});

	const progress = [
		b.toString(),
		b.update().toString(),

		// tu je problem, ze nie je kam pridat... cize toto musi ostat bez zmeny dlzky
		b.update().toString(),

		// az teraz uvolnime miesto - toto prida zvysny atom
		p.turnSouth().board.update().toString(),

		// a tu uz normalne tocime...
		p.turnEast().board.update().toString(),
		b.update().toString(),
	];

	// prettier-ignore
	assertEqualBoards(progress, `
		[s][$][@]   [s][s][$]   [$][s][s]   [s][s][s]   [s][ ][s]   [s][ ][ ]
		[ ][ ][ ]   [ ][ ][ ]   [ ][ ][ ]   [$][ ][ ]   [s][$][ ]   [s][s][$]
	`);
});

suite.test('snake vs apple - atoms added 2', () => {
	let b = new Board(5, 5);

	b.pubsub.subscribe(GAME_EVENT.SNAKE_EATS_APPLE, (snake: Snake) => {
		snake.addPostMoveTailAtoms(2);
	});

	const p = new Snake(4, Piece.DIRECTION.NORTH);
	b.setPiece(0, 0, new Apple());
	b.setPiece(1, 0, new Apple());
	b.setPiece(0, 1, p);

	const progress = [
		b.toString(),
		b.update().toString(),
		p.turnEast().board.update().toString(),
		b.update().toString(),
		b.update().toString(),
	];

	// prettier-ignore
	assertEqualBoards(progress, `
		[@][@][ ][ ][ ]   [$][@][ ][ ][ ]   [s][$][ ][ ][ ]   [s][s][$][ ][ ]   [s][s][s][$][ ]
		[$][ ][ ][ ][ ]   [s][ ][ ][ ][ ]   [s][ ][ ][ ][ ]   [s][ ][ ][ ][ ]   [s][ ][ ][ ][ ]
		[s][ ][ ][ ][ ]   [s][ ][ ][ ][ ]   [s][ ][ ][ ][ ]   [s][ ][ ][ ][ ]   [s][ ][ ][ ][ ]
		[s][ ][ ][ ][ ]   [s][ ][ ][ ][ ]   [s][ ][ ][ ][ ]   [s][ ][ ][ ][ ]   [s][ ][ ][ ][ ]
		[s][ ][ ][ ][ ]   [s][ ][ ][ ][ ]   [s][ ][ ][ ][ ]   [s][ ][ ][ ][ ]   [s][ ][ ][ ][ ]
	`);
});

suite.test('long snake collision with own tail', () => {
	let b = new Board(1, 3);
	b.setPiece(0, 1, new Snake(3, Piece.DIRECTION.NORTH));
	//  [s]
	//  [$]
	//  [s]
	b.update();
	b.update();

	// prettier-ignore
	assertEqualBoards(b.toString(), `
		[s]
		[s]
		[$]
	`);
});

suite.test('long snake collision with own body', () => {
	let b = new Board(5, 5);

	const p = new Snake(5, Piece.DIRECTION.NORTH);

	const progress = [
		b.setPiece(0, 0, p).toString(),
		p.turnEast().board.update().toString(),
		p.turnSouth().board.update().toString(),
	];

	// prettier-ignore
	assertEqualBoards(progress, `
		[$][ ][ ][ ][ ]   [s][$][ ][ ][ ]   [s][s][ ][ ][ ]
		[s][ ][ ][ ][ ]   [s][ ][ ][ ][ ]   [s][$][ ][ ][ ]
		[s][ ][ ][ ][ ]   [s][ ][ ][ ][ ]   [s][ ][ ][ ][ ]
		[s][ ][ ][ ][ ]   [s][ ][ ][ ][ ]   [ ][ ][ ][ ][ ]
		[s][ ][ ][ ][ ]   [ ][ ][ ][ ][ ]   [ ][ ][ ][ ][ ]
	`);

	assert.throws(() => p.turnWest().board.update(), /snake-head vs snake-body/i);
});

//
export default suite;
