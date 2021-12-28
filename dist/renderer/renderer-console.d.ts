import { Board } from '../board';
import { Cell } from '../cell';
import { PieceAtom } from '../piece-atom';
import { Piece } from '../piece';
export declare const rendererConsoleBoard: (board: Board) => string;
export declare const rendererConsoleCell: (cell: Cell) => any;
export declare const rendererPieceAtom: (pieceAtom: PieceAtom) => void;
export declare const rendererPiece: (piece: Piece) => void;
