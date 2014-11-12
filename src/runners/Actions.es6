var Actions = {
	'with' (compo, current, done) {
		Traverser.find(current);
		done();
	},
	'debugger' (compo, current, done) {
		var $element = current.$;
		debugger;
		done();
	},
	'slot' (compo, current, done) {
		var fn = current.node.fn;
		if (fn.length === 2) {
			fn(current.$, done);
			return;
		}
		fn(current.$);
		done();
	},
	'do' (compo, current, done) {
		var event;
		for(event in current.node.attr) break;
		
		var fn = Simulate[event];
		if (fn) {
			fn(compo, current, done);
			return;
		}
		
		current.$.simulate(event, current.node.attr);
		setTimeout(done);
	},
	
	'call' (runner, current, done) {
		var name;
		for(name in current.node.attr) break;
		
		assert.is(current.$[name], 'Function');
		
		var args = node_evalMany(current.node, runner.model, runner.compo);
		current.$[name].apply(current.$, args);
		setTimeout(done);
	},
	
	'await' (compo, current, done) {
		var expression = current.node.expression;
		var num = parseFloat(expression);
		if (num === num) {
			setTimeout(done, num);
			return;
		}
		
		var selector = expression;
		var INTERVAL = 200;
		var MAX = 1600;
		var i = 0;
		function check() {
			var el = current.$.find(selector);
			if (el.length === 0) {
				el = current.$.filter(selector);
			}
			if (i < MAX && el.length === 0) {
				i += INTERVAL;
				setTimeout(check, INTERVAL);
				return;
			}
			if (i > MAX) {
				assert(false, `<await> Elements are not resolved: ${selector}`);
			}
			Traverser.find(current);
			done();
		}
		
		check();
	}
};