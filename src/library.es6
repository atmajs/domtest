// import /ref-utils/lib/utils.embed.js

function assert_TestDom (container, mix, model, compo) {
	return new Conductor().process(...arguments);
}

// import ./utils/is.js
// import ./utils/object.js
// import ./utils/log.es6
// import ./utils/dfr.es6
// import ./utils/node.es6
// import ./utils/eventLoop.es6


// import ./options.es6
// import ./Reporter.es6

// import ./Conductor.es6
// import ./runners/exports.es6
// import ./drivers/exports.es6

// import ./compo.es6

obj_extend(assert_TestDom, {
	create : assert_TestDom,
	compo  : compo_domtest,
	ProgressReporters : {
		Dom: ProgressReporter_DOM
	},
	Drivers: Drivers,
	Conductor: Conductor,
	use (driverName, options = null) {
		return new Conductor(driverName, options);
	}
});
