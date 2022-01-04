import { isFn } from './is-fn.js';

export const gridForEach = (grid: any[][], cb: Function) => {
	if (isFn(cb) && Array.isArray(grid)) {
		for (let x = 0; x < grid.length; x++) {
			if (Array.isArray(grid[0])) {
				for (let y = 0; y < grid[0].length; y++) {
					cb(x, y, grid);
				}
			}
		}
	}
};
