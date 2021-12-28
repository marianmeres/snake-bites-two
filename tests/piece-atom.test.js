const { TestRunner } = require('test-runner');
const path = require('path');
const { Board, Piece, PieceAtom } = require('../dist');

const suite = new TestRunner(path.basename(__filename));

suite.test('foo', () => {
	let b = new Board(3, 3);

	// b.setPiece(1, 1, new PieceAtom())
});

//
if (require.main === module) {
	suite.run();
}

module.exports = suite;
