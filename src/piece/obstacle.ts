import { Piece } from '../piece.js';
import { Atom } from '../atom.js';

export class Obstacle extends Piece {
	constructor() {
		super();
		this._preUpdateSortOrder = 10;
		this._atoms = [new Atom(this, Atom.TYPE.OBSTACLE, 0, 0)];
	}
}
