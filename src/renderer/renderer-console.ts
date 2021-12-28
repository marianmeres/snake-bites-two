import { Board } from '../board';
import { Cell } from '../cell';
import { isFn } from '../utils/is-fn';
import { PieceAtom } from '../piece-atom';
import { Piece } from '../piece';

export const rendererConsoleBoard = (board: Board) => {
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

export const rendererConsoleCell = (cell: Cell) => {
	// prettier-ignore
	const icon = {
		[Cell.TYPE.NORMAL]: '[ ]',
		[Cell.TYPE.VOID]:   '   ',
	}
	return cell.piece ? cell.piece.render() : icon[cell.type] || '???';
};

export const rendererPieceAtom = (pieceAtom: PieceAtom) => {
	// prettier-ignore
	const icon = {
		[PieceAtom.TYPE.SNAKE_HEAD]: '[S]',
		[PieceAtom.TYPE.SNAKE_BODY]: '[s]',
		[PieceAtom.TYPE.APPLE]:      '[@]',
		[PieceAtom.TYPE.OBSTACLE]:   '[#]',
		[PieceAtom.TYPE.BONUS]:      '[$]',
	};
};

export const rendererPiece = (piece: Piece) => {};
