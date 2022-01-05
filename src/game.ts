import { isFn } from './utils/is-fn.js';
import { getRandomIntInclusive } from './utils/get-random-int.js';
import { createGameLoop, GameLoop } from './utils/create-game-loop.js';
import { Piece } from './piece.js';
import { Board } from './board.js';
import { Snake } from './piece/snake.js';
import { Apple } from './piece/apple.js';
import { Obstacle } from './piece/obstacle.js';
import { Bonus } from './piece/bonus.js';
import { GAME_EVENT } from './constants.js';

interface FactoryOptions {
	twoPlayers: boolean;
	x: number;
	y: number;
	updateTickFrequencyHz: number;
	// use zero to have no shit at all
	maxObstacles: number;
	// use zero to never show bonus
	bonusProbability: number;
	eatAppleScore: number;
	eatBonusScore: number;
	//
	setUpFn: Function;
	tearDownFn: Function;
	renderFn: (board: Board) => void;
}

const defaultFactoryOptions = {
	twoPlayers: false,
	x: 23,
	y: 13,
	updateTickFrequencyHz: 5,
	maxObstacles: 5,
	// the lower value, the higher prob (1 on each bonus like event)
	bonusProbability: 2,
	eatAppleScore: 2,
	eatBonusScore: 5,
};

// this is a game mechanics config manager mostly... (not a core game domain object)

export class Game {
	static readonly KEY = {
		A: 65,
		S: 83,
		D: 68,
		W: 87,
		//
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		//
		SPACEBAR: 32,
		ESCAPE: 27,
	};

	static create(options: Partial<FactoryOptions> = {}) {
		options = { ...defaultFactoryOptions, ...options };
		// console.log(options);

		// setup board
		const board = new Board(options.x, options.y);

		// setup snakes
		let snakes = [new Snake(3, Piece.DIRECTION.NORTH)];
		options.twoPlayers && snakes.push(new Snake(3, Piece.DIRECTION.NORTH));

		snakes = snakes.map((s, idx) => {
			const i = idx + 1;
			s.custom = { ...s.custom, cssClass: `snake${i}` };
			s.label = `Player${i}`;
			return s;
		});
		// console.log(snakes.length);

		const xHalf = Math.floor(options.x / 2);
		const yHalf = Math.floor(options.y / 2);
		if (snakes.length === 2) {
			const qtr = Math.floor(xHalf / 2);
			board.setPiece(xHalf + qtr, yHalf, snakes[0]);
			board.setPiece(xHalf - qtr, yHalf, snakes[1]);
		} else {
			board.setPiece(xHalf, yHalf, snakes[0]);
		}

		// set up first apple
		board.setPieceAtRandomEmptyXY(new Apple());

		// maybe set up obstacles
		if (options.maxObstacles > 0) {
			const oCount = getRandomIntInclusive(
				Math.max(1, Math.floor(options.maxObstacles * 0.6)),
				options.maxObstacles
			);
			for (let i = 0; i < oCount; i++) {
				board.setPieceAtRandomEmptyXY(new Obstacle());
			}
		}

		// speed config (will effect score updates as well)
		let hz = Math.round(options.updateTickFrequencyHz);

		// set up typical game mechanics
		board.pubsub.subscribe(GAME_EVENT.SNAKE_EATS_APPLE, (snake) => {
			snake.addPostMoveTailAtoms(2);
			board.setPieceAtRandomEmptyXY(new Apple());
			snake.score.update((v) => v + options.eatAppleScore + hz);

			if (options.bonusProbability) {
				const bonus = getRandomIntInclusive(1, Math.abs(options.bonusProbability));
				if (!board.hasPiece(Bonus) && bonus === 1) {
					const bonus = new Bonus();
					const [x, y] = board.setPieceAtRandomEmptyXY(bonus);
					// auto remove bonus...
					setTimeout(() => {
						const cell = board.cell(x, y);
						if (cell === bonus) board.setPiece(x, y, null);
					}, getRandomIntInclusive(5_000, 15_000));
				}
			}
		});

		board.pubsub.subscribe(GAME_EVENT.SNAKE_EATS_BONUS, (snake) => {
			snake.score.update((v) => v + options.eatBonusScore + hz);
		});

		// setup game loop (do not start yet)
		const loop = createGameLoop(
			() => ({
				// decrease one hz if two...
				updateTickFrequencyHz: Math.max(2, options.twoPlayers ? hz - 1 : hz),
			}),
			() => {
				try {
					board.update();
				} catch (e) {
					loop.stop();
				}
			},
			(ts) => options.renderFn(board),
			() => isFn(options.setUpFn) && options.setUpFn(board),
			() => isFn(options.tearDownFn) && options.tearDownFn(board)
		);

		// setup keymap handler
		const keyMap = snakes.reduce((memo, snake, idx) => {
			memo = { ...memo, ...Game._createControlBindingsMap(loop, snake, !idx) };
			return memo;
		}, {});
		const onKeydown = (e) => {
			if (keyMap[e.keyCode]) {
				keyMap[e.keyCode]();
			}
		};

		return { board, snakes, loop, onKeydown };
	}

	protected static _createControlBindingsMap(
		loop: GameLoop,
		snake: Snake,
		useArrows = true
	): {
		[keyCode: number]: Function;
	} {
		if (!snake) return {};

		return {
			[Game.KEY.ESCAPE]: () => {
				if (loop.state.get().isPaused) {
					loop.togglePause();
				}
			},
			[Game.KEY.SPACEBAR]: () => {
				if (loop.state.get().isRunning) {
					loop.togglePause();
				}
			},
			[useArrows ? Game.KEY.LEFT : Game.KEY.A]: () => {
				if (!loop.state.get().isPaused) {
					snake.nextWest();
				}
				loop.start();
			},
			[useArrows ? Game.KEY.RIGHT : Game.KEY.D]: () => {
				if (!loop.state.get().isPaused) {
					snake.nextEast();
				}
				loop.start();
			},
			[useArrows ? Game.KEY.UP : Game.KEY.W]: () => {
				if (!loop.state.get().isPaused) {
					snake.nextNorth();
				}
				loop.start();
			},
			[useArrows ? Game.KEY.DOWN : Game.KEY.S]: () => {
				if (!loop.state.get().isPaused) {
					snake.nextSouth();
				}
				loop.start();
			},
		};
	}
}
