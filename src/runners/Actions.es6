var Actions;
(function(){
	Actions = {
		'with' (runner, current, done) {
			var selector = current.node.expression.trim();
			switch (selector) {
				case 'model':
					current.$ = runner.getCurrentModel_();
					done();
					return;
			}
			
			Traverser.find(current);
			done();
		},
		'debugger' (runner, current, done) {
			var ctx = current.$;
			debugger;
			done();
		},
		'slot' (runner, current, done) {
			var fn = current.node.fn;
			if (fn.length === 3) {
				fn(current.$, runner.wrapAssertion_(), done);
				return;
			}
			fn(current.$, runner.wrapAssertion_());
			done();
		},
		'do' (runner, current, done) {
			Simulate.$$run(
				resolveAttrFirst(current.node)
				, runner
				, current
				, done
			);
		},
		
		'trigger' (runner, current, done) {
			var args = node_evalMany(current.node, runner.model, runner.compo);
			current.$.trigger.apply(current.$, args);
			setTimeout(done, 16);
		},
		
		'call' (runner, current, done) {
			var name = resolveAttrFirst(current.node);
			
			assert.is(current.$[name], 'Function');
			
			var args = node_evalMany(current.node, runner.model, runner.compo);
			current.$[name].apply(current.$, args);
			setTimeout(done);
		},
		
		'await' (runner, current, done) {
			var expression = current.node.expression;
			if (expression == null) {
				throw Error('`await` node expect expression: timeout ms or a selector');
			}
			var mix = mask.Utils.Expression.eval(expression);
			if (typeof mix === 'number') {
				setTimeout(done, mix);
				return;
			}
			
			var selector = mix;
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
		},
		
		'selection' (runner, current, done) {
			var expression = current.node.expression;
			if (expression == null) {
				throw Error('`caret` node expect expression: position number');
			}
			var pos =  mask.Utils.Expression.evalStatements(expression);
			var start = pos[0],
				end = pos[1] || start;
				
			setSelectionRange(current.$.get(0), start, end);
			setTimeout(done, 16);
		}
	};
	
	function resolveAttrFirst(node) {
		var x;
		for(x in node.attr) break;
		
		delete node.attr[x];
		return x;
	}
	
	function setSelectionRange(input, selectionStart, selectionEnd) {
		if (input.setSelectionRange) {
			input.focus();
			input.setSelectionRange(selectionStart, selectionEnd);
		}
		else if (input.createTextRange) {
			var range = input.createTextRange();
			range.collapse(true);
			range.moveEnd('character', selectionEnd);
			range.moveStart('character', selectionStart);
			range.select();
		}
	}
		
	function setCaretToPos (input, pos) {
		setSelectionRange(input, pos, pos);
	}

}());
