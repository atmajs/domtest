var assert_getFn,
	assert_test;

(function(){

	assert_getFn = function(name) {
		if (_isJQuery(name)) {
			return _runJQuery;
		}
		if (_isAlias(name)) {
			return _runAlias;
		}
	};

	assert_test = function(ctx, name, args) {
		if (typeof assert[name] !== 'function') {
			ctx = ctx[name];
			name = 'equal';
		}

		assert[name].apply(assert, [ ctx ].concat(args));
	};


	function _isAlias(name) {
		return $.fn[name] != null;
	};
	function _runAlias($el, name, args) {
		if ($el.eq_ != null) {
			// use jQuery assertion extension
			args.unshift(name);
			$el.eq_.apply($el, args);
			return;
		}

		var mix = $el[name];
		var expect = args.pop();
		if (typeof mix === 'function') {
			var actual = mix.apply($el, args);
			assert.equal(actual, expect);
			return;
		}
		assert.equal(mix, expect);
	};

	function _isJQuery(name){
		return assert.$[name + '_'] != null;
	};
	function _runJQuery($el, name, args) {
		assert.$[name + '_'].apply($el, [ $el ].concat(args));
	};
}());