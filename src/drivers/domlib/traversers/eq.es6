Driver.prototype.Traversers.define('eq', {
	traverse (ctx, selector, done) {
		var x = ctx.eq(selector);
		done(x);
	},
	canHandle (runner, driver, current) {
		var args = runner.getCurrentArgs_();
		return args.length === 1;
	}
});