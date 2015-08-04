Driver.prototype.Traversers.define('eq', {
	traverse (ctx, selector, done) {
		ctx
			.eq(selector)
			.done(done);
	},
	canHandle (runner, driver, current) {
		var args = runner.getCurrentArgs_();
		return args.length === 1;
	}
});