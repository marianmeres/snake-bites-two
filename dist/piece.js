"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Piece = void 0;
const renderer_console_1 = require("./renderer/renderer-console");
class Piece {
    _atoms;
    static DIRECTION = {
        NORTH: 'N',
        EAST: 'E',
        SOUTH: 'S',
        WEST: 'W',
    };
    renderer = renderer_console_1.rendererPiece;
    constructor(_atoms) {
        this._atoms = _atoms;
    }
}
exports.Piece = Piece;
