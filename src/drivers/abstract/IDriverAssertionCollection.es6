var IDriverAssertionCollection = class_create(IActorCollection, {
	process (runner, driver, current, next) {
		var name = current.node.tagName,
			ctx  = current.$,
			args = runner.getCurrentArgs_();

		var actor = this.actors[name];
		if (actor) {
			actor(runner, driver, ctx, args, next);
			return;
		}

		this.assert(runner, driver, ctx, name, args, next);
	},

	canHandle (runner, driver, current) {
		return driver.isOwnCtx(current.$);
	},

	assert (runner, driver, ctx, name, args, next) {
		throw Error('Not implemented');
	},

	canHandleBase (runner, driver, current) {
		var name = current.node.tagName,
			ctx = current.$;


		if (typeof runner.assert[name] !== 'function') {
			return ctx[name] !== void 0;
		}
		var [key] = runner.getCurrentArgs_();
		return ctx[key] !== void 0;
	},
	processBase (runner, driver, current, done) {
		var name = current.node.tagName,
			ctx = current.$,
			args = runner.getCurrentArgs_();

		var error = runner.check(ctx, name, ...args);
		done(error);
	}
});