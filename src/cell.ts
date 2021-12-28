import { Board } from './board';
import { isFn } from './utils/is-fn';
import { rendererConsoleCell } from './renderer/renderer-console';

export class Cell {
	static readonly TYPE = {
		NORMAL: 'normal',
		VOID: 'void',
	};

	renderer: Function = rendererConsoleCell;

	constructor(
		public readonly board: Board,
		public readonly x,
		public readonly y,
		public piece = null,
		public type = Cell.TYPE.NORMAL
	) {}

	render() {
		return isFn(this.renderer) ? this.renderer(this) : this.type;
	}
}
