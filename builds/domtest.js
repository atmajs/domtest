(function(root, factory){
	var _global = typeof global !== 'undefined' ? global : window,
		_mask = _global.mask || (_global.atma && _global.atma.mask),
		_$ = _global.jQuery || _global.$,
		_assert = _global.assert;

	function construct () {
		var err;
		if (_mask == null) err = 'MaskJS';
		if (_$ == null) err = 'jQuery';
			
		if (err) 
			throw Error(err + ' was not loaded');
		
		
		var fn = factory(_global, _mask, _$, _assert);
		
		if (typeof module !== 'undefined' && module.exports) {
			module.exports = fn;
			return;
		}
		
		if (typeof define !== 'undefined' && define.amd) {
			define(function () { return fn });
			return;
		}
		
		global.DomTest = fn;
	}
	
	construct();
	
}(this, function(global, mask, $, __assert){
	'use strict';
	
	// import /bower_components/assertion/lib/assert.embed.js
	// import /src/exports.es6
	
	return assert_TestDom;
}));


(function($){
	if ($.simulate && $.simulate.prototype.simulateKeyCombo) {
		return;
	}
	// import /bower_components/jquery-simulate-ext/libs/bililiteRange.js
	// import /bower_components/jquery-simulate-ext/libs/jquery.simulate.js
	// import /bower_components/jquery-simulate-ext/src/jquery.simulate.ext.js
	// import /bower_components/jquery-simulate-ext/src/jquery.simulate.drag-n-drop.js
	// import /bower_components/jquery-simulate-ext/src/jquery.simulate.key-combo.js
	// import /bower_components/jquery-simulate-ext/src/jquery.simulate.key-sequence.js
	
}(jQuery));