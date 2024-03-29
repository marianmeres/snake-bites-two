import { PlainTextTemplate } from "../dist/renderer/plain-text.js";
import { boardHTML, gameLoopState, lastCollision, scores, sound, speed, twoPlayerSwitch } from "./stores.js";
import { $on, qs } from "../dist/utils/dom.js";
import { isFn } from "../dist/utils/is-fn.js";
import { GAME_EVENT } from "../dist/constants.js";
import { Game } from "../dist/game.js";
import { EJS } from "./ejs.js";

// This is just a quick-n-dirty (and probably expensive) misuse of the plain-text
// debug renderer... I guess it could be easily optimized:
// - either as dom manipulation based render (modifying dom nodes instead
//   of constantly replacing the entire innerHTML)
// - or as canvas drawing...
// Both should be doable via Board.renderer and Atom.renderer

// removing emojis, since they differ on platform/os and are harder to size correctly
// PlainTextTemplate.ATOM_APPLE = (atom) => '<span class="apple">&#x1F34E;</span>';
// PlainTextTemplate.ATOM_BONUS = (atom) => '<span class="obstacle">&#x1F36D;</span>';
// PlainTextTemplate.ATOM_OBSTACLE = (atom) => '<span class="obstacle">&#x1F4A9;</span>';

PlainTextTemplate.CELL_EMPTY = () => '<span></span>';
PlainTextTemplate.ROW = (cells) => `<div class="row">${cells}</div>`;

PlainTextTemplate.ATOM_APPLE = (atom) => `<span>${EJS.apple({})}</span>`;
PlainTextTemplate.ATOM_OBSTACLE = (atom) => `<span>${EJS.poo({})}</span>`;
PlainTextTemplate.ATOM_BONUS = (atom) => `<span>${EJS.lollipop({})}</span>`;

PlainTextTemplate.ATOM_SNAKE_HEAD = (atom) => {
	const d = atom.piece.direction;
	const cls = atom.piece.custom?.cssClass;
	return `<span class="shead d${d} ${cls}">${EJS.snake_eyes({})}</span>`;
}

PlainTextTemplate.ATOM_SNAKE_BODY = (atom) => {
	const cls = atom.piece.custom?.cssClass;
	const total = atom.piece.atoms.length;

	// opacity dance
	const max = 95;
	const min = Math.max(20, max - 5 * total);
	const step = Math.round((max - min) / total);
	const op = Math.max(min, max - (step * atom.index));

	// border radius
	const dp = atom.dirToPrevious || '-';
	const dn = atom.dirToNext || '-';
	const last = atom.isLast ? 'last' : '';

	return `<span class="sbody ${cls} dp${dp} dn${dn} ${last}" style="opacity: ${op}%"></span>`;
}

let unsubs = [];
const tearDownFn = () => {
	unsubs.forEach((fn) => isFn(fn) && fn());
	unsubs = [];
}

const renderFn = (b) => boardHTML.set(b.toString());

const $soundApple = qs('#soundApple');
const $soundBonus = qs('#soundBonus');
const $soundCrash = qs('#soundCrash');

export const initialize = () => {
	tearDownFn();
	scores.set({ score1: 0, score2: 0 });

	const { loop, onKeydown, snakes, board } = Game.create({
		updateTickFrequencyHz: speed.get(),
		twoPlayers: twoPlayerSwitch.get(),
		renderFn,
		tearDownFn,
		x: 23,
		y: 13,
	});

	// "forward" loop state
	unsubs.push(loop.state.subscribe((v) => gameLoopState.set(v)));

	// key bindings
	unsubs.push($on(document, 'keydown', onKeydown));

	// scores
	snakes.forEach((s, idx) => {
		unsubs.push(s.score.subscribe((v) => {
			scores.update((prev) => ({...prev, [`score${idx + 1}`]: v }));
		}))
	});

	unsubs.push(board.pubsub.subscribe(GAME_EVENT.COLLISION, (v) => {
		lastCollision.set(v);
		sound.get() && $soundCrash.play();
	}));

	unsubs.push(board.pubsub.subscribe(GAME_EVENT.SNAKE_EATS_APPLE, () => {
		sound.get() && $soundApple.play();
	}));

	unsubs.push(board.pubsub.subscribe(GAME_EVENT.SNAKE_EATS_BONUS, () => {
		sound.get() && $soundBonus.play();
	}));

	renderFn(board);
}
