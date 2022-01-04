import { createConsoleLogger } from './create-console-logger.js';
import { $each, $on, $once, qs, qsa } from './dom.js';
import { isFn } from './is-fn.js';
import { createStore, isStoreLike } from './create-store.js';
import { isPlainObject } from './is-plain-object.js';

const clog = createConsoleLogger('create-component-factory');

// "backbone.js view like" modern vanilla js wannabe proof-of-concept

export const createComponentFactory = (config: any = {}) => {
	let $el;
	const _onDestroy = [];

	const cmp = {
		...(config || {}),

		_el: config.el,

		tagName: config.tagName || 'div',

		className: config.className,

		props: {},

		stores: {},

		get $el() {
			if (!$el) {
				$el = qs(this._el) || document.createElement(this.tagName);
				if (this.className) {
					$el.classList.add(...this.className.split(' '));
				}
			}
			return $el;
		},

		init: isFn(config.init) ? config.init : () => void 0,

		render: isFn(config.render) ? config.render : () => void 0,

		// todo... mutationobserver?...
		destroy() {
			_onDestroy.forEach((cb) => cb());
		},

		onDestroy(cb) {
			isFn(cb) && _onDestroy.push(cb);
		},

		// sugar below

		subscribe(store, cb = null, getImmediate = false) {
			if (!isStoreLike(store)) {
				throw new TypeError(`Expecting store instance as first argument`);
			}
			// by default subscribe with render fn
			const unsub = store.subscribe(cb || this.render.bind(this), getImmediate);
			this.onDestroy(unsub);
			return unsub;
		},

		$on(selector, type, handler) {
			return $on(this.$el, selector, type, handler);
		},

		$once(selector, type, handler) {
			return $once(this.$el, selector, type, handler);
		},

		showOrHide(showFlag) {
			this.$el.hidden = !showFlag;
		},

		show() {
			this.showOrHide(true);
		},

		hide() {
			this.showOrHide(false);
		},

		toggle() {
			this.$el.hidden = !this.$el.hidden;
		},

		qs(selector) {
			return qs(selector, this.$el);
		},

		qsa(selector) {
			return qsa(selector, this.$el);
		},

		$each(selector, cb) {
			return $each(this.qsa(selector), cb);
		},

		html(html) {
			if (html === void 0) {
				return this.$el.innerHTML;
			} else {
				this.$el.innerHTML = html;
				return this;
			}
		},
	};

	//
	return (props = {}, { el } = {} as any) => {
		cmp._el = el;
		const _isStore = isStoreLike(props);

		if (!_isStore && !isPlainObject(props)) {
			throw new TypeError(
				`Expecting props either as a store instance or as a plain object`
			);
		}

		cmp.props = _isStore ? props : createStore(props);

		cmp.onDestroy(cmp.props.subscribe(() => cmp.render()));

		cmp.init();

		return cmp;
	};
};
