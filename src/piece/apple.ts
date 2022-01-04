import { Piece } from '../piece.js';
import { Atom } from '../atom.js';

export class Apple extends Piece {
	constructor() {
		super();
		this._preUpdateSortOrder = 20;
		this._atoms = [new Atom(this, Atom.TYPE.APPLE, 0, 0)];
	}
}
