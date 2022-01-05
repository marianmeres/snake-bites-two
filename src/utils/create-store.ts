import { createPubSub } from './create-pub-sub.js';
import { assertTypeFn, isFn } from './is-fn.js';

export interface StoreReadable {
	get: Function;
	subscribe: Function;
	subscribeOnce: Function;
}

export interface StoreLike extends StoreReadable{
	set: Function;
	update: Function;
}

// naive ducktype discovery
export const isStoreLike = (v) => isFn(v.subscribe) && isFn(v.get);

export const createStore = (initial, { persist } = { persist: null }): StoreLike => {
	let _pubsub = createPubSub();
	let _value = initial;

	const set = (value) => {
		// shallow strict compare
		if (_value !== value) {
			_value = value;
			isFn(persist) && persist(_value);
			_pubsub.publish('change', _value);
		}
	};

	const get = () => _value;

	const update = (cb) => {
		assertTypeFn(cb, '[createStore.update]');
		set(cb(get()));
	};

	const subscribe = (cb, getImmediate = false) => {
		assertTypeFn(cb, '[createStore.subscribe]');
		getImmediate && cb(_value);
		return _pubsub.subscribe('change', cb);
	};

	const subscribeOnce = (cb) => {
		assertTypeFn(cb, '[createStore.subscribe]');
		return _pubsub.subscribeOnce('change', cb);
	};

	return { set, get, update, subscribe, subscribeOnce };
};

/* WIP
export const createDerivedStore = (stores: StoreLike[], deriveFn: Function): StoreReadable => {
	const derived = createStore(null);
	const values = [];
	const unsubs = [];

	// save initial values...
	stores.forEach((s) => {
		if (!isStoreLike(s)) throw new TypeError('Expecting array of stores');
		values.push(s.get())
	});

	// subscribe to each individually, but call outFn with all values
	stores.forEach((s, idx) => {
		unsubs.push(s.subscribe((value) => {
			values[idx] = value;
			derived.set(deriveFn(...values));
		}))
	});

	const derivedUnsub = derived.subscribe()

	const unsubscribe = () => unsubs.forEach((fn) => fn());

	const subscribe = (event, cb) => {
		const unsub = derived.subscribe(event, cb);
		return () => {
			unsubscribe()
		};
	}

	return { get: derived.get, subscribe, subscribeOnce };
}
*/
