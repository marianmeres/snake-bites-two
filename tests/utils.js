const { renderMultipleBoards } = require('../dist/utils/render-multiple-boards');
const { AssertionError } = require('assert');
const { trimLines } = require('../dist/utils/trim-lines');

const assertEqualBoards = (actual, expected) => {
	const boards = [actual, expected].map((b) =>
		typeof b === 'string' ? trimLines(b) : b.render()
	);
	if (boards[0] !== boards[1]) {
		renderMultipleBoards(boards, ['Actual', 'Expected'], true);
		throw new AssertionError({ message: 'Boards are not equal' });
	}
};

module.exports = {
	assertEqualBoards,
};
