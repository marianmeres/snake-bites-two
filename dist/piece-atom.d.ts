export declare class PieceAtom {
    type: string;
    static readonly TYPE: {
        SNAKE_HEAD: string;
        SNAKE_BODY: string;
        APPLE: string;
        OBSTACLE: string;
        BONUS: string;
    };
    renderer: Function;
    constructor(type?: string);
    update(): void;
    render(): any;
}
