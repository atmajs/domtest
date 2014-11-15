var Simulate = {
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
			sequence: str
		});
		setTimeout(done);
	},
	
	'select' (runner, current, done) {
		var str = node_eval(current.node),
			el = current.$.filter('select').eq(0),
			opts = null,
			opt  = null;
			
		assert.notEqual(el.length, 0, 'Should call on "select" tag');
		
		opt = find(byText);
		if (opt == null)  opt = find(byAttr('value'));
		if (opt == null)  opt = find(byAttr('name'));
		if (opt == null)  opt = find(byAttr('id'));
		
		assert.notEqual(opt, null, 'Option not found: ' + str);
		
		var [ $opt, index ] =  opt;
		
		el.get(0).selectedIndex = index;
		$opt.simulate('click');
		el.trigger('change');
		
		setTimeout(done);
		
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
};