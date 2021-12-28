import { Board } from './board';
export declare class Cell {
    readonly board: Board;
    readonly x: any;
    readonly y: any;
    piece: any;
    type: string;
    static readonly TYPE: {
        NORMAL: string;
        VOID: string;
    };
    renderer: Function;
    constructor(board: Board, x: any, y: any, piece?: any, type?: string);
    render(): any;
}
