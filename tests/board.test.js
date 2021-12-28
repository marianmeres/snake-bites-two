const path = require('path');
const assert = require('assert').strict;
const { TestRunner } = require('test-runner');
const { Board } = require('../dist');
const { Cell } = require('../dist');
const { Piece } = require('../dist');
const { renderMultipleBoards } = require('../dist/utils/render-multiple-boards');
const { trimLines } = require('../dist/utils/trim-lines');
const { assertEqualBoards } = require('./utils');

const suite = new TestRunner(path.basename(__filename));

suite.skip('empty board render', () => {
	let b = new Board(3, 3);
	const actual = b.render();
	const expected = `
		[ ][ ][ ]
		[ ][ ][ ]
		[ ][ ][ ]
	`;
	assertEqualBoards(actual, expected);
});

suite.test('empty board with void cells render', () => {
	let b = new Board(3, 3);

	b.cell(0, 2).type = Cell.TYPE.VOID;
	b.cell(1, 1).type = Cell.TYPE.VOID;

	const actual = b.render();
	const expected = `
		[ ][ ][ ]
		[ ]   [ ]
		   [ ][ ]
	`;
	assertEqualBoards(actual, expected);
});

// suite.skip('basic update works', () => {
// 	let b = new Board(3, 3);
// 	b.cell(1, 1).piece = Piece.factorySnakeHead();
//
// 	const progress = [b.render()];
//
// 	b.update();
//
// 	progress.push(b.render());
//
// 	// console.log(b.render());
// 	renderMultipleBoards(progress, [], true);
// });

//
if (require.main === module) {
	suite.run();
}

module.exports = suite;
