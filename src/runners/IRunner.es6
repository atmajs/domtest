var IRunner = class_create(class_EventEmitter, class_Dfr, {
	constructor: function Runner (driver, container, suite, model, compo) {
		this.errors = [];
		this.model = model;
		this.compo = compo;
		this.driver = driver;
		this.backtrace = new Error().stack;
		this.process = this.process.bind(this);
		this.next_ = this.next_.bind(this);
		this.wrapAssertion_();
	},
	stack: null,
	assert: null,
	process (error) {
		throw Error('Not implemented');
		return this;
	},

	attachReporter (Reporter) {
		new Reporter(this);
		return this;
	},

	next_: function assert_Next (error) {
		this.emit('progress', this, this.getCurrent_().node, error);
		this.process(error);
	},

	getCurrent_ () {
		return this.stack[this.stack.length - 1];
	},
	getCurrentModel_ () {
		var el = this.getCurrent_().$;
		if (el.model) {
			return el.model() || this.model;
		}
		return this.model;
	},
	getCurrentCompo_ () {
		var el = this.getCurrent_().$;
		if (el.compo) {
			return el.compo() || this.compo;
		}
		return this.compo;
	},
	getCurrentArgs_ () {
		var node = this.getCurrent_().node;
		var attrArgs = node_getAttrArgs(node);
		var exprArgs = node_evalMany(
			node,
			this.getCurrentModel_(),
			this.getCurrentCompo_()
		);
		return [...attrArgs, ...exprArgs];
	},

	getNext_ (goDeep) {
		var current = this.getCurrent_();
		if (current == null)
			return null;

		if (goDeep !== false && current.node.nodes) {
			this.stack.push({
				$: current.$,
				node: current.node.nodes[0]
			});
			return this.getCurrent_();
		}
		this.stack.pop();

		while (this.stack.length > 0) {
			var parent = this.getCurrent_(),
				nodes = parent.node.nodes,
				index = nodes.indexOf(current.node);

			if (index >= nodes.length - 1) {
				current = this.stack.pop();
				continue;
			}
			if (index === -1) {
				console.error('Node not found');
				current = this.stack.pop();
				continue;
			}

			this.stack.push({
				$: parent.$,
				node: nodes[index + 1]
			});
			return this.getCurrent_();
		}
		return null;
	},

	check (ctx, ...args) {
		var [name, ...arr] = args;
		if (typeof this.assert[name] !== 'function') {
			arr.unshift(name);
			name = 'equal';
		}

		if (arr.length < 2) {
			throw Error('Invalid arguments in assertion');
		}

		var actualKey = arr.shift(),
			expect = arr.pop(),
			actual = this.driver.getActual(ctx, actualKey, ...arr);

		return this.assert[name](actual, expect);
	},
	try_ (fn, ...args) {
		var error;
		try {
			fn.apply(null, args);
		} catch(err) {
			error = err;
		}
		return error;
	},
	call (fn, ...args) {
		var error = this.try_(fn, ...args);
		this.report_(error);
		return error;
	},

	run_ (fn, args, ctx) {
		var error;
		try {
			fn.apply(ctx, args);
		} catch(err) {
			error = err;
		}
		this.report_(error);
		return error;
	},

	report_ (error) {
		error = this.prepairError_(error);
		Reporter.report(error, this);

		this.emit(error ? 'fail' : 'success', error);
		if (error) {
			this.errors.push(error);
		}
	},
	wrapAssertion_ () {
		if (this.assert != null)
			return this.assert;

		var wrap = (key) => (...args) => {
			var fn = key && assert[key] || assert;
			return this.call(fn, ...args);
		};

		this.assert = wrap();

		for (var key in assert) {
			if (typeof assert[key] === 'function') {
				this.assert[key] = wrap(key);
			}
		}
		return this.assert;
	},

	prepairError_ (error) {
		if (error == null)
			return null;

		var node = this.getCurrent_().node,
			stack = mask.parser.getStackTrace && mask.parser.getStackTrace(node) || '';

		Object.defineProperty(error, 'stack', {
			value: stack + '\n' + assert.prepairStack(this.backtrace),
			writable: true,
			enumerable: true,
			configurable: true
		});

		error.generatedMessage = false;
		return error;
	},

	formatCurrentLine_ (error) {
		var node = this.getCurrent_().node,
			indent = '';

		var parent = node.parent;
		while (parent != null && parent.type !== mask.Dom.FRAGMENT) {
			indent += '  ';
			parent = parent.parent;
		}
		return indent + mask.stringify({
			tagName: node.tagName,
			attr: node.attr,
			expression: node.expression
		}, 2).slice(0, -1);
	},
});

IRunner.create = function (driver, container, suite, model, compo) {
	if (typeof suite === 'function') {
		return RunnerFn(driver, container, suite, model, compo);
	}
	return new RunnerNodes(driver, container, suite, model, compo);
};