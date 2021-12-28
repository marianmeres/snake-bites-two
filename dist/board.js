"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
const cell_1 = require("./cell");
const is_fn_1 = require("./utils/is-fn");
const renderer_console_1 = require("./renderer/renderer-console");
class Board {
    x;
    y;
    _cells = [];
    renderer = renderer_console_1.rendererConsoleBoard;
    // whether crossing boundaries is allowed
    borderless = true;
    constructor(x, y) {
        this.x = x;
        this.y = y;
        for (let x = 0; x < this.x; x++) {
            for (let y = 0; y < this.y; y++) {
                this._cells[x] = this._cells[x] || [];
                this._cells[x][y] = new cell_1.Cell(this, x, y);
            }
        }
    }
    cell(x, y) {
        return this._cells[x] ? this._cells[x][y] : void 0;
    }
    setPiece(x, y, piece) {
        return this;
    }
    isMovableToCell() { }
    forEach(cb) {
        if ((0, is_fn_1.isFn)(cb)) {
        }
    }
    update() { }
    render() {
        return (0, is_fn_1.isFn)(this.renderer) ? this.renderer(this) : null;
    }
}
exports.Board = Board;
