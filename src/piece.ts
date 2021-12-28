import { PieceAtom } from './piece-atom';
import { rendererPiece } from './renderer/renderer-console';

export class Piece {
	static readonly DIRECTION = {
		NORTH: 'N',
		EAST: 'E',
		SOUTH: 'S',
		WEST: 'W',
	};

	renderer: Function = rendererPiece;

	constructor(protected _atoms: PieceAtom[]) {}
}
