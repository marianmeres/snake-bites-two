import { isFn } from './is-fn.js';

export const createGrid = (
	width: number,
	height: number,
	cellValueOrFactory: any = null
): any[][] => {
	const grid = [];
	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			grid[x] = grid[x] || [];
			grid[x][y] = isFn(cellValueOrFactory)
				? cellValueOrFactory(x, y)
				: cellValueOrFactory;
		}
	}
	return grid;
};
