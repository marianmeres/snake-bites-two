import { createId } from './utils/create-id.js';
import { renderAtomPlainText } from './renderer/plain-text.js';
import { isFn } from './utils/is-fn.js';
import { Piece } from './piece.js';
import { gridRelativeDirection } from './utils/grid-relative-direction.js';

export interface AtomCoords {
	xy: number[];
	offsetXY: number[];
}

export class Atom {
	static readonly TYPE = {
		SNAKE_HEAD: 'snake-head',
		SNAKE_BODY: 'snake-body',
		APPLE: 'apple',
		OBSTACLE: 'obstacle',
		BONUS: 'bonus',
	};

	protected _x: number;

	protected _y: number;

	// atom's index in piece.atoms stack
	index: number;

	readonly id = createId('atom-');

	static renderer: Function;

	constructor(
		public readonly piece: Piece,
		public readonly type: string,
		protected _offsetX: number = 0,
		protected _offsetY: number = 0
	) {
		if (!this.piece) {
			throw new Error('Missing atom._piece instance');
		}
	}

	get isLast() {
		return this.index === this.piece.atoms.length - 1;
	}

	get offsetX() {
		return this._offsetX;
	}

	get offsetY() {
		return this._offsetY;
	}

	get offsetXY(): number[] {
		return [this._offsetX, this._offsetY];
	}

	set x(x: number) {
		this._x = this.piece.board.normalizeX(x);
	}

	get x() {
		return this.piece.board.normalizeX(this._x + this._offsetX);
	}

	set y(y: number) {
		this._y = this.piece.board.normalizeY(y);
	}

	get y() {
		return this.piece.board.normalizeY(this._y + this._offsetY);
	}

	get xy(): number[] {
		return [this.x, this.y];
	}

	get _xy(): number[] {
		return [this._x, this._y];
	}

	get hasPrevious() {
		return !!this.index;
	}

	get hasNext() {
		return this.index < this.piece.atoms.length - 1;
	}

	get previous() {
		return this.hasPrevious ? this.piece.atoms[this.index - 1] : null;
	}

	get next() {
		return this.hasNext ? this.piece.atoms[this.index + 1] : null;
	}

	// gets relative direction to previous atom in stack
	get dirToPrevious() {
		if (!this.hasPrevious) return null;
		return gridRelativeDirection(this.xy, this.previous.xy);
	}

	// gets relative direction to next atom in stack
	get dirToNext() {
		if (!this.hasNext) return null;
		return gridRelativeDirection(this.xy, this.next.xy);
	}

	protected _updateCoordinates(oldAtomsCoords: AtomCoords[]) {
		// ?
		const step = this.piece.speed;

		switch (this.piece.direction) {
			case Piece.DIRECTION.NORTH:
				this._y += -1 * step;
				break;
			case Piece.DIRECTION.SOUTH:
				this._y += step;
				break;
			case Piece.DIRECTION.WEST:
				this._x += -1 * step;
				break;
			case Piece.DIRECTION.EAST:
				this._x += step;
				break;
		}
		return this;
	}

	protected _updateOffsets(oldAtomsCoords: AtomCoords[]) {
		if (this.piece.moveStrategy === Piece.MOVE_STRATEGY.SNAKE) {
			// sanity check - zero  atom has no offset
			if (this.index === 0) {
				this._offsetX = 0;
				this._offsetY = 0;
			} else {
				// IMPORTANT: use UNnormalized _x and _y below
				const [prevX, prevY] = oldAtomsCoords[this.index - 1].xy;
				if (this.x !== prevX) {
					this._offsetX = prevX - this._x;
				}
				if (this.y !== prevY) {
					this._offsetY = prevY - this._y;
				}
			}
		} else {
			// noop
		}
		return this;
	}

	update(oldAtomsCoords: AtomCoords[]) {
		if (this.piece.isMoving) {
			this._updateCoordinates(oldAtomsCoords)._updateOffsets(oldAtomsCoords);
		}
		return this;
	}

	render(): any {
		return isFn(Atom.renderer) ? Atom.renderer(this) : this.toString();
	}

	toString() {
		return renderAtomPlainText(this);
	}
}
