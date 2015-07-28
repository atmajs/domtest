var IDriverActionCollection = class_create(IActorCollection, {
	constructor () {
		this.define('with', (runner, driver, current, next) => {
			var selector = driver.Traversers.getSelector(current);
			switch (selector) {
				case 'model':
					current.$ = runner.getCurrentModel_();
					next();
					return;
			}

			current.node.tagName = 'find';
			driver
				.Traversers
				.process(runner, driver, current, next);
		});

		this.define('debugger', (runner, driver, current, done) => {
			var ctx = current.$;
			debugger;
			done();
		});

		this.define('function', (runner, driver, current, done) => {
			var fn = current.node.fn,
				ctx = current.$,
				assert = runner.wrapAssertion_();
			if (fn.length === 3) {
				fn(ctx, assert, done);
				return;
			}
			fn(ctx, assert);
			done();
		});
		this.define('do', (runner, driver, current, done) => {
			var [event, ...args] = runner.getCurrentArgs_();
			driver
				.Events
				.run(runner, driver, event, current.$, ...args)
				.always(() => done());
		});

		this.define('trigger', (runner, driver, current, done) => {
			var [event, ...args] = runner.getCurrentArgs_();
			driver
				.Events
				.run(runner, driver, event, current.$, ...args)
				.always(() => done());
		});

		this.define('define', (owner, runner, current, done) => {
			var name = current.node.tagName,
				nodes = current.node.nodes;

			current.node.nodes = null;
			this.define(name, (owner, runner, current, done) => {
				current.node.nodes = nodes;
				done();
			});
			done();
		});

		this.define('call', (runner, driver, current, done) => {
			var name = node_resolveFirstAttrKey(current.node),
				args = runner.getCurrentArgs_(),
				ctx = current.$,
				fn = ctx[name];

			if (typeof fn !== 'function') {
				done(`${name} is not a function`);
				return;
			}
			var error = runner.try_(fn.bind(ctx), ...args);
			if (error) {
				done(error);
				return;
			}
			setTimeout(done);
		});

		this.define('await', (runner, driver, current, done) => {
			var expression = current.node.expression;
			if (expression == null) {
				done('`await` node expect expression: timeout ms or a selector');
				return;
			}
			var mix = mask.Utils.Expression.eval(expression);
			if (typeof mix === 'number') {
				setTimeout(done, mix);
				return;
			}

			var selector = driver.Traversers.getSelector(current);
			var INTERVAL = 100;
			var MAX = 1600;
			var i = 0;
			var ctx = current.$;
			function check() {
				driver
					.Traversers
					.actors
					.find
					.traverse(ctx, selector, x => {
						if (driver.Traversers.isEmpty(x)) {
							if (i < MAX) {
								i += INTERVAL;
								setTimeout(check, INTERVAL);
								return;
							}

							done(`<await> Elements are not resolved: ${selector}`);
							return;
						}
						driver
							.Traversers
							.run(runner, driver, 'find', ctx, selector)
							.done(() => done());
					});
			}
			check();
		})
	}
})