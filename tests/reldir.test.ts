import { strict as assert } from 'assert';
import * as path from 'path';
import { TestRunner } from 'test-runner';
import { fileURLToPath } from 'url';
import { gridCreate } from '../dist/utils/grid-create.js';
import { gridRelativeDirection } from '../src/utils/grid-relative-direction.js';
import { gridForEach } from '../src/utils/grid-foreach.js';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const suite = new TestRunner(path.basename(__filename));

const testRelDir = (fromX, fromY, x, y, expected) => {
	const actual = gridRelativeDirection([fromX, fromY], [x, y]);
	assert(actual === expected[y][x], `${actual} !== ${expected[y][x]} [${x},${y}]`);
};

suite.only('relative direction', () => {
	// prettier-ignore
	const expected = [
		['NW', 'NNW', 'N', 'NNE', 'NE'],
		['NWW', 'NW', 'N', 'NE', 'NEE'],
		['W',   'W',  null, 'E', 'E'  ],
		['SWW', 'SW', 'S', 'SE', 'SEE'],
		['SW', 'SSW', 'S', 'SSE', 'SE'],
	];

	const grid = gridCreate(5, 5);

	gridForEach(grid, (x, y) => (grid[y][x] = gridRelativeDirection([2, 2], [x, y])));
	// console.log(grid);

	gridForEach(grid, (x, y) => testRelDir(2, 2, x, y, expected));
});

//
export default suite;
