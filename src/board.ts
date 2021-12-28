import { Cell } from './cell';
import { isFn } from './utils/is-fn';
import { Piece } from './piece';
import { rendererConsoleBoard } from './renderer/renderer-console';

export class Board {
	protected _cells: Cell[][] = [];

	renderer: Function = rendererConsoleBoard;

	// whether crossing boundaries is allowed
	borderless: boolean = true;

	constructor(public readonly x: number, public readonly y: number) {
		for (let x = 0; x < this.x; x++) {
			for (let y = 0; y < this.y; y++) {
				this._cells[x] = this._cells[x] || [];
				this._cells[x][y] = new Cell(this, x, y);
			}
		}
	}

	cell(x, y): Cell {
		return this._cells[x] ? this._cells[x][y] : void 0;
	}

	setPiece(x: number, y: number, piece: Piece): Board {
		return this;
	}

	isMovableToCell() {}

	forEach(cb) {
		if (isFn(cb)) {
		}
	}

	update() {}

	render() {
		return isFn(this.renderer) ? this.renderer(this) : null;
	}
}
