// import /ref-utils/lib/utils.embed.js

function assert_TestDom (container, mix, ...args) {
	var dfr = new mask.class.Deferred;
	var arr = mix;
	if (Array.isArray(mix) === false) {
		arr = [ mix ];
	}

	arr = arr.map(function(x){
		if (typeof x !== 'string') {
			return x;
		}
		var ast = mask.parse(x);
		if (ast.type !== mask.Dom.FRAGMENT) {
			ast = { nodes: [ ast ] };
		}
		return ast;
	});

	var model, compo, callback,
		i = 0, imax = args.length, x;
	for(; i < imax; i++) {
		x = args[i];
		if (typeof x === 'function') {
			callback = x;
			continue;
		}
		if (model != null) {
			compo = x;
			continue;
		}
		model = x;
	}

	function next (error) {
		if (error) {
			dfr.reject(error);
			return;
		}
		if (arr.length === 0) {
			dfr.resolve();
			return;
		}
		var suite = arr.shift();
		if (typeof suite === 'function') {
			if (suite.length) {
				suite(next);
				return;
			}
			try {
				suite();
			}
			catch (error) {
				next(error);
				return;
			}
			next();
			return;
		}
		var runner = new Runner(container, suite, model, compo);
		runner
			.process();
		runner
			.done(() => next())
			.fail(next);
	}
	if (callback != null) {
		dfr
			.done(() => callback())
			.fail(callback);
	}

	// wait 5 Ticks and run, jQuery.simulate workarounds
	eventLoop_skip5(next);
	return dfr;
}

// import ./utils/is.js
// import ./utils/object.js
// import ./utils/log.es6
// import ./utils/dfr.es6
// import ./utils/node.es6
// import ./utils/assert.es6
// import ./utils/eventLoop.es6

// import ./runners/Traverser.es6
// import ./runners/Simulate.es6
// import ./runners/Actions.es6
// import ./runners/jQueryActions.es6
// import ./runners/Events.es6

// import ./options.es6
// import ./Reporter.es6
// import ./Runner.es6
// import ./compo.es6

assert_TestDom.create = assert_TestDom;
assert_TestDom.compo  = compo_domtest;
assert_TestDom.ProgressReporters = {
	Dom: ProgressReporter_DOM
};
