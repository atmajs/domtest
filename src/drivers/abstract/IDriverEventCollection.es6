var IDriverEventCollection = class_create(IActorCollection, {
	process (runner, driver, current, next) {

		var event = current.node.tagName,
			args = runner.getCurrentArgs_() || [],
			ctx = current.$;

		this
			.run(runner, driver, event, ctx, ...args)
			.done(() => next())
			.fail(next);
	},
	run (runner, driver, event, ctx, ...args) {
		return class_Dfr.run((resolve, reject) => {
			driver.beforeEvent && driver.beforeEvent(runner);
			var actor = this.actors[event];
			if (actor == null) {
				reject(`Event is not defined for the current driver: ${event}`);
				return;
			}

			var dfr = actor.call(this, ctx, ...args);
			if (dfr == null) {
				setTimeout(resolve);
				return;
			}
			dfr.always(() => setTimeout(resolve));
		});
	}
});