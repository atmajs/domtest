(function(){
	Driver.prototype.Assertions.define('hasClass', (runner, driver, ctx, args, done) => {
		if (args.length === 1) {
			args.push(true);
		}

		var [name] = args;
		ctx
			.hasClass(...args)
			.done(x => {
				var error = runner.assert(x, true, `Should have '${name}' class`);
				done(error);
			})

	});
}());