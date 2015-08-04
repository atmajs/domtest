var IDriver = class_create({

	Traversers: new IDriverTraverserCollection,
	Events: new IDriverEventCollection,
	Actions: new IDriverActionCollection,
	Assertions: new IDriverAssertionCollection,

	options: null,

	constructor (options = {}) {
		this.options = options;
	},

	process (runner, current, next) {

		var fns = ['Traversers', 'Events', 'Actions', 'Assertions'],
			imax = fns.length,
			i = -1;
		while( ++i < imax ) {
			var collection = this[fns[i]];
			if (collection.canHandle(runner, this, current)) {
				collection.process(runner, this, current, next);
				return;
			}
		}
		if (this.Assertions.canHandleBase(runner, this, current)) {
			this.Assertions.processBase(runner, this, current, next);
			return;
		}
		next('Uknown strategy: ' + current.node.tagName);
	},

	createRoot (root) {
		return new class_Dfr().reject('Not implemented');
	},

	getActual (ctx, key, ...args) {
		var actual = ctx[key];
		if (typeof actual === 'function') {
			return actual.apply(ctx, args);
		}
		return actual;
	},
	getActualAsync (ctx, key, ...args) {
		var actual = ctx[key];
		if (typeof actual === 'function') {
			return actual.apply(ctx, args);
		}
		return ctx.then($ => $[key]);
	}
});
