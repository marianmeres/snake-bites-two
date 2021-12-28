"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rendererPiece = exports.rendererPieceAtom = exports.rendererConsoleCell = exports.rendererConsoleBoard = void 0;
const cell_1 = require("../cell");
const piece_atom_1 = require("../piece-atom");
const rendererConsoleBoard = (board) => {
    //
    let rows = [];
    for (let y = 0; y < board.y; y++) {
        rows[y] = '';
        for (let x = 0; x < board.x; x++) {
            rows[y] += board.cell(x, y).render();
        }
    }
    return rows.join('\n');
};
exports.rendererConsoleBoard = rendererConsoleBoard;
const rendererConsoleCell = (cell) => {
    // prettier-ignore
    const icon = {
        [cell_1.Cell.TYPE.NORMAL]: '[ ]',
        [cell_1.Cell.TYPE.VOID]: '   ',
    };
    return cell.piece ? cell.piece.render() : icon[cell.type] || '???';
};
exports.rendererConsoleCell = rendererConsoleCell;
const rendererPieceAtom = (pieceAtom) => {
    // prettier-ignore
    const icon = {
        [piece_atom_1.PieceAtom.TYPE.SNAKE_HEAD]: '[S]',
        [piece_atom_1.PieceAtom.TYPE.SNAKE_BODY]: '[s]',
        [piece_atom_1.PieceAtom.TYPE.APPLE]: '[@]',
        [piece_atom_1.PieceAtom.TYPE.OBSTACLE]: '[#]',
        [piece_atom_1.PieceAtom.TYPE.BONUS]: '[$]',
    };
};
exports.rendererPieceAtom = rendererPieceAtom;
const rendererPiece = (piece) => { };
exports.rendererPiece = rendererPiece;
