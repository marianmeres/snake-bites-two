export const isFn = (v) => typeof v === 'function';

export const assertTypeFn = (v, prefix = '') => {
	if (!Array.isArray(v)) v = [v];
	v.forEach((fn) => {
		if (!isFn(fn)) {
			throw new TypeError(`${prefix} Expecting function type`.trim());
		}
	});
};
