([
	'filter',
	'closest',
	'children',
	'siblings'
]).forEach(name => {
	Driver.prototype.Traversers.define(name, {
		traverse (ctx, selector, done) {
			ctx[name](selector).done(done);
		},
	});
});
