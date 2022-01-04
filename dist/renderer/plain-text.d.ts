import { Board } from '../board.js';
import { Atom } from '../atom.js';
export declare class PlainTextTemplate {
    static CELL_EMPTY: (x: number, y: number) => string;
    static CELL_VOID: (x: number, y: number) => string;
    static ATOM_SNAKE_HEAD: (atom: Atom) => string;
    static ATOM_SNAKE_BODY: (atom: Atom) => string;
    static ATOM_APPLE: (atom: Atom) => string;
    static ATOM_OBSTACLE: (atom: Atom) => string;
    static ATOM_BONUS: (atom: Atom) => string;
    static ATOM_UNKNOWN: (atom: Atom) => string;
    static NEW_LINE: string;
    static ROW: (cellsStr: string) => string;
    static useDefaults(): void;
}
export declare const renderBoardPlainText: (board: Board, newLineSeparator?: string) => string;
export declare const renderGridPlainText: (grid: any[][], newLineSeparator?: string) => string;
export declare const renderAtomPlainText: (atom: Atom) => string;
