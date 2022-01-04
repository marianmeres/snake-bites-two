import { GameLoop } from './utils/create-game-loop.js';
import { Board } from './board.js';
import { Snake } from './piece/snake.js';
interface FactoryOptions {
    twoPlayers: boolean;
    x: number;
    y: number;
    maxObstacles: number;
    bonusProbability: number;
    eatAppleScore: number;
    eatBonusScore: number;
    setUpFn: Function;
    tearDownFn: Function;
    renderFn: (board: Board) => void;
}
export declare class Game {
    static readonly KEY: {
        A: number;
        S: number;
        D: number;
        W: number;
        LEFT: number;
        UP: number;
        RIGHT: number;
        DOWN: number;
        SPACEBAR: number;
        ESCAPE: number;
    };
    static create(options?: Partial<FactoryOptions>): {
        board: Board;
        snakes: Snake[];
        loop: GameLoop;
        onKeydown: (e: any) => void;
    };
    protected static _createControlBindingsMap(loop: GameLoop, snake: Snake, useArrows?: boolean): {
        [keyCode: number]: Function;
    };
}
export {};
