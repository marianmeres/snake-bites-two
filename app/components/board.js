import { createComponentFactory } from "../../dist/utils/create-component-factory.js";

export const cmpBoard = createComponentFactory({
	_previousHTML: void 0,
	init() {
		this.render()
	},
	render() {
		// since our game update clock ticks intentionally much slower (~4Hz)
		// than render clock (~60Hz) we can save unnecessary updates...
		const _currentHTML = this.props.get();
		if (this._previousHTML !== _currentHTML) {
			this.$el.innerHTML = _currentHTML;
			this._previousHTML = _currentHTML;
		}
	}
});
