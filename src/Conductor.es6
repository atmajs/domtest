var Conductor = class_create(class_EventEmitter, class_Dfr, {

	defaultDriver: 'domlib',
	driver: null,
	runners: null,
	index: 0,
	constructor (driverName) {
		this.driver = Drivers.initialize(driverName || this.defaultDriver);
		this.runners = [];
	},
	process (container, mix, model, compo) {
		this.initRunners_(...arguments);

		// wait 5 Ticks and run, jQuery.simulate workarounds
		eventLoop_skip5(() => this.next());
		return this;
	},
	next (error) {
		if (error) {
			var errors = this.runners.reduce((aggr, x) => aggr.concat(x.errors), []);
			this.emit('complete', errors);
			this.reject(error);
			return;
		}
		if (this.index >= this.runners.length) {
			var errors = this.runners.reduce((aggr, x) => aggr.concat(x.errors), []);
			this.emit('complete', errors);
			this.resolve();
			return;
		}
		this
			.runners[this.index++]
			.process()
			.done(() => this.next())
			.fail((error) => this.next(error));
	},

	attachReporter (Reporter) {
		this.runners.forEach(x => x.attachReporter(Reporter));
		return this;
	},

	initRunners_ (container, mix, model, compo) {
		if (arguments.length === 0) {
			return;
		}

		var arr = mix;
		if (Array.isArray(mix) === false) {
			arr = [ mix ];
		}
		arr.map(suite => {
			return this.addRunner(container, mix, model, compo);
		});
	},
	addRunner (container, mix, model, compo) {
		var suite = mix;
		if (typeof suite === 'string') {
			suite = mask.parse(suite);
			if (suite.type !== mask.Dom.FRAGMENT) {
				suite = { nodes: [ suite ] };
			}
		}

		var runner = IRunner.create(this.driver, container, suite, model, compo);
		this.runners.push(runner);
		runner.on('progress', (...args) => this.emit('progress', ...args));
	}

});