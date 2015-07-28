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

var DomTest;

(function(root, factory){
	var _global = typeof global !== 'undefined' ? global : window,
		_mask = _global.mask || (_global.atma && _global.atma.mask) || mask,
		_$ = _global.jQuery || _global.$,
		_assert = _global.assert;

	if (_assert == null && typeof assert !== 'undefined')
		_assert = assert;


	DomTest = factory(_global, _mask, _$, _assert);

}(this, function(global, mask, $, __assert){
	'use strict';

	/* needs own assertion library */
	// import /bower_components/assertion/lib/assert.embed.js

	// import /src/library.es6

	return assert_TestDom;
}));

/* jQuery simulate failes in 'strict' mode */
// import /src/jquery_simulate.js