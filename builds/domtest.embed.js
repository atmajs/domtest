var DomTest;

(function(root, factory){
	var _global = typeof global !== 'undefined' ? global : window,
		_mask = _global.mask || (_global.atma && _global.atma.mask),
		_$ = _global.jQuery || _global.$,
		_assert = _global.assert;
		
	if (_assert == null && typeof assert !== 'undefined') 
		_assert = assert;
	

	DomTest = factory(_global, _mask, _$, _assert);
	
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
