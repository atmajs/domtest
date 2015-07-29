(function(){
	Driver.prototype.Assertions.define('hasClass', (runner, driver, ctx, args, done) => {
		if (args.length === 1) {
			args.push(true);
		}
		var error = runner.check(ctx, 'hasClass', ...args);
		done(error);
	});
}());