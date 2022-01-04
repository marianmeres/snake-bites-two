export const qs = (selector, scope = null) => {
    if (selector instanceof HTMLElement) {
        return selector;
    }
    return (scope || document).querySelector(selector);
};
export const qsa = (selector, scope = null) => (scope || document).querySelectorAll(selector);
export const $each = (nodelist, cb) => {
    for (const [index, $el] of nodelist.entries()) {
        cb($el, index);
    }
};
// "normal":
// 		target, type, callback
// 		target, type, callback, options
// "delegated":
// 		target, selector, type, handler
// 		target, selector, type, handler, options
export const $on = (...args) => {
    const isFn = (v) => typeof v === 'function';
    let target, selector, type, callback, options;
    // target, selector, type, handler, options
    if (args.length >= 5) {
        [target, selector, type, callback, options] = args;
    }
    // target, selector, type, callback,
    else if (args.length === 4 && isFn(args[3])) {
        [target, selector, type, callback] = args;
    }
    // target, type, callback, options
    // target, type, callback
    else {
        [target, type, callback, options] = args;
    }
    // sanity check
    if (!isFn(callback)) {
        console.warn('Expecting function callback argument');
        return () => void 0;
    }
    if (typeof target === 'string')
        target = qs(target);
    // no-op
    if (!target)
        return () => void 0;
    options = options || {};
    // normalizing callback args of the two different strategies below to this:
    // callback(event, $element)
    // "normal"
    if (!selector) {
        // The currentTarget read-only property of the Event interface identifies the current
        // target for the event, as the event traverses the DOM. It always refers to the
        // element to which the event handler has been attached, as opposed to Event.target,
        // which identifies the element on which the event occurred and which may be its descendant.
        const dispatchEvent = (event) => callback(event, event.currentTarget);
        target.addEventListener(type, dispatchEvent, options);
        return () => target.removeEventListener(type, dispatchEvent, options);
    }
    // "delegated"
    else {
        const dispatchEvent = (event) => {
            // direct child
            let element = event.target;
            if (element.matches(selector)) {
                return callback.call(element, event, element);
            }
            // keep looking within ancestors up to the root...
            element = event.target.closest(selector);
            // if found, still check if we've not gone too far (outside of the parent context)
            if (element && target.contains(element)) {
                return callback.call(element, event, element);
            }
        };
        target.addEventListener(type, dispatchEvent, options);
        return () => target.removeEventListener(type, dispatchEvent, options);
    }
};
// target, type, callback
// target, selector, type, handler
// positivelly expecting correct args number
export const $once = (...args) => $on(...args, { once: true });
export const escapeForHTML = (s) => s.replace(/[&<]/g, (c) => (c === '&' ? '&amp;' : '&lt;'));
