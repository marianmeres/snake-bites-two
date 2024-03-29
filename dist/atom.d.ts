import { Piece } from './piece.js';
export interface AtomCoords {
    xy: number[];
    offsetXY: number[];
}
export declare class Atom {
    readonly piece: Piece;
    readonly type: string;
    protected _offsetX: number;
    protected _offsetY: number;
    static readonly TYPE: {
        SNAKE_HEAD: string;
        SNAKE_BODY: string;
        APPLE: string;
        OBSTACLE: string;
        BONUS: string;
    };
    protected _x: number;
    protected _y: number;
    index: number;
    readonly id: string;
    static renderer: Function;
    constructor(piece: Piece, type: string, _offsetX?: number, _offsetY?: number);
    get isLast(): boolean;
    get offsetX(): number;
    get offsetY(): number;
    get offsetXY(): number[];
    set x(x: number);
    get x(): number;
    set y(y: number);
    get y(): number;
    get xy(): number[];
    get _xy(): number[];
    get hasPrevious(): boolean;
    get hasNext(): boolean;
    get previous(): Atom;
    get next(): Atom;
    get dirToPrevious(): "N" | "E" | "S" | "W" | "NW" | "NNW" | "NWW" | "SW" | "SSW" | "SWW" | "NE" | "NNE" | "NEE" | "SE" | "SSE" | "SEE";
    get dirToNext(): "N" | "E" | "S" | "W" | "NW" | "NNW" | "NWW" | "SW" | "SSW" | "SWW" | "NE" | "NNE" | "NEE" | "SE" | "SSE" | "SEE";
    protected _updateCoordinates(oldAtomsCoords: AtomCoords[]): this;
    protected _updateOffsets(oldAtomsCoords: AtomCoords[]): this;
    update(oldAtomsCoords: AtomCoords[]): this;
    render(): any;
    toString(): string;
}
