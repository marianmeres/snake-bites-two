import { strict as assert } from 'assert';
import * as path from 'path';
import isEqual from 'lodash-es/isEqual.js';
import { TestRunner } from 'test-runner';
import { fileURLToPath } from 'url';
import { createDerivedStore, createStore } from '../dist/utils/create-store.js';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const suite = new TestRunner(path.basename(__filename));

suite.test('derived store works', () => {
	const str = createStore('foo');
	const num = createStore('123');

	let _counter: any = 0;
	const derived = createDerivedStore([str, num], ([_str, _num]) => {
		_counter++;
		return { str: `${_str}`.toUpperCase(), num: _num * -1 };
	});

	assert(_counter === 0);

	const log = [];
	const log2 = [];
	const unsub = derived.subscribe((val) => log.push(val));
	const unsub2 = derived.subscribe((val) => log2.push(val));

	assert(_counter === 0);
	assert(derived.get() === void 0);

	// above: so far no derived activity, so trigger now:
	num.set(456);

	assert(_counter === 1);
	assert(log.length === 1);
	assert(log2.length === 1);
	assert(isEqual(derived.get(), { str: 'FOO', num: -456 }));

	// trigger another
	str.set('bar');
	assert(_counter === 2); // +1
	assert(isEqual(derived.get(), { str: 'BAR', num: -456 }));

	// trigger another two
	num.set(-789);
	str.set('baz');
	assert(_counter === 4); // +2
	assert(isEqual(derived.get(), { str: 'BAZ', num: 789 }));
	assert(
		isEqual(log, [
			{ str: 'FOO', num: -456 },
			{ str: 'BAR', num: -456 },
			{ str: 'BAR', num: 789 },
			{ str: 'BAZ', num: 789 },
		])
	);
	assert(isEqual(log, log2));

	// now unsub...
	unsub();

	// must not effect log
	num.set(-1);
	str.set('x');
	assert(!isEqual(log, log2));
	assert(log2.length === log.length + 2);

	// explicit get works normally
	assert(isEqual(derived.get(), { str: 'X', num: 1 }));
});

suite.test('derived subscribe getImmediate works', () => {
	const str = createStore('foo');
	const num = createStore('123');

	const derived = createDerivedStore([str, num], ([_str, _num]) => {
		return { str: `${_str}`.toUpperCase(), num: _num * -1 };
	});

	const log = [];
	derived.subscribe((v) => log.push(v), true);

	assert(isEqual(log, [{ str: 'FOO', num: -123 }]));
});

suite.test('derived subscribeOnce works', () => {
	const str = createStore('foo');
	const num = createStore('123');

	const derived = createDerivedStore([str, num], ([_str, _num]) => {
		return { str: `${_str}`.toUpperCase(), num: _num * -1 };
	});

	const log = [];
	derived.subscribeOnce((v) => log.push(v));

	assert(log.length === 0);

	str.set('bar');
	str.set('baz');

	// BAR not BAZ
	assert(isEqual(log, [{ str: 'BAR', num: -123 }]));
});

//
export default suite;
