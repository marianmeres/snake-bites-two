import template from "../../node_modules/lodash-es/template.js";
import { createComponentFactory } from "../../dist/utils/create-component-factory.js";
import { gameLoopState, sound, speed } from "../stores.js";
import { EJS } from "../ejs.js";

export const cmpScores = createComponentFactory({
	_tpl: null,
	speedMap: { easy: 2, cool: 5, crazy: 10, insane: 20 },
	init() {
		this.subscribe(speed);
		this.subscribe(gameLoopState);
		this.subscribe(sound);
		this.$on('button.easy', 'click', () => speed.set(this.speedMap.easy));
		this.$on('button.cool', 'click', () => speed.set(this.speedMap.cool));
		this.$on('button.crazy', 'click', () => speed.set(this.speedMap.crazy));
		this.$on('button.insane', 'click', () => speed.set(this.speedMap.insane));
		this.$on('button.sound', 'click', () => sound.set(!sound.get()));
		this.render();
	},
	render() {
		const { isRunning } = gameLoopState.get();
		const s = speed.get();
		const soundIcon = sound.get() ? EJS.icon_sound_on() : EJS.icon_sound_off();
		this.$el.innerHTML = this.tpl({ ...this.props.get(), soundIcon });
		this.$each('.speed button', (b) => {
			b.disabled = isRunning;
			b.classList.remove('active');
			Object.keys(this.speedMap).forEach((k) => {
				if (b.classList.contains(k) && this.speedMap[k] === s) {
					b.classList.add('active');
				}
			});
		});
	},
	get tpl() {
		if (!this._tpl) {
			this._tpl = template(`
				<div class="score">Player1: <b><%= data.score1 || 0 %></b></div>
				<div class="spacer"></div>
				<div class="speed">
					<button class="easy" title="Sets snake speed">Easy</button>
					<button class="cool" title="Sets snake speed">Cool</button>
					<button class="crazy" title="Set snake speed">Crazy</button>
					<button class="insane" title="Set snake speed">Insane</button>
				</div>
				<div class="spacer sound">
					<button class="sound" title="Toggle sound"><%= data.soundIcon %></button>
				</div>
				<div class="score">Player2: <b><%= data.score2 || 0 %></b></div>
			`, { variable: 'data' })
		}
		return this._tpl;
	}
})
