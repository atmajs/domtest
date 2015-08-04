(function(){
	Driver.prototype.Assertions.define('hasClass', (runner, driver, ctx, args, done) => {
		if (args.length === 1) {
			args.push(true);
		}
		runner
			.checkAsync(ctx, 'hasClass', ...args)
			.done(() => done())
			.fail(err => done(err))
			;
	});
}());