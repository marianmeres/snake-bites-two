"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.boardConsoleRenderer = void 0;
const boardConsoleRenderer = (board) => {
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
exports.boardConsoleRenderer = boardConsoleRenderer;
