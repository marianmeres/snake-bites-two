import { isFn } from './utils/is-fn';
import { Board } from './board';
import { rendererPieceAtom } from './renderer/renderer-console';

export class PieceAtom {
	static readonly TYPE = {
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

	renderer: Function = rendererPieceAtom;

	constructor(public type = PieceAtom.TYPE.SNAKE_HEAD) // public readonly board: Board,
	// public x: number = 0,
	// public y: number = 0,
	// public direction: string = Piece.DIRECTION.SOUTH,
	// public speed: number = 1
	{}

	update() {}

	// get isMovable() {
	// 	return this.speed && this.direction;
	// }

	render() {
		return isFn(this.renderer) ? this.renderer(this) : this.type;
	}

	// static factorySnakeHead() {
	// 	return new Piece(Piece.TYPE.SNAKE_HEAD, Piece.DIRECTION.NORTH);
	// }
	//
	// static factoryObstacle() {
	// 	return new Piece(Piece.TYPE.OBSTACLE, null);
	// }
}
