function assert_TestDom (container, utest, callback) {
	if (typeof utest === 'string') {
		utest = mask.parse(utest);
		if (utest.type !== mask.Dom.FRAGMENT) 
			utest = { nodes: [ utest ] };
	}
	
	var runner = new Runner(container, utest);
	runner.process();
	runner.always(callback);
	
	return runner;
}

assert_TestDom.create = assert_TestDom;

// import ./utils/object.js
// import ./utils/log.es6
// import ./utils/dfr.es6
// import ./utils/node.es6
// import ./utils/assert.es6


// import ./runners/Traverser.es6
// import ./runners/Simulate.es6
// import ./runners/Actions.es6

// import ./options.es6
// import ./Reporter.es6
// import ./Runner.es6