import { Piece } from '../piece.js';
import { Atom, AtomCoords } from '../atom.js';
export declare class Snake extends Piece {
    score: import("../utils/create-store.js").StoreLike;
    constructor(length: number, direction: string, label?: string, speed?: number);
    protected _getInitialAtomOffsetByAtomIndex(idx: number): number[];
    protected _customCollisionHandler(atom: Atom): Boolean;
    addTailAtom(oldAtomsCoords: AtomCoords[]): boolean;
    addPostMoveTailAtoms(count?: number): void;
}
