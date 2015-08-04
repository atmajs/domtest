Driver.prototype.Traversers.define('find', {
	traverse (ctx, selector, done) {
		ctx
			.find(selector)
			.done($ => {

				if ($.length === 0) {
					ctx
						.filter(selector)
						.done(done)
					return;
				}
				done($);
			});
	},
	canHandle (runner, driver, current) {
		var args = runner.getCurrentArgs_();
		return args.length === 1;
	}
});