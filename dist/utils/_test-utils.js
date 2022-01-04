import { trimLines } from './trim-lines.js';
import { renderMultipleBoards } from './render-multiple-boards.js';
// test helper
export const assertEqualBoards = (actual, expected) => {
    // e.g. for tracking muliple updated states...
    if (Array.isArray(actual)) {
        actual = renderMultipleBoards(actual, []);
    }
    const boards = [actual, expected].map((b) => typeof b === 'string' ? trimLines(b) : b.toString());
    if (boards[0] !== boards[1]) {
        console.log('\n' + renderMultipleBoards(boards, ['Actual', 'Expected']) + '\n');
        throw new Error('Boards are not equal');
    }
};
