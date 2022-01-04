// debug helper
import { trimLines } from './trim-lines.js';

/**
 * Will render multiple boards horizontaly side by side, so it's easy to visualy compare
 * @param renderedBoards
 * @param labels
 */
export const renderMultipleBoards = (
	renderedBoards: string[],
	labels: string[] = []
): string => {
	const hSep = '   '; // 3 spaces - so the width matches "[ ]"
	const vSep = '\n';
	let out = '';

	//
	let boards = [];
	let maxH = 0;
	let maxW = 0;

	//
	renderedBoards.forEach((board, bIdx) => {
		const lines = [];
		let boardW = 0;
		trimLines(board)
			.split('\n')
			.forEach((line, lIdx) => {
				lines[lIdx] = lines[lIdx] || [];
				lines[lIdx].push(line);
				boardW = Math.max(boardW, line.length);
			});
		maxH = Math.max(maxH, lines.length);
		maxW = Math.max(maxW, boardW);
		boards[bIdx] = [boardW, lines];
	});

	//
	labels = labels || [];
	labels.forEach((label) => (maxW = Math.max(maxW, label.length)));

	//
	labels.forEach((label) => (out += label.padEnd(maxW, ' ') + hSep));
	if (labels.length) out += vSep;

	//
	for (let i = 0; i < maxH; i++) {
		boards.forEach(([width, lines]) => {
			const line = `${lines[i] || ''}`.padEnd(Math.max(maxW, width), ' ');
			out += line + hSep;
		});
		out += vSep;
	}

	// trim trailing \n
	out = out.trim();

	return out;
};
