var Simulate;
(function(){
	Simulate = {
		$$run (event, runner, current, done) {
			runner.ensureInDom_();
			
			var fn = Simulate[event];
			if (fn) {
				fn(runner, current, done);
				return;
			}
			
			current.$.simulate(event, current.node.attr);
			setTimeout(done);
		},
		
		'press' (runner, current, done) {
			var str = node_eval(current.node);
			
			current.$.simulate('key-combo', {
				combo: str
			});
			setTimeout(done);
		},
		'type' (runner, current, done) {
			var str = node_eval(current.node);
			
			current.$.simulate('key-sequence', {
				sequence: str,
				delay: 10,
				callback: function(){
					current
						.$
						.removeData('simulate-keySequence.selection')
						.off('keyup.simulate-keySequence')
						.off('mouseup.simulate-keySequence')
						;
					done();
				}
			});
		},
		
		'select' (runner, current, done) {
			var el = current.$.filter('select').eq(0);
			if (el.length !== 0) {
				var str = node_eval(current.node);
				select_Option(el, str, done);
				setTimeout(done);
				return;
			}
			
			var el = current.$.filter('input, textarea').eq(0);
			if (el.length !== 0) {
				var args = node_evalMany(current.node);
				el.get(0).focus();
				select_TextRange(el.get(0), args);
				setTimeout(done);
				return;
			}
			
			
			assert(false, '`Select` should be invoked in "input" or "select" context');
		}
	};	

	function select_Option (el, str) {
		var opts,
			opt = find(byText);
		if (opt == null)  opt = find(byAttr('value'));
		if (opt == null)  opt = find(byAttr('name'));
		if (opt == null)  opt = find(byAttr('id'));
		
		assert.notEqual(opt, null, 'Option not found: ' + str);
		
		var [ $opt, index ] =  opt;
		
		el.get(0).selectedIndex = index;
		$opt.simulate('click');
		el.trigger('change');
		
		function byText ($el, i) {
			var txt = $el.text();
			return txt.trim().indexOf(str) !== -1;
		}
		function byAttr (name) {
			return function($el){
				return $el.attr(name).trim() === str;
			};
		}
		function find(fn) {
			if (opts == null) 
				opts = el.children('option');
			
			var imax = opts.length,
				i = 0, x;
			for(; i < imax; i++) {
				x = opts.eq(i);
				if (fn(x, i) === true) 
					return [x, i];
			}
			return null;
		}
	}
	function select_TextRange(el, args) {
		var txt = el.value;
		
		if (args.length === 0) {
			select(0, txt.length - 1);
			return;
		}
		
		var [ str ] = args;
		if (typeof str === 'string') {
			var start = txt.indexOf(str)
			if (start !== -1) {
				select(start, start + str.length);
			}
			return;
		}
		
		var [ start, end ] = args;
		if (typeof start === 'number' && typeof end === 'number') {
			select(start, end);
		}
		
		function select(start, end) {
			if (el.selectionStart !== void 0) {
				el.selectionStart = start;
				el.selectionEnd = end;
				return;
			}
			if (el.setSelectionRange !== void 0) {
				el.setSelectionRange(start, end);
				return;
			}
			console.error('<DomTest> Unable to selec the range');
		}
	}
}());
