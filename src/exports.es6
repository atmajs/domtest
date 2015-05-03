// import /ref-utils/lib/utils.embed.js

function assert_TestDom (container, utest, ...args) {
	if (typeof utest === 'string') {
		utest = mask.parse(utest);
		if (utest.type !== mask.Dom.FRAGMENT) 
			utest = { nodes: [ utest ] };
	}
	
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
	
	var runner = new Runner(container, utest, model, compo);
	
	runner.on('complete', callback);
	
	// wait 5 Ticks and run, jQuery.simulate workarounds
	eventLoop_skip5(runner.process);
	return runner;
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
