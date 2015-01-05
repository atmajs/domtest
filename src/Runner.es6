function Runner(container, node, model, compo) {
	
	if (container.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
		container = container.childNodes;
	}
	if (container.nodeType === Node.DOCUMENT_NODE) {
		container = container.body;
	}
	
	this.model = model;
	this.compo = compo;
	this.$ = $(container);
	this.stack = [{
		$: this.$,
		node: node
	}];
	
	this.errors = [];
	this.process = this.process.bind(this);
	this.next_ = this.next_.bind(this);
	
	this.backtrace = new Error().stack;
	if (this.$.length === 0) {
		this.report_(Error('No elements to test <root>'));
	}
}

Runner.prototype = {
	
	attachReporter (Reporter) {
		new Reporter(this);
		return this;
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
		var current = this.getCurrent_();
		return node_evalMany(
			current.node,
			this.getCurrentModel_(),
			this.getCurrentCompo_()
		);
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
	
	
	process: function assert_TestDom (error) {
		var current = this.getNext_(error == null);
		if (current == null) {
			this.emit('complete', this.errors);
			
			if (this.errors.length) {
				this.reject(this.errors);
			} else {
				this.resolve();
			}
			return;
		}
		
		var name = current.node.tagName;
		
		var traverser = Traverser[name];
		if (traverser) {
			var error = this.run_(traverser, [current]);
			this.next_(error);
			return;
		}
		
		if (Events.indexOf(name) !== -1) {
			this.run_(Simulate.$$run, [ name, this, current, this.next_ ]);
			return;
		}
		
		var action = Actions[name];
		if (action) {
			this.run_(action, [this, current, this.next_]);
			return;
		}
		
		var args = this.getCurrentArgs_();
		var ctx = current.$;
		
		if (is_JQuery(ctx)) {
			var fn = assert_getFn(name);
			if (fn) {
				var err = this.run_(fn, [ ctx, name, args, current.node.attr ]);
				this.next_(err);
				return;
			}
			
			log_error('Uknown test function: ', name);
			this.next_();
			return;
		} 
		
		var err = this.run_(assert_test, [ctx, name, args]);
		this.next_(err);
	},
	
	next_ (error) {
		this.emit('progress', this, this.getCurrent_().node, error);
		this.process(error);
	},
	
	run_ (fn, args, ctx) {
		var error;
		try {
			fn.apply(ctx, args);
		} catch(err) {
			error = err;
		}
		this.report_(error);
			
		var next = args[args.length - 1];
		if (error != null && typeof next === 'function') {
			next(error);
		}
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
	
	prepairError_ (error) {
		if (error == null) 
			return null;
		
		var node = this.getCurrent_().node,
			tmpl = mask.stringify(node, 2),
			lines = tmpl.split('\n');
		if (lines.length > 7) {
			tmpl = lines.splice(0, 6).join('\n');
		}
		
		Object.defineProperty(error, 'stack', {
			value: tmpl + '\n' + assert.prepairStack(this.backtrace),
			writable: true,
			enumerable: true,
			configurable: true
		});
		
		error.generatedMessage = false;
		return error;
	},
	
	ensureInDom_ () {
		this.ensureInDom_ = function(){};
		var parent = this.$.get(0).parentNode,
			inPage = false;
		while(parent != null) {
			if (parent.nodeType === Node.DOCUMENT_NODE) {
				inPage = true;
				break;
			}
			parent = parent.parentNode;
		}
		if (inPage) 
			return;
		
		this.$.appendTo('body');
		this.done(() => this.$.remove());
	},
	
	assert: null,
	wrapAssertion_ () {
		if (this.assert != null) 
			return this.assert;
		
		var wrap = (key) => 
			(...args) =>
				this.run_(key && assert[key] || assert, args)
		;
		
		this.assert = wrap();
		
		for (var key in assert) {
			if (typeof assert[key] === 'function') {
				this.assert[key] = wrap(key);
			}
		}
		return this.assert;
	}
};

obj_extend(Runner.prototype, EventEmitter.prototype);
obj_extend(Runner.prototype, Dfr.prototype);
