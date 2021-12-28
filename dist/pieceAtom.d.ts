export declare class Piece {
    type: string;
    static readonly TYPE: {
        SNAKE_HEAD: string;
        SNAKE_BODY: string;
        APPLE: string;
        OBSTACLE: string;
        BONUS: string;
    };
    static readonly DIRECTION: {
        NORTH: string;
        EAST: string;
        SOUTH: string;
        WEST: string;
    };
    renderer: Function;
    constructor(type?: string);
    update(): void;
    render(): any;
}
