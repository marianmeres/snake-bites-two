import { Piece } from '../piece.js';
import { Atom } from '../atom.js';
export class Bonus extends Piece {
    constructor() {
        super();
        this._preUpdateSortOrder = 30;
        this._atoms = [new Atom(this, Atom.TYPE.BONUS, 0, 0)];
    }
}
