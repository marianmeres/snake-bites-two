import { PieceAtom } from './piece-atom';
export declare class Piece {
    protected _atoms: PieceAtom[];
    static readonly DIRECTION: {
        NORTH: string;
        EAST: string;
        SOUTH: string;
        WEST: string;
    };
    renderer: Function;
    constructor(_atoms: PieceAtom[]);
}
