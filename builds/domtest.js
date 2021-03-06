/*!
 * DomTest v%IMPORT(version)%
 * Part of the Atma.js Project
 * http://atmajs.com/
 *
 * MIT license
 * http://opensource.org/licenses/MIT
 *
 * (c) 2012, %IMPORT(year)% Atma.js and other contributors
 */
(function(root, factory){

	var _global = typeof global !== 'undefined' ? global : window,
		_mask = _global.mask || (_global.atma && _global.atma.mask),
		_$ = _global.jQuery || _global.$,
		_assert = _global.assert || {};

	function construct () {
		var err;
		if (_mask == null) err = 'MaskJS';
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

		_global.DomTest = fn;
	}

	construct();

}(this, function(global, mask, $, __assert){
	'use strict';

	// import /bower_components/assertion/lib/assert.embed.js
	// import /src/library.es6

	return assert_TestDom;
}));

// import /src/jquery_simulate.js