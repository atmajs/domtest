Driver.prototype.Traversers.define('find', {
	traverse (ctx, selector, done) {
		var x = ctx.find(selector);
		if (x.length === 0) {
			x = ctx.filter(selector);
		}
		if (x.length === 0) {
			x = traverser_findNative(ctx, selector);
		}
		done(x);
	},
	canHandle (runner, driver, current) {
		var args = runner.getCurrentArgs_();
		return args.length === 1;
	}
});