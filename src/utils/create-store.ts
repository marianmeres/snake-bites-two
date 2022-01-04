import { createPubSub } from './create-pub-sub.js';
import { assertTypeFn, isFn } from './is-fn.js';

export interface StoreLike {
	set: Function;
	get: Function;
	update: Function;
	subscribe: Function;
	subscribeOnce: Function;
}

// naive ducktype discovery
export const isStoreLike = (v) => isFn(v.subscribe) && isFn(v.get) && isFn(v.set);

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
