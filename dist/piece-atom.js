"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PieceAtom = void 0;
const is_fn_1 = require("./utils/is-fn");
const renderer_console_1 = require("./renderer/renderer-console");
class PieceAtom {
    type;
    static TYPE = {
        SNAKE_HEAD: 'snake-head',
        SNAKE_BODY: 'snake-body',
        APPLE: 'apple',
        OBSTACLE: 'obstacle',
        BONUS: 'bonus',
    };
    // relative position to piece
    // "move steps" per tick update
    // speed: number = 1;
    // direction = null;
    renderer = renderer_console_1.rendererPieceAtom;
    constructor(type = PieceAtom.TYPE.SNAKE_HEAD) {
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
exports.PieceAtom = PieceAtom;
