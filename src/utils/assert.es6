var assert_isAlias,
	assert_runAlias,
	assert_isJQuery,
	assert_runJQuery,
	assert_getFn,
	
	assert_test;

(function(){
	
	assert_isAlias = function (name) {
		return $.fn[name] != null;
	};
	assert_runAlias = function ($el, name, args, attr) {
		var mix = $el[name];
		var expect = args.pop();
		if (typeof mix === 'function') {
			var actual = mix.apply($el, args);
			assert.equal(actual, expect);
			return;
		}
		assert.equal(mix, expect);
	};
	
	assert_isJQuery = function(name){
		return assert.$[name + '_'] != null;
	};
	assert_runJQuery = function($el, name, args, attr) {
		assert.$[name + '_'].apply($el, [ $el ].concat(args));
	};
	
	assert_getFn = function(name) {
		return check(assert_isJQuery, assert_runJQuery)
			|| check(assert_isAlias, assert_runAlias);
		
		function check(check, fn) {
			__assert.total++;
			if (check(name)) 
				return fn;
		}
	};
	
	assert_test = function(ctx, name, args) {
		if (typeof assert[name] !== 'function') {
			ctx = ctx[name];
			name = 'equal';
		}
		
		assert[name].apply(assert, [ ctx ].concat(args));
	};
}());