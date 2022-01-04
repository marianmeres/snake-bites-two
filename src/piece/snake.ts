import { Piece } from '../piece.js';
import { createStore } from '../utils/create-store.js';
import { Atom, AtomCoords } from '../atom.js';
import { GAME_EVENT } from '../constants.js';

export class Snake extends Piece {
	score = createStore(0);

	constructor(
		length: number = 2,
		direction: string,
		label: string = 'snake',
		speed: number = 1
	) {
		super();

		if (typeof length !== 'number' || length < 1) {
			throw new Error(`Invalid snake length; expecting int > 0`);
		}

		this.speed = speed;
		this.direction = direction;
		this.moveStrategy = Piece.MOVE_STRATEGY.SNAKE;
		this._preUpdateSortOrder = 99999;

		this._atoms = [];

		for (let i = 0; i < length; i++) {
			let [x, y] = this._getInitialAtomOffsetByAtomIndex(i);
			const type = !i ? Atom.TYPE.SNAKE_HEAD : Atom.TYPE.SNAKE_BODY;
			this._atoms.push(new Atom(this, type, x, y));
		}
	}

	protected _getInitialAtomOffsetByAtomIndex(idx: number): number[] {
		// first atom has no offset
		if (!idx) return [0, 0];

		switch (this.direction) {
			case Piece.DIRECTION.NORTH:
				return [0, idx];
			case Piece.DIRECTION.SOUTH:
				return [0, -1 * idx];
			case Piece.DIRECTION.EAST:
				return [-1 * idx, 0];
			case Piece.DIRECTION.WEST:
				return [idx, 0];
			default:
				throw new Error(`Invalid direction ${this.direction}`);
		}
	}

	protected _customCollisionHandler(atom: Atom): Boolean {
		if (atom.type === Atom.TYPE.APPLE) {
			this.board.pubsub.publish(GAME_EVENT.SNAKE_EATS_APPLE, this);
		} else if (atom.type === Atom.TYPE.BONUS) {
			this.board.pubsub.publish(GAME_EVENT.SNAKE_EATS_BONUS, this);
		} else {
			return false;
		}
		return true;
	}

	addTailAtom(oldAtomsCoords: AtomCoords[]) {
		let offsetX;
		let offsetY;

		if (this._atoms.length < 2) {
			let xy = this._getInitialAtomOffsetByAtomIndex(1);
			offsetX = xy[0];
			offsetX = xy[1];
		} else {
			const [prevX, prevY] = oldAtomsCoords[this._atoms.length - 1].xy;
			offsetX = prevX - this.x;
			offsetY = prevY - this.y;

			// space problem - ak old na tej pozicii existuje tak nic...
			for (let i = 0; i < oldAtomsCoords.length; i++) {
				const [x, y] = oldAtomsCoords[i].xy;
				if (x === this.x && y === this.y) {
					// noop signal
					return false;
				}
			}
		}

		const atom = new Atom(this, Atom.TYPE.SNAKE_BODY, offsetX, offsetY);
		atom.x = this.x;
		atom.y = this.y;

		this._atoms.push(atom);
	}

	addPostMoveTailAtoms(count: number = 1) {
		for (let i = 0; i < count; i++) {
			this.postMoveActionStackPush((snake: Snake, oldAtomsCoords: AtomCoords[]) => {
				return snake.addTailAtom(oldAtomsCoords);
			});
		}
	}
}
