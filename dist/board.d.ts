import { Cell } from './cell';
import { Piece } from './piece';
export declare class Board {
    readonly x: number;
    readonly y: number;
    protected _cells: Cell[][];
    renderer: Function;
    borderless: boolean;
    constructor(x: number, y: number);
    cell(x: any, y: any): Cell;
    setPiece(x: number, y: number, piece: Piece): Board;
    isMovableToCell(): void;
    forEach(cb: any): void;
    update(): void;
    render(): any;
}
