var IDriverTraverserCollection = class_create(IActorCollection, {

	isEmpty (x) {
		if (x == null) {
			return true;
		}
		if (typeof x.length === 'number') {
			return x.length === 0;
		}
		return false;
	},
	process (runner, driver, current, next) {
		var selector = this.getSelector(current),
			name = current.node.tagName,
			ctx = current.$;

		this
			.run(runner, driver, name, ctx, selector)
			.done(() => next())
			.fail(next);
	},
	getSelector (current) {
		var selector = current.node.expression;
		if (/^\s*('|")/.test(selector)) {
			selector = node_eval(current.node);
		}
		return selector;
	},
	run (runner, driver, fnName, ctx, selector) {
		return class_Dfr.run((resolve, reject) => {
			var actor = this.actors[fnName];
			if (actor == null) {
				reject(`Traverser is not found in current driver: ${fnName}`);
				return;
			}
			actor.traverse(ctx, selector, x => {
				var error = runner.assert.notEqual(
					this.isEmpty(x)
					, true
					, `Selector does not matched any elements: ${fnName}('${selector}')`
				);
				if (error) {
					reject(error);
					return;
				}
				runner.getCurrent_().$ = x;
				resolve();
			});
		});
	}
})