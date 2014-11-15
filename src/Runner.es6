function Runner(container, node, model, compo) {
	
	if (container.nodeType === Node.DOCUMENT_FRAGMENT_NODE) 
		container = container.childNodes;
	
	this.model = model;
	this.compo = compo;
	this.$ = $(container);
	this.stack = [{
		$: this.$,
		node: node
	}];
	
	if (this.$.length === 0) {
		__assert(false, 'No elements to test <root>');
	}
	
	this.process = this.process.bind(this);
	this.backtrace = new Error().stack;
}

Runner.prototype = obj_extend({
	
	getCurrent_ () {
		return this.stack[this.stack.length - 1];
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
			this.resolve();
			return;
		}
		
		var name = current.node.tagName;
		
		var traverser = Traverser[name];
		if (traverser) {
			var error = this.run_(traverser, [current]);
			
			this.process(error);
			return;
		}
		
		var action = Actions[name];
		if (action) {
			this.run_(action, [this, current, this.process]);
			return;
		}
		
		var args = node_evalMany(current.node, this.model, this.compo);
		var $el = current.$;
		
		var fn = assert_getFn(name);
		if (fn) {
			this.run_(fn, [ $el, name, args, current.node.attr ]);
			this.process();
			return;
		}
		
		log_error('Uknown test function: ', name);
		this.process();
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
	},
	
	report_ (error) {
		error = this.prepairError_(error);
		Reporter.report(error);
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
	}
}, Dfr.prototype);