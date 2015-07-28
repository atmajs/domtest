var IActorCollection = class_create({

	constructor () {
		this.actors = {};
	},
	canHandle (runner, driver, current) {
		var name = current.node.tagName;
		var x = this.actors[name];
		if (x == null) {
			return false;
		}
		if (typeof x.canHandle === 'function') {
			return x.canHandle(runner, driver, current)
		}
		return true;
	},
	process (runner, driver, current, next) {
		var name = current.node.tagName;
		var x = this.actors[name];
		if (typeof x === 'function') {
			x(...arguments);
			return;
		}
		x.process(...arguments);
	},
	define (name, mix) {
		if (mix == null) {
			return this;
		}
		this.actors[name] = mix;
		return this;
	}
})