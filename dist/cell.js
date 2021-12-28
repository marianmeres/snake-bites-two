"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
const is_fn_1 = require("./utils/is-fn");
const renderer_console_1 = require("./renderer/renderer-console");
class Cell {
    board;
    x;
    y;
    piece;
    type;
    static TYPE = {
        NORMAL: 'normal',
        VOID: 'void',
    };
    renderer = renderer_console_1.rendererConsoleCell;
    constructor(board, x, y, piece = null, type = Cell.TYPE.NORMAL) {
        this.board = board;
        this.x = x;
        this.y = y;
        this.piece = piece;
        this.type = type;
    }
    render() {
        return (0, is_fn_1.isFn)(this.renderer) ? this.renderer(this) : this.type;
    }
}
exports.Cell = Cell;
