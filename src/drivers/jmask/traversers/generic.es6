([
	'filter',
	'closest',
	'children'
]).forEach(name => {
	Driver.prototype.Traversers.define(name, {
		traverse (ctx, selector, done) {
			var set = ctx[name](selector);
			done(set);
		},
	});
});
