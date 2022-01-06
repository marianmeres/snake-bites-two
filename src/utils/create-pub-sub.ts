import { isFn } from './is-fn.js';

export const createPubSub = () => {
	const _subs = new Map();
	const _subsFor = (event) => (_subs[event] = _subs[event] || new Set());

	const publish = (event, detail = {}) => {
		_subsFor(event).forEach((cb) => cb(detail));
	};

	const subscribe = (event, cb) => {
		if (!isFn(cb)) throw new Error(`Expecting callback function`);
		_subsFor(event).add(cb);
		return () => _subsFor(event).delete(cb);
	};

	const subscribeOnce = (event, cb) => {
		const unsub = subscribe(event, (data) => {
			cb(data);
			unsub();
		});
		return unsub;
	};

	const unsubscribeAll = (event) => _subs.delete(event);

	return { publish, subscribe, subscribeOnce, unsubscribeAll };
};
