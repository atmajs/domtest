function Runner(container, node, model, compo) {
	
	if (container.nodeType === Node.DOCUMENT_FRAGMENT_NODE) 
		container = container.childNodes;
	
	this.model = model;
	this.compo = compo;
	this.stack = [{
		$: $(container),
		node: node
	}];
	
	this.process = this.process.bind(this);
	this.backtrace = new Error().stack;
}

Runner.prototype = {
	
	getCurrent () {
		return this.stack[this.stack.length - 1];
	},
	
	getNext (goDeep) {
		var current = this.getCurrent();
		if (current == null) 
			return null;
		
		if (goDeep !== false && current.node.nodes) {
			this.stack.push({
				$: current.$,
				node: current.node.nodes[0]
			});
			return this.getCurrent();
		}
		this.stack.pop();
		
		while (this.stack.length > 0) {
			var parent = this.getCurrent(),
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
			return this.getCurrent();
		}
		return null;
	},
	
	
	process: function assert_TestDom (error) {
		var current = this.getNext(error == null);
		if (current == null) {
			this.resolve();
			return;
		}
		
		var name = current.node.tagName;
		
		var traverser = Traverser[name];
		if (traverser) {
			var error = this.run(traverser, [current]);
			
			this.process(error);
			return;
		}
		
		var action = Actions[name];
		if (action) {
			this.run(action, [this, current, this.process]);
			return;
		}
		
		var args = node_evalMany(current.node, this.model, this.compo);
		var $el = current.$;
		
		var fn = assert_getFn(name);
		if (fn) {
			this.run(fn, [ $el, name, args, current.node.attr ]);
			this.process();
			return;
		}
		
		log_error('Uknown test function: ', name);
		this.process();
	},
	
	run (fn, args, ctx) {
		var error;
		try {
			fn.apply(ctx, args);
		} catch(err) {
			error = err;
		}
		this.report(error);
			
		var next = args[args.length - 1];
		if (error != null && typeof next === 'function') {
			next(error);
		}
	},
	
	report (error) {
		error = this.prepairError_(error);
		Reporter.report(error);
	},
	
	prepairError_ (error) {
		if (error == null) 
			return null;
		
		var node = this.getCurrent().node,
			tmpl = mask.stringify(node, 2),
			lines = tmpl.split('\n');
		if (lines.length > 7) {
			tmpl = lines.splice(0, 6).join('\n');
		}
		
		var msg = error.generatedMessage
			? tmpl
			: error.message + '\n' + tmpl;
			
		Object.defineProperty(error, 'message', {
			value: msg,
			writable: true,
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(error, 'stack', {
			value: assert.prepairStack(this.backtrace),
			writable: true,
			enumerable: true,
			configurable: true
		});
		
		error.generatedMessage = false;
		return error;
	},
	
	// Promise API
	resolved: null,
	rejected: null,
	
	_resolveCb: null,
	_rejectCb : null,
	_alwaysCb : null,
	
	resolve (...args) {
		this.resolved = args;
		dfr_call(this._resolveCb, args);
		dfr_call(this._alwaysCb);
		dfr_clear(this);
	},
	reject (...args) {
		this.rejected = args;
		dfr_call(this._rejectCb, args);
		dfr_call(this._alwaysCb);
		dfr_clear(this);
	},
	done (cb) {
		if (cb == null) 
			return this;
		if (this.resolved) {
			cb.apply(null, this.resolved);
			return this;
		}
		if (this.rejected == null) {
			dfr_bind(this, 'resolve', cb);
		}
		return this;
	},
	fail (cb) {
		if (cb == null) 
			return this;
		if (this.rejected) {
			cb.apply(null, this.rejected);
			return this;
		}
		if (this.resolved == null) {
			dfr_bind(this, 'reject', cb);
		}
		return this;
	},
	always (cb) {
		if (cb == null) 
			return this;
		if (this.rejected || this.resolved) {
			cb();
			return this;
		}
		dfr_bind(this, 'always', cb);
		return this;
	},
	then (ok, fail) {
		return this.done(ok).fail(fail);
	},

};