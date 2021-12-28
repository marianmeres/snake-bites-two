"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Piece = void 0;
const is_fn_1 = require("./utils/is-fn");
class Piece {
    type;
    // prettier-ignore
    static TYPE = {
        SNAKE_HEAD: '[S]',
        SNAKE_BODY: '[s]',
        APPLE: '[@]',
        OBSTACLE: '[#]',
        BONUS: '[$]',
    };
    static DIRECTION = {
        NORTH: 'N',
        EAST: 'E',
        SOUTH: 'S',
        WEST: 'W',
    };
    // "move steps" per tick update
    // speed: number = 1;
    // direction = null;
    renderer;
    constructor(type = Piece.TYPE.SNAKE_HEAD) {
        this.type = type;
    }
    update() { }
    // get isMovable() {
    // 	return this.speed && this.direction;
    // }
    render() {
        return (0, is_fn_1.isFn)(this.renderer) ? this.renderer(this) : this.type;
    }
}
exports.Piece = Piece;
