import { Board } from '../board.js';
import { Atom } from '../atom.js';
import { gridForEach } from '../utils/grid-foreach.js';

export class PlainTextTemplate {
	static CELL_EMPTY: (x: number, y: number) => string;
	static CELL_VOID: (x: number, y: number) => string;

	static ATOM_SNAKE_HEAD: (atom: Atom) => string;
	static ATOM_SNAKE_BODY: (atom: Atom) => string;
	static ATOM_APPLE: (atom: Atom) => string;
	static ATOM_OBSTACLE: (atom: Atom) => string;
	static ATOM_BONUS: (atom: Atom) => string;
	static ATOM_UNKNOWN: (atom: Atom) => string;

	static NEW_LINE: string;
	static ROW: (cellsStr: string) => string;

	// prettier-ignore
	static useDefaults() {
		PlainTextTemplate.CELL_EMPTY      = (x, y) => '[ ]';
		PlainTextTemplate.CELL_VOID       = (x, y) => '   ';
		PlainTextTemplate.ATOM_SNAKE_HEAD = (atom: Atom) => '[$]';
		PlainTextTemplate.ATOM_SNAKE_BODY = (atom: Atom) => '[s]';
		PlainTextTemplate.ATOM_APPLE      = (atom: Atom) => '[@]';
		PlainTextTemplate.ATOM_OBSTACLE   = (atom: Atom) => '[#]';
		PlainTextTemplate.ATOM_BONUS      = (atom: Atom) => '[+]';
		PlainTextTemplate.ATOM_UNKNOWN    = (atom: Atom) => '?A?';
		PlainTextTemplate.NEW_LINE        = '\n';
		PlainTextTemplate.ROW             = (str) => str;
	}
}

PlainTextTemplate.useDefaults();

export const renderBoardPlainText = (
	board: Board,
	newLineSeparator = PlainTextTemplate.NEW_LINE
) => renderGridPlainText(board.atomize(), newLineSeparator);

export const renderGridPlainText = (
	grid: any[][],
	newLineSeparator = PlainTextTemplate.NEW_LINE
) => {
	let rows = [];
	gridForEach(grid, (x, y) => {
		rows[y] = rows[y] || '';
		const atom = grid[x][y];
		let atomString = '';
		if (atom === null) {
			atomString = PlainTextTemplate.CELL_EMPTY(x, y);
		} else if (atom === void 0) {
			atomString = PlainTextTemplate.CELL_VOID(x, y);
		} else {
			atomString = grid[x][y].toString();
		}
		rows[y] += atomString;
	});
	return rows.map((c) => PlainTextTemplate.ROW(c)).join(newLineSeparator);
};

export const renderAtomPlainText = (atom: Atom) => {
	const icon = {
		[Atom.TYPE.SNAKE_HEAD]: PlainTextTemplate.ATOM_SNAKE_HEAD,
		[Atom.TYPE.SNAKE_BODY]: PlainTextTemplate.ATOM_SNAKE_BODY,
		[Atom.TYPE.APPLE]: PlainTextTemplate.ATOM_APPLE,
		[Atom.TYPE.OBSTACLE]: PlainTextTemplate.ATOM_OBSTACLE,
		[Atom.TYPE.BONUS]: PlainTextTemplate.ATOM_BONUS,
	};
	return icon[atom.type](atom) || PlainTextTemplate.ATOM_UNKNOWN(atom);
};
