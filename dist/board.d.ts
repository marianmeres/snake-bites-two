import { Piece } from './piece.js';
export declare class Board {
    readonly x: number;
    readonly y: number;
    protected _cells: any[][];
    readonly pubsub: {
        publish: (event: any, data?: {}) => void;
        subscribe: (event: any, cb: any) => () => any;
        subscribeOnce: (event: any, cb: any) => () => any;
        unsubscribeAll: (event: any) => boolean;
    };
    protected _updateCounter: number;
    static renderer: Function;
    constructor(x: number, y: number, cellFactory?: any);
    get updateCounter(): number;
    createGrid(cellFactory?: any): any[][];
    mergeGrids(...grids: any[]): any[][];
    forEachXY(cb: Function): this;
    normalizeX(x: any): number;
    normalizeY(y: any): number;
    cell(x: any, y: any, assert?: boolean): Piece;
    emptyCoords(): any[];
    randomEmptyYX(): any;
    setPieceAtRandomEmptyXY(piece: Piece): any;
    hasPiece(ctor: any): boolean;
    setPiece(x: any, y: any, piece: Piece): this;
    movePiece(originX: any, originY: any, targetX: any, targetY: any, assert?: boolean): this;
    atomize(): any[][];
    update(): this;
    resetScores(): void;
    render(): any;
    toString(): string;
}
