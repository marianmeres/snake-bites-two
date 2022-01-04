import { Atom } from '../atom.js';
import { gridForEach } from '../utils/grid-foreach.js';
export class PlainTextTemplate {
    static CELL_EMPTY;
    static CELL_VOID;
    static ATOM_SNAKE_HEAD;
    static ATOM_SNAKE_BODY;
    static ATOM_APPLE;
    static ATOM_OBSTACLE;
    static ATOM_BONUS;
    static ATOM_UNKNOWN;
    static NEW_LINE;
    static ROW;
    // prettier-ignore
    static useDefaults() {
        PlainTextTemplate.CELL_EMPTY = (x, y) => '[ ]';
        PlainTextTemplate.CELL_VOID = (x, y) => '   ';
        PlainTextTemplate.ATOM_SNAKE_HEAD = (atom) => '[$]';
        PlainTextTemplate.ATOM_SNAKE_BODY = (atom) => '[s]';
        PlainTextTemplate.ATOM_APPLE = (atom) => '[@]';
        PlainTextTemplate.ATOM_OBSTACLE = (atom) => '[#]';
        PlainTextTemplate.ATOM_BONUS = (atom) => '[+]';
        PlainTextTemplate.ATOM_UNKNOWN = (atom) => '?A?';
        PlainTextTemplate.NEW_LINE = '\n';
        PlainTextTemplate.ROW = (str) => str;
    }
}
PlainTextTemplate.useDefaults();
export const renderBoardPlainText = (board, newLineSeparator = PlainTextTemplate.NEW_LINE) => renderGridPlainText(board.atomize(), newLineSeparator);
export const renderGridPlainText = (grid, newLineSeparator = PlainTextTemplate.NEW_LINE) => {
    let rows = [];
    gridForEach(grid, (x, y) => {
        rows[y] = rows[y] || '';
        const atom = grid[x][y];
        let atomString = '';
        if (atom === null) {
            atomString = PlainTextTemplate.CELL_EMPTY(x, y);
        }
        else if (atom === void 0) {
            atomString = PlainTextTemplate.CELL_VOID(x, y);
        }
        else {
            atomString = grid[x][y].toString();
        }
        rows[y] += atomString;
    });
    return rows.map((c) => PlainTextTemplate.ROW(c)).join(newLineSeparator);
};
export const renderAtomPlainText = (atom) => {
    const icon = {
        [Atom.TYPE.SNAKE_HEAD]: PlainTextTemplate.ATOM_SNAKE_HEAD,
        [Atom.TYPE.SNAKE_BODY]: PlainTextTemplate.ATOM_SNAKE_BODY,
        [Atom.TYPE.APPLE]: PlainTextTemplate.ATOM_APPLE,
        [Atom.TYPE.OBSTACLE]: PlainTextTemplate.ATOM_OBSTACLE,
        [Atom.TYPE.BONUS]: PlainTextTemplate.ATOM_BONUS,
    };
    return icon[atom.type](atom) || PlainTextTemplate.ATOM_UNKNOWN(atom);
};
