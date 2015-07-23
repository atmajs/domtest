// source /src/license.txt
/*!
 * DomTest v0.10.24
 * Part of the Atma.js Project
 * http://atmajs.com/
 *
 * MIT license
 * http://opensource.org/licenses/MIT
 *
 * (c) 2012, 2015 Atma.js and other contributors
 */
// end:source /src/license.txt

(function(root, factory){
	var _global = typeof global !== 'undefined' ? global : window,
		_mask = _global.mask || (_global.atma && _global.atma.mask),
		_$ = _global.jQuery || _global.$,
		_assert = _global.assert || {};

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
		
		_global.DomTest = fn;
	}
	
	construct();
	
}(this, function(global, mask, $, __assert){
	'use strict';
	
	// source /bower_components/assertion/lib/assert.embed.js
	var assert;
	(function(global, exports){
		
		(function(){
			// source /src/exports.js
			// source scope-vars
			
			
			var _Array_slice = Array.prototype.slice,
			
				assert = {
					errors: 0
				};
			// end:source scope-vars
				
			// source utils/is
			function is_Array(ar) {
				return Array.isArray(ar);
			}
			
			function is_Boolean(arg) {
				return typeof arg === 'boolean';
			}
			
			function is_Null(arg) {
				return arg === null;
			}
			
			function is_NullOrUndefined(arg) {
				return arg == null;
			}
			
			function is_Number(arg) {
				return typeof arg === 'number';
			}
			
			function is_String(arg) {
				return typeof arg === 'string';
			}
			
			function is_Symbol(arg) {
				return typeof arg === 'symbol';
			}
			
			function is_Undefined(arg) {
				return arg === void 0;
			}
			
			function is_RegExp(re) {
				return obj_typeof(re) === 'RegExp';
			}
			
			function is_Object(arg) {
				return typeof arg === 'object' && arg !== null;
			}
			
			function is_Date(d) {
				return obj_typeof(d) === 'Date';
			}
			
			function is_Error(e) {
				return obj_typeof(e) === 'Error' || e instanceof Error;
			}
			
			function is_Function(arg) {
				return typeof arg === 'function';
			}
			
			function is_Buffer(buff){
				if (typeof Buffer === 'undefined') 
					return false;
				
				return buff instanceof Buffer;
			}
			
			function is_Arguments(x){
				return obj_typeof(x) === 'Arguments';
			}
			
			function is_Primitive(arg) {
				return arg === null
					|| typeof arg === 'boolean'
					|| typeof arg === 'number'
					|| typeof arg === 'string'
					|| typeof arg === 'symbol'
					|| typeof arg === 'undefined'
					;
			}
			// end:source utils/is
			// source utils/object
			var obj_typeof,
				obj_inherit,
				obj_extend,
				obj_keys
				;
				
			
			(function(){
			
				
				obj_typeof = function(x) {
					return Object
						.prototype
						.toString
						.call(x)
						.replace('[object ', '')
						.replace(']', '');
				};
				
				obj_inherit = function(Ctor, base) {
					
					function temp(){}
					temp.prototype = base.prototype;
					
					Ctor.prototype = new temp;
				};
			
				obj_keys = Object.keys
					? Object.keys
					: getKeys;
				
				obj_extend = function(target, source){
					if (target == null) 
						target = {};
						
					if (source == null) 
						return target;
					
					for(var key in source){
						target[key] = source[key];
					}
					
					return target;
				};
				
				// private
				
				function getKeys(obj) {
					var keys = [];
					for(var key in keys)
						keys.push(key);
					
					return keys;
				}
				
			}());
			
			// end:source utils/object
			// source utils/string
			function str_truncate(str, length) {
				
				if (is_String(str) == false) 
					return str;
				
				return str.length < length
					? str
					: str.slice(0, length)
					;
			}
			// end:source utils/string
			// source utils/stack
			var stack_prepair;
			
			(function(){
				
				stack_prepair = function(stack) {
					if (stack == null) 
						return '';
					
					var lines = stack.split('\n'),
						startIndex = 1, endIndex = lines.length
						;
					
					var rgx_start = /(^([ \t]*at )?[\w\.]*assert[_\.])|(^([ \t]*at )?\w+\.assert)/i,
						rgx_end = /(^([ \t]*at )?runCase)/i
						;
					
					var i = 0, 
						imax = lines.length;
					
					while ( ++i < imax ){
						if (rgx_start.test(lines[i])) 
							startIndex = i + 1;
						
						if (rgx_end.test(lines[i])) {
							endIndex = i;
							break;
						}
					}
					
					lines.splice(endIndex);
					lines.splice(1, startIndex - 1);
					
					
					return lines.join('\n');
				};
				
			}());
			// end:source utils/stack
			// source utils/style
			var style_get,
				style_isVisible;
			(function(){
				
				var getters = {};
				
				// source style/box
				(function(){
					// Mainly for the FireFox support
					// as for instance 'padding' returns empty string
					
					obj_extend(getters, {
						'border-width': boxSizeDelegate('border-%anchor-width'),
						'padding': boxSizeDelegate('padding-%anchor'),
						'margin': boxSizeDelegate('margin-%anchor'),
					});
					
					function boxSizeDelegate(pattern) {
						return function(el){
							return boxSize(el, pattern);
						};
					}
					function boxSize(el, pattern) {
						var sizes = [];
						var equal = true;
						var prev  = null;
						(['top', 'right', 'bottom', 'left']).forEach(function(anchor){
							var style = pattern.replace('%anchor', anchor),
								val = getStyle(el, style);
							
							equal = prev == null || prev === val;
							prev  = val;
							
							sizes.push(val);
						});
						if (equal) {
							return sizes[0];
						}
						return sizes.join(' ');
					}
					
				}());
				
				// end:source style/box
				// source style/color
				(function(){
					
					// getComputedStyle returns RGB for colors
					
					obj_extend(getters, {
						'background-color': colorDelegate('background-color'),
						'color': colorDelegate('color'),
					});
					
					function colorDelegate(property) {
						return function(el, expect){
							return color(el, property, expect);
						};
					}
					
					function color(el, property, expect) {
						var current = getStyle(el, property);
						if (isEmpty(current)) {
							return current;
						}
						var x = toBrowsersColor(expect);
						if (x === current) {
							return expect;
						}
						if (isHex(expect) && isRgb(current)) {
							return toHex(current);
						}
						
						return current;
					}
					
					var rgx_RGB = /rgba? *\( *([0-9]{1,3}) *, *([0-9]{1,3}) *, *([0-9]{1,3})/;
					var div = null;
					
					function isRgb(any) {
						return /^rgb/.test(any);
					}
					function isHex(any) {
						return /^#/.test(any);
					}
					function isEmpty(any) {
						return any == null || any === '';
					}
					
					function toHex(rgb) {
						
						var values = rgx_RGB.exec(rgb);
						if (values == null || values.length !== 4)
							return rgb;
						
						var r = Math.round(parseFloat(values[1]));
						var g = Math.round(parseFloat(values[2]));
						var b = Math.round(parseFloat(values[3]));
						return "#" 
							+ (r + 0x10000).toString(16).substring(3).toUpperCase() 
							+ (g + 0x10000).toString(16).substring(3).toUpperCase()
							+ (b + 0x10000).toString(16).substring(3).toUpperCase();
					}
					function toBrowsersColor (any) {
						if (div == null) {
							div = document.createElement('div');
							document.body.appendChild(div);
						}
						div.style.color = any;
						return getComputedStyle(div).color;
					}
				}());
				// end:source style/color
				
				style_get = function (el, property, expect) {
					var fn = getters[property];
					if (fn) {
						return fn(el, expect);
					}
					return getStyle(el, property);
				};
				
				style_isVisible = function (el) {
					if (el == null) {
						return false;
					}
					var style = getStyle(el, 'display');
					if (style === 'none') {
						return false;
					}
					var style = getStyle(el, 'visibility');
					if (style === 'hidden') {
						return false;
					}
					return true;
				};
				
				function getStyle(el, property) {
					if (global.getComputedStyle == null) {
						return $(el).css(property);
					}
					
					var styles = global.getComputedStyle(el);
					var x = styles.getPropertyValue(property);
					return x === ''
						? el.style.getPropertyValue(property)
						: x;
				}
			}());
			// end:source utils/style
			
			// source error
			var fail;
			
			(function() {
			
				fail = function assert_fail (actual, expected, message, operator, stackStartFunction) {
					
					var error = new AssertionError({
						message: message,
						actual: actual,
						expected: expected,
						operator: operator,
						stackStartFunction: stackStartFunction
					});
					
					throw error;
				};
			
				assert.AssertionError = AssertionError;
				assert.fail = function (mix) {
					var error = mix;
					if (typeof mix === 'string') {
						error = new AssertionError({
							message: message
						});
					}
					assert.errors++;
					
					throw error;
				};
				assert.prepairStack = stack_prepair;
				
				
				// private
			
				// {message, actual, expected }
				function AssertionError(options) {
					this.name = 'AssertionError';
					this.actual = options.actual;
					this.expected = options.expected;
					this.operator = options.operator;
			
					if (options.message) {
						this.message = options.message;
						this.generatedMessage = false;
					} else {
						this.message = getMessage(this);
						this.generatedMessage = true;
					}
					
					var stackStartFunction = options.stackStartFunction || fail;
			
					if (Error.captureStackTrace) {
						Error.captureStackTrace(this, stackStartFunction);
					} else {
						
						this.stack = new Error().stack;
					}
					
					this.stack = stack_prepair(this.stack);
				};
				obj_inherit(AssertionError, Error);
			
				function getMessage(error) {
					var str_actual = JSON.stringify(error.actual, replacer),
						str_expected = JSON.stringify(error.expected, replacer);
			
					return str_truncate(str_actual, 128) + ' ' + error.operator + ' ' + str_truncate(str_expected, 128);
				}
			
			
				function replacer(key, value) {
					if (is_Undefined(value))
						return '' + value;
			
					if (is_Number(value) && (isNaN(value) || !isFinite(value)))
						return value.toString();
			
					if (is_Function(value) || is_RegExp(value))
						return value.toString();
			
					return value;
				}
				
				
			
			}());
			// end:source error
			
			// source assert/exception
			(function() {
			
				assert.throws = function(mix, /*optional*/ error, /*optional*/ message) {
					_throws.apply(this, [true].concat(_Array_slice.call(arguments)));
				};
			
			
				assert.doesNotThrow = function(mix, /*optional*/ message) {
					_throws.apply(this, [false].concat(_Array_slice.call(arguments)));
				};
			
				assert.ifError = function(err) {
					if (err) 
						throw err;
				};
			
				// private
				function _throws(shouldThrow, mix, expected, message) {
					var actual,
						fn, args;
					
					if (is_Array(mix)) {
						var arr = _Array_slice.call(mix);
						fn = arr.shift();
						args = arr;
					}
					
					if (is_Function(mix)) {
						fn = mix;
						args = [];
					}
					
			
					if (is_String(expected)) {
						message = expected;
						expected = null;
					}
			
					try {
						fn.apply(null, args);
					} catch (error) {
						actual = error;
					}
					
					message = ''
						+ (expected && expected.name && (' (' + expected.name + ').') || '.')
						+ ((message && (' ' + message)) || '.') 
			
					
					if (shouldThrow === true && actual == null) 
						fail(actual, expected, 'Missing expected exception' + message);
					
					if (shouldThrow === false && expectedException(actual, expected)) 
						fail(actual, expected, 'Got unwanted exception' + message);
					
			
					if ((shouldThrow && actual && expected && !expectedException(actual, expected)) || (!shouldThrow && actual)) 
						throw actual;
					
				}
				
				function expectedException(actual, expected) {
					
					if (!actual || !expected) 
						return false;
					
					if (is_RegExp(expected)) 
						return expected.test(actual);
					
					if (actual instanceof expected) 
						return true;
			
					if (expected.call({}, actual) === true) 
						return true;
					
					return false;
				}
			
			}());
			// end:source assert/exception
			// source assert/callback
			(function() {
				
				assert.callbacks = [];
				assert.await = assert_await;
				assert.avoid = assert_avoid;
				
				function assert_await() {
					
					var fn, name, ctx, count;
					
					var i = arguments.length,
						x;
					while( --i > -1) {
						x = arguments[i];
						switch(typeof x) {
							case 'function':
								fn = x;
								break;
							case 'object':
								ctx = x;
								break;
							case 'number':
								count = x;
								break;
							case 'string':
								name = x;
								break;
						}
					}
					
					if (this.callbacks == null) 
						this.callbacks = [];
					
					if (isNaN(count) || count < 1) 
						count = 1;
					
					var cbs = this.callbacks,
						obj = {
							count: count,
							name: name,
							stack: stack_prepair((new Error).stack)
						};
					
					cbs.push(obj);
					return function(){
						
						if (--obj.count === 0) 
							cbs.splice(cbs.indexOf(obj), 1);
						
						if (typeof fn !== 'function') 
							return null;
						
						return fn.apply(ctx, arguments);
					}
				}
				
				function assert_avoid() {
					var name = 'function',
						count = 0,
						ctx,
						fn;
						
					
					var i = arguments.length,
						x;
					while( --i > -1) {
						x = arguments[i];
						switch(typeof x) {
							case 'function':
								fn = x;
								break;
							case 'object':
								ctx = x;
								break;
							case 'number':
								count = x;
								break;
							case 'string':
								name = x;
								break;
						}
					}
					
					var cbs = this.callbacks;
					if (cbs == null)
						cbs = this.callbacks = [];
			
					return function(mix) {
						
						if (--count < 0) {
								
							var obj = {
								count: count,
								name: '<avoid>' + (name || ''),
								argument: mix
							};
							
							cbs.push(obj);
						}
						
			
						fn && fn.apply(ctx, arguments)
					};
				}
			}());
			// end:source assert/callback
			// source assert/equal
			(function() {
			
				assert.ok = function ok(value, message) {
					if (!value)
						fail(value, true, message, '==', ok);
				};
			
				
				var equal,
					notEqual,
					strictEqual,
					notStrictEqual
					;
				
				equal = 
				assert.equal =
				function equal(actual, expected, message) {
					if (actual != expected)
						fail(actual, expected, message, '==', equal);
				};
			
				notEqual = 
				assert.notEqual =
				function notEqual(actual, expected, message) {
					if (actual == expected)
						fail(actual, expected, message, '!=', notEqual);
				};
			
				strictEqual = 
				assert.strictEqual =
				function strictEqual(actual, expected, message) {
					if (actual !== expected)
						fail(actual, expected, message, '===', strictEqual);
			
				};
			
				notStrictEqual = 
				assert.notStrictEqual =
				function notStrictEqual(actual, expected, message) {
					if (actual === expected)
						fail(actual, expected, message, '!==', notStrictEqual);
			
				};
				
				assert.eq_ = equal;
				assert.notEq_ = notEqual;
				assert.strictEq_ = strictEqual;
				assert.notStrictEq_ = notStrictEqual;
			
			}());
			// end:source assert/equal
			// source assert/deepEqual
			(function() {
				
				var deepEqual,
					notDeepEqual
					;
				
				assert.deepEqual =
				deepEqual =
				function deepEqual(actual, expected, message) {
					
					if (_deepEqual(actual, expected) === false) 
						fail(actual, expected, message, 'deepEqual', deepEqual);
				};
			
				
				assert.notDeepEqual =
				notDeepEqual =
				function notDeepEqual(actual, expected, message) {
					
					if (_deepEqual(actual, expected) === true) 
						fail(actual, expected, message, 'notDeepEqual', notDeepEqual);
				};
				
				
				assert.deepEq_ = deepEqual;
				assert.notDeepEq_ = notDeepEqual;
				
				function _deepEqual(a, b) {
					if (a == null || b == null) 
						return a == b;
					
					if (a === b) 
						return true;
					
					if (is_Arguments(a)) 
						a = _Array_slice.call(a);
					
					if (is_Arguments(a)) 
						a = _Array_slice.call(a);
						
					
					var AType = obj_typeof(a);
					
					switch(AType){
						case 'Number':
						case 'Boolean':
						case 'String':
							return a == b;
						
						case 'RegExp':
						case 'Date':
							return (a).toString() === (b).toString();
					}
					
					if (is_Buffer(a) && is_Buffer(b)) {
						if (a.length != b.length)
							return false;
					 
						for (var i = 0; i < a.length; i++) {
						  if (a[i] != b[i])
							return false;
						}
					 
						return true;
					}
					
					if (!is_Object(a) && !is_Object(b)) 
						return a === b;
					
					return objEquiv(a, b);
				}
			
			
				function objEquiv(a, b) {
					
					var ka = obj_keys(a).sort(),
						kb = obj_keys(b).sort(),
						key, i;
				
					if (ka.length != kb.length)
						return false;
					
					i = ka.length;
					while ( --i !== -1) {
						if (ka[i] != kb[i])
							return false;
					}
					
					i = ka.length
					while (--i !== -1) {
						key = ka[i];
						
						if (!_deepEqual(a[key], b[key]))
							return false;
					}
					
					return true;
				}
			
			
			}());
			// end:source assert/deepEqual
			// source assert/compare
			(function() {
				
				var lessThan,
					lessThanOrEqual,
					greaterThan,
					greaterThanOrEqual
					;
				
				lessThan = 
				assert.lessThan =
				function equal(actual, expected, message) {
					if (actual < Number(expected))
						fail(actual, expected, message, '<', lessThan);
				};
			
				lessThanOrEqual = 
				assert.lessThanOrEqual =
				function equal(actual, expected, message) {
					if (actual <= Number(expected))
						fail(actual, expected, message, '<=', lessThan);
				};
			
				greaterThan = 
				assert.greaterThan =
				function strictEqual(actual, expected, message) {
					if (actual > Number(expected))
						fail(actual, expected, message, '>', greaterThan);
			
				};
			
				greaterThanOrEqual = 
				assert.greaterThanOrEqual =
				function strictEqual(actual, expected, message) {
					if (actual >= Number(expected))
						fail(actual, expected, message, '>=', greaterThanOrEqual);
			
				};
				
				assert.lt_ = lessThan;
				assert.lte_ = lessThanOrEqual;
				assert.gt_ = greaterThan;
				assert.gte_ = greaterThanOrEqual;
			
			}());
			// end:source assert/compare
			// source assert/has
			(function() {
				
				var has,
					hasNot;
			
				has =
				assert.has =
				function has(actual, expected, message) {
					_performHas(actual, expected, true, message, has);
				};
			
				hasNot = 
				assert.hasNot =
				function hasNot(actual, expected, message) {
					_performHas(actual, expected, false, message, hasNot);
				}
				
				assert.has_ = has;
				assert.hasNot_ = hasNot;
			
				// = private
				var OPERATOR = '\u2287';
			
				var t_Date = 'Date',
					t_Array = 'Array',
					t_Object = 'Object',
					t_String = 'String',
					t_RegExp = 'RegExp',
					t_Number = 'Number',
					t_Boolean = 'Boolean',
					t_Function = 'Function',
					t_NullOrUndefined = '<undefined>',
					t_Reference = '<reference-check>';
			
				function obj_typeof(x) {
					var type = Object
						.prototype
						.toString
						.call(x)
						.replace('[object ', '')
						.replace(']', '');
			
					switch (type) {
						case t_Date:
						case t_Array:
						case t_String:
						case t_RegExp:
						case t_Boolean:
						case t_Number:
						case t_Function:
							return type;
						case t_Object:
							if (typeof x.length === 'number'
								&& typeof x.splice === 'function'
								&& typeof x.indexOf === 'function') {
								// Array-Alike
								return t_Array;
							}
							
							return t_Object;
						case 'Null':
						case 'Undefined':
							return t_NullOrUndefined;
			
						default:
							// Not supported type.
							// Not possible to run `contains` check
							// -> perform simple `==` comparison
							return t_Reference;
					}
				}
			
				function _performHas(actual, expected, expectedResult, message, stackStartFunction) {
			
					var result = _has(actual, expected);
					if (result === expectedResult) 
						return;
					
			
					if (expectedResult === false && result !== true) {
						// structur missmatch
						return;
					}
					
					if (typeof result === 'string') 
						message = '(' + result + ') ' + (message || '');
					
					fail(actual, expected, message, OPERATOR, stackStartFunction);
				}
			
				function _has(a, b) {
			
					var AType = obj_typeof(a),
						BType = obj_typeof(b);
			
					var _AType, _BType;
			
					switch (AType) {
						case t_String:
							if (t_String === BType) 
								return a.indexOf(b) !== -1
									|| ('Not a substring of ' + a);
							
							if (t_RegExp === BType) 
								return b.test(a) || ('RegExp failed: ' + a);
							
			
							return 'Unexpected types: String-' + BType;
			
						case t_RegExp:
						case t_Date:
						case t_Number:
						case t_Boolean:
						case t_Function:
							return (a).toString() === (b).toString()
								|| ('Unexpected value: ' + a);
			
						case t_Reference:
							return a === b
								|| ('Reference check');
			
						case t_Object:
							if (t_String === BType) 
								return b in a
									|| ('Property expected:' + b);
							
							if (t_Object === BType) {
								for (var key in b) {
									if (key in a === false) 
										return 'Property expected: ' + key;
									
			
									_AType = obj_typeof(a[key]);
									_BType = obj_typeof(b[key]);
			
									if (_BType === t_NullOrUndefined) {
										// property existance
										continue;
									}
									if (_AType !== _BType) 
										return 'Type missmatch: ' + _AType + '-' + _BType;
									
									if (t_String === _AType) {
										if (a[key] !== b[key]) 
											return 'Unexpected value: ' + a[key];
										
										continue;
									}
			
									var result = _has(a[key], b[key]);
									if (result !== true) 
										return result;
								}
								return true;
							}
			
							return 'Unexpected types: Object-' + BType;
					}
			
					if (t_Array === AType) {
			
						switch (BType) {
							case t_Number:
							case t_String:
							case t_Boolean:
								return a.indexOf(b) !== -1
									|| ('Array should contain: ' + b);
			
							case t_Date:
							case t_RegExp:
							case t_Function:
								var val = (b).toString();
								return a.some(function(x) {
									return (x).toString() === val;
								}) || ('Array should contain: ' + val);
			
							case t_Array:
								var ib = 0,
									ibmax = b.length,
									ia,
									iamax = a.length;
								bloop: for (; ib < ibmax; ib++) {
			
									_BType = obj_typeof(b[ib]);
			
									switch (_BType) {
										case t_String:
										case t_Number:
										case t_Boolean:
										case t_RegExp:
										case t_Date:
										case t_Function:
											var result = _has(a, b[ib])
											if (result !== true) 
												return result;
											
											continue bloop;
			
										case t_Object:
										case t_Array:
											ia = 0;
											for (; ia < iamax; ia++) {
			
												if (_BType !== obj_typeof(a[ia])) 
													continue;
												
												if (_has(a[ia], b[ib]) === true) 
													break;
												
											}
			
											if (ia === iamax) 
												return _BType + ' is not a subset';
											
											continue bloop;
									}
								}
								return true;
						}
					}
			
					return 'Unexpected types: ' + AType + '-' + BType;
				}
			
			}());
			// end:source assert/has
			// source assert/is
			(function(){
				
				var is,
					isNot
					;
				
				
				is =
				assert.is =
				function is(actual, expected, message) {
					_performCheck(actual, expected, true, message, is);
				};
			
				isNot =
				assert.isNot =
				function isNot(actual, expected, message) {
					_performCheck(actual, expected, false, message, isNot);
				};
				
				
				assert.is_ = is;
				assert.isNot_ = isNot;
				
			
				
				function _performCheck(actual, expected, expectedResult, message, stackStartFunction) {
					var result = _is(actual, expected);
					if (result === expectedResult) 
						return;
					
					fail(actual, expected, message, '~~', stackStartFunction);
				}
				
				
				function _is(a, b){
					
					if (b == null) 
						return a == b;
					
					if (typeof b === 'string') {
						var AType = obj_typeof(a);
						
						switch(b) {
							case 'Object':
								return a != null && typeof a === 'object';
						}
						
						
						return  AType === b;
					}
					
					if (typeof b === 'function') 
						return a instanceof b;
					
					if (typeof b === 'object' && b.constructor) 
						return _is(a, b.constructor)
					
					return false;
				}
				
			}());
			// end:source assert/is
			// source assert/jquery
			(function(){
				assert.setDOMLibrary = setDOMLibrary;
				assert.$ = {};
				
				var $ = global.$ || global.jQuery || global.Zepto || global.Kimbo;
				if ($ == null) 
					return;
				
				setDOMLibrary($);
				
				function setDOMLibrary($) {
					
					var Proto =  {};
					var METHODS =  [
						'eq_',
						'notEq_',
						
						'deepEq_',
						'notDeepEq_',
						
						'has_',
						'hasNot_',
						
						'is_',
						'isNot_',
						
						'lt_',
						'lte_',
						'gt_',
						'gte_',
					];
					
					METHODS.forEach(function (key) {
						Proto[key] = function assert_jquery(mix){
							var args = _Array_slice.call(arguments),
								method = key,
								message
								;
								
							if (is_Array(mix)) {
								message = args[args.length - 1];
								args = mix;
							}
							
							
							switch(method){
								case 'is_':
								case 'isNot_':
									if (args.length === 1) {
										var x = args[0];
										if ('visible' === x || 'hidden' === x) {
											var visibility = style_isVisible(this[0]);
											if (key === 'isNot_') {
												x = x === 'visible' ? 'hidden' : 'visible';
											}
											if ('visible' === x) {
												eq_(visibility, true, 'Element should be visible');
											}
											if ('hidden' === x) {
												eq_(visibility, false, 'Element should be hidden');
											}
											return;
										}
										args.unshift('is');
										args.push(true);
										method = 'is_' === method ? 'eq_' : 'notEq_';
									}
									break;
								case 'has_':
								case 'hasNot_':
									var selector = args[0];
									if (typeof selector !== 'string') 
										break;
									
									if (this[selector] != null && args.length !== 1) 
										break;
									
									var count = args[1],
										$els = this.find(selector);
									if ($els.length === 0) 
										$els = this.filter(selector);
									if ($els.length === 0) {
										$els = querySelector(this, selector);
									}
									
									if ('has_' === method) {
										
										if (isNaN(count)) {
											assert_do('notEq_', $els.length, 0, message);
											return this;
										}
										
										assert_do('eq_', $els.length, count, message);
									}
									
									if ('hasNot_' === method) {
										
										if (isNaN(count)) {
											assert_do('eq_', $els.length, 0, message);
											return this;
										}
										
										assert_do('notEq_', $els.length, count, message);
									}
									
									return this;
							}
							
							var expected = args.pop(),
								x = args.shift(),
								actual
								;
								
							if (typeof x === 'string') {
								// jquery property
								actual = getActual(this, x, args, expected);
							}
							
							if (typeof x === 'function') {
								// custom function
								actual = x(this);
							}
							
							assert_do(method, actual, expected, message);
							return this;
						};
						
						function getActual($, prop, args, expected) {
							if (prop === 'css' && args.length === 1 && $.length !== 0) {
								var el = $.get(0),
									css = args[0];
								return style_get(el, css, expected);
							}
							
							var val = $[prop];
							if (typeof val === 'function') {
								return val.apply($, args);
							}
							
							return val;
						}
						
						function assert_do(method, actual, expected, message){
							
							assert[method](actual, expected, message);
						}
					});
					
					METHODS.forEach(function (key) {
						assert.$[key] = function(){
							var args = _Array_slice.call(arguments),
								ctx = args.shift();
								
							return Proto[key].apply(ctx, args);
						};
						
						if ($.fn[key] !== void 0) 
							return;
						
						$.fn[key] = Proto[key];
					});		
				}
				
				function querySelector($els, selector) {
					var set = $();
					$els.each(function(i, el){
						if (el == null || el.querySelectorAll == null)
							return;
						
						var arr = el.querySelectorAll(selector);
						set = set.add(arr);
					});
					return set;
				}
			}());
			// end:source assert/jquery
			
			// source listeners
			(function(){
				
				// wrap functions
				(function(lib, emit){
					
					for (var key in lib) {
						if (typeof lib[key] !== 'function') 
							continue;
						
						switch(key){
							case 'callback':
							case 'await':
							case 'avoid':
							case 'prepairStack':
							case 'on':
							case 'off':
								continue;
						}
						
						if (key[0] === key[0].toUpperCase()) 
							continue;
						
						lib[key] = wrapFn(lib[key]);
					}
					
					
					function wrapFn(fn) {
						return function assert_wrapFn(){
							
							var result;
							emit('start');
							
							try {
								result = fn.apply(this, arguments);
							} catch(error) {
								
								if (emit('fail', error) === false) 
									throw error;
								
								return null;
							}
							
							emit('success');
							
							return result;
						};
					}
					
				}(assert, emit));
				
				assert.on = function assert_on(type, listener) {
					
					if (_events[type] == null) 
						_events[type] = [];
					
					_events[type].push(listener);
				};
				
				assert.off = function assert_off(type, listener){
					
					var cbs = _events[type];
					if (cbs == null) 
						return;
					
					
					if (listener == null) {
						cbs.length = 0;
						return;
					}
					
					var i = cbs.length;
					while ( --i !== -1 ) {
						if (cbs[i] === listener)
							cbs.splice(i, 1);
					}
				};
				
				
				// = private
				
				
				var _events = {};
				
				function emit(type) {
						
					var cbs = _events[type];
					if (cbs == null) 
						return false;
					
					var i = cbs.length;
					if (i === 0) 
						return false;
					
					var args = _Array_slice.call(arguments, 1),
						fn;
						
					while ( --i !== -1 ) {
						
						fn = cbs[i];
						fn.apply(null, args);
					}
					
					return true;
				}
			}());
			// end:source listeners
			
			exports.assert = obj_extend(assert.ok, assert);
			// end:source /src/exports.js
		}());
		
		assert = exports.assert;	
	}(global, {}));
	
	
	// end:source /bower_components/assertion/lib/assert.embed.js
	// source /src/exports.es6
	var _Array_slice = Array.prototype.slice,
	    _Array_splice = Array.prototype.splice,
	    _Array_indexOf = Array.prototype.indexOf,
	    _Object_create = null,
	    _Object_hasOwnProp = Object.hasOwnProperty,
	    _Object_getOwnProp = Object.getOwnPropertyDescriptor,
	    _Object_defineProperty = Object.defineProperty;
	var coll_each,
	    coll_remove,
	    coll_map,
	    coll_indexOf,
	    coll_find;
	(function() {
	  coll_each = function(coll, fn, ctx) {
	    if (ctx == null)
	      ctx = coll;
	    if (coll == null)
	      return coll;
	    var imax = coll.length,
	        i = 0;
	    for (; i < imax; i++) {
	      fn.call(ctx, coll[i], i);
	    }
	    return ctx;
	  };
	  coll_indexOf = function(coll, x) {
	    if (coll == null)
	      return -1;
	    var imax = coll.length,
	        i = 0;
	    for (; i < imax; i++) {
	      if (coll[i] === x)
	        return i;
	    }
	    return -1;
	  };
	  coll_remove = function(coll, x) {
	    var i = coll_indexOf(coll, x);
	    if (i === -1)
	      return false;
	    coll.splice(i, 1);
	    return true;
	  };
	  coll_map = function(coll, fn, ctx) {
	    var arr = new Array(coll.length);
	    coll_each(coll, function(x, i) {
	      arr[i] = fn.call(this, x, i);
	    }, ctx);
	    return arr;
	  };
	  coll_find = function(coll, fn, ctx) {
	    var imax = coll.length,
	        i = 0;
	    for (; i < imax; i++) {
	      if (fn.call(ctx || coll, coll[i], i))
	        return true;
	    }
	    return false;
	  };
	}());
	if (Array.prototype.forEach === void 0) {
	  Array.prototype.forEach = function(fn, ctx) {
	    coll_each(this, fn, ctx);
	  };
	}
	if (Array.prototype.indexOf === void 0) {
	  Array.prototype.indexOf = function(x) {
	    return coll_indexOf(this, x);
	  };
	}
	if (String.prototype.trim == null) {
	  String.prototype.trim = function() {
	    var start = -1,
	        end = this.length,
	        code;
	    if (end === 0)
	      return this;
	    while (++start < end) {
	      code = this.charCodeAt(start);
	      if (code > 32)
	        break;
	    }
	    while (--end !== 0) {
	      code = this.charCodeAt(end);
	      if (code > 32)
	        break;
	    }
	    return start !== 0 && end !== length - 1 ? this.substring(start, end + 1) : this;
	  };
	}
	if (Function.prototype.bind == null) {
	  var _Array_slice;
	  Function.prototype.bind = function() {
	    if (arguments.length < 2 && typeof arguments[0] === "undefined")
	      return this;
	    var fn = this,
	        args = _Array_slice.call(arguments),
	        ctx = args.shift();
	    return function() {
	      return fn.apply(ctx, args.concat(_Array_slice.call(arguments)));
	    };
	  };
	}
	var is_Function,
	    is_Array,
	    is_ArrayLike,
	    is_String,
	    is_Object,
	    is_notEmptyString,
	    is_rawObject,
	    is_Date,
	    is_NODE,
	    is_DOM;
	(function() {
	  is_Function = function(x) {
	    return typeof x === 'function';
	  };
	  is_Object = function(x) {
	    return x != null && typeof x === 'object';
	  };
	  is_Array = is_ArrayLike = function(arr) {
	    return arr != null && typeof arr === 'object' && typeof arr.length === 'number' && typeof arr.slice === 'function';
	    ;
	  };
	  is_String = function(x) {
	    return typeof x === 'string';
	  };
	  is_notEmptyString = function(x) {
	    return typeof x === 'string' && x !== '';
	  };
	  is_rawObject = function(obj) {
	    if (obj == null || typeof obj !== 'object')
	      return false;
	    return obj.constructor === Object;
	  };
	  is_Date = function(x) {
	    if (x == null || typeof x !== 'object') {
	      return false;
	    }
	    if (x.getFullYear != null && isNaN(x) === false) {
	      return true;
	    }
	    return false;
	  };
	  is_DOM = typeof window !== 'undefined' && window.navigator != null;
	  is_NODE = !is_DOM;
	}());
	var obj_getProperty,
	    obj_setProperty,
	    obj_hasProperty,
	    obj_extend,
	    obj_extendDefaults,
	    obj_extendMany,
	    obj_extendProperties,
	    obj_extendPropertiesDefaults,
	    obj_create,
	    obj_toFastProps,
	    obj_defineProperty;
	(function() {
	  obj_getProperty = function(obj_, path) {
	    if ('.' === path)
	      return obj_;
	    var obj = obj_,
	        chain = path.split('.'),
	        imax = chain.length,
	        i = -1;
	    while (obj != null && ++i < imax) {
	      obj = obj[chain[i]];
	    }
	    return obj;
	  };
	  obj_setProperty = function(obj_, path, val) {
	    var obj = obj_,
	        chain = path.split('.'),
	        imax = chain.length - 1,
	        i = -1,
	        key;
	    while (++i < imax) {
	      key = chain[i];
	      if (obj[key] == null)
	        obj[key] = {};
	      obj = obj[key];
	    }
	    obj[chain[i]] = val;
	  };
	  obj_hasProperty = function(obj, path) {
	    var x = obj_getProperty(obj, path);
	    return x !== void 0;
	  };
	  obj_defineProperty = function(obj, path, dscr) {
	    var x = obj,
	        chain = path.split('.'),
	        imax = chain.length - 1,
	        i = -1,
	        key;
	    while (++i < imax) {
	      key = chain[i];
	      if (x[key] == null)
	        x[key] = {};
	      x = x[key];
	    }
	    key = chain[imax];
	    if (_Object_defineProperty) {
	      if (dscr.writable === void 0)
	        dscr.writable = true;
	      if (dscr.configurable === void 0)
	        dscr.configurable = true;
	      if (dscr.enumerable === void 0)
	        dscr.enumerable = true;
	      _Object_defineProperty(x, key, dscr);
	      return;
	    }
	    x[key] = dscr.value === void 0 ? dscr.value : (dscr.get && dscr.get());
	  };
	  obj_extend = function(a, b) {
	    if (b == null)
	      return a || {};
	    if (a == null)
	      return obj_create(b);
	    for (var key in b) {
	      a[key] = b[key];
	    }
	    return a;
	  };
	  obj_extendDefaults = function(a, b) {
	    if (b == null)
	      return a || {};
	    if (a == null)
	      return obj_create(b);
	    for (var key in b) {
	      if (a[key] == null)
	        a[key] = b[key];
	    }
	    return a;
	  };
	  var extendPropertiesFactory = function(overwriteProps) {
	    if (_Object_getOwnProp == null)
	      return overwriteProps ? obj_extend : obj_extendDefaults;
	    return function(a, b) {
	      if (b == null)
	        return a || {};
	      if (a == null)
	        return obj_create(b);
	      var key,
	          descr,
	          ownDescr;
	      for (key in b) {
	        descr = _Object_getOwnProp(b, key);
	        if (descr == null)
	          continue;
	        if (overwriteProps !== true) {
	          ownDescr = _Object_getOwnProp(a, key);
	          if (ownDescr != null) {
	            continue;
	          }
	        }
	        if (descr.hasOwnProperty('value')) {
	          a[key] = descr.value;
	          continue;
	        }
	        _Object_defineProperty(a, key, descr);
	      }
	      return a;
	    };
	  };
	  obj_extendProperties = extendPropertiesFactory(true);
	  obj_extendPropertiesDefaults = extendPropertiesFactory(false);
	  obj_extendMany = function(a) {
	    var imax = arguments.length,
	        i = 1;
	    for (; i < imax; i++) {
	      a = obj_extend(a, arguments[i]);
	    }
	    return a;
	  };
	  obj_toFastProps = function(obj) {
	    function F() {}
	    F.prototype = obj;
	    new F();
	    return;
	    eval(obj);
	  };
	  _Object_create = obj_create = Object.create || function(x) {
	    var Ctor = function() {};
	    Ctor.prototype = x;
	    return new Ctor;
	  };
	}());
	var arr_remove,
	    arr_each,
	    arr_indexOf,
	    arr_contains,
	    arr_pushMany;
	(function() {
	  arr_remove = function(array, x) {
	    var i = array.indexOf(x);
	    if (i === -1)
	      return false;
	    array.splice(i, 1);
	    return true;
	  };
	  arr_each = function(arr, fn, ctx) {
	    arr.forEach(fn, ctx);
	  };
	  arr_indexOf = function(arr, x) {
	    return arr.indexOf(x);
	  };
	  arr_contains = function(arr, x) {
	    return arr.indexOf(x) !== -1;
	  };
	  arr_pushMany = function(arr, arrSource) {
	    if (arrSource == null || arr == null || arr === arrSource)
	      return;
	    var il = arr.length,
	        jl = arrSource.length,
	        j = -1;
	    ;
	    while (++j < jl) {
	      arr[il + j] = arrSource[j];
	    }
	  };
	}());
	var fn_proxy,
	    fn_apply,
	    fn_doNothing,
	    fn_createByPattern;
	(function() {
	  fn_proxy = function(fn, ctx) {
	    return function() {
	      return fn_apply(fn, ctx, arguments);
	    };
	  };
	  fn_apply = function(fn, ctx, args) {
	    var l = args.length;
	    if (0 === l)
	      return fn.call(ctx);
	    if (1 === l)
	      return fn.call(ctx, args[0]);
	    if (2 === l)
	      return fn.call(ctx, args[0], args[1]);
	    if (3 === l)
	      return fn.call(ctx, args[0], args[1], args[2]);
	    if (4 === l)
	      return fn.call(ctx, args[0], args[1], args[2], args[3]);
	    return fn.apply(ctx, args);
	  };
	  fn_doNothing = function() {
	    return false;
	  };
	  fn_createByPattern = function(definitions, ctx) {
	    var imax = definitions.length;
	    return function() {
	      var l = arguments.length,
	          i = -1,
	          def;
	      outer: while (++i < imax) {
	        def = definitions[i];
	        if (def.pattern.length !== l) {
	          continue;
	        }
	        var j = -1;
	        while (++j < l) {
	          var fn = def.pattern[j];
	          var val = arguments[j];
	          if (fn(val) === false) {
	            continue outer;
	          }
	        }
	        return def.handler.apply(ctx, arguments);
	      }
	      console.error('InvalidArgumentException for a function', definitions, arguments);
	      return null;
	    };
	  };
	}());
	var str_format;
	(function() {
	  str_format = function(str_) {
	    var str = str_,
	        imax = arguments.length,
	        i = 0,
	        x;
	    while (++i < imax) {
	      x = arguments[i];
	      if (is_Object(x) && x.toJSON) {
	        x = x.toJSON();
	      }
	      str_ = str_.replace(rgxNum(i - 1), String(x));
	    }
	    return str_;
	  };
	  var rgxNum;
	  (function() {
	    rgxNum = function(num) {
	      return cache_[num] || (cache_[num] = new RegExp('\\{' + num + '\\}', 'g'));
	    };
	    var cache_ = {};
	  }());
	}());
	var class_create,
	    class_createEx;
	(function() {
	  class_create = createClassFactory(obj_extendDefaults);
	  class_createEx = createClassFactory(obj_extendPropertiesDefaults);
	  function createClassFactory(extendDefaultsFn) {
	    return function() {
	      var args = _Array_slice.call(arguments),
	          Proto = args.pop();
	      if (Proto == null)
	        Proto = {};
	      var Ctor = Proto.hasOwnProperty('constructor') ? Proto.constructor : function ClassCtor() {};
	      var i = args.length,
	          BaseCtor,
	          x;
	      while (--i > -1) {
	        x = args[i];
	        if (typeof x === 'function') {
	          BaseCtor = wrapFn(x, BaseCtor);
	          x = x.prototype;
	        }
	        extendDefaultsFn(Proto, x);
	      }
	      return createClass(wrapFn(BaseCtor, Ctor), Proto);
	    };
	  }
	  function createClass(Ctor, Proto) {
	    Proto.constructor = Ctor;
	    Ctor.prototype = Proto;
	    return Ctor;
	  }
	  function wrapFn(fnA, fnB) {
	    if (fnA == null) {
	      return fnB;
	    }
	    if (fnB == null) {
	      return fnA;
	    }
	    return function() {
	      var args = _Array_slice.call(arguments);
	      var x = fnA.apply(this, args);
	      if (x !== void 0)
	        return x;
	      return fnB.apply(this, args);
	    };
	  }
	}());
	var error_createClass,
	    error_formatSource,
	    error_formatCursor,
	    error_cursor;
	(function() {
	  error_createClass = function(name, Proto, stackSliceFrom) {
	    var Ctor = _createCtor(Proto, stackSliceFrom);
	    Ctor.prototype = new Error;
	    Proto.constructor = Error;
	    Proto.name = name;
	    obj_extend(Ctor.prototype, Proto);
	    return Ctor;
	  };
	  error_formatSource = function(source, index, filename) {
	    var cursor = error_cursor(source, index),
	        lines = cursor[0],
	        lineNum = cursor[1],
	        rowNum = cursor[2],
	        str = '';
	    if (filename != null) {
	      str += str_format(' at {0}({1}:{2})\n', filename, lineNum, rowNum);
	    }
	    return str + error_formatCursor(lines, lineNum, rowNum);
	  };
	  error_cursor = function(str, index) {
	    var lines = str.substring(0, index).split('\n'),
	        line = lines.length,
	        row = index + 1 - lines.slice(0, line - 1).join('\n').length;
	    if (line > 1) {
	      row -= 1;
	    }
	    return [str.split('\n'), line, row];
	  };
	  (function() {
	    error_formatCursor = function(lines, lineNum, rowNum) {
	      var BEFORE = 3,
	          AFTER = 2,
	          i = lineNum - BEFORE,
	          imax = i + BEFORE + AFTER,
	          str = '';
	      if (i < 0)
	        i = 0;
	      if (imax > lines.length)
	        imax = lines.length;
	      var lineNumberLength = String(imax).length,
	          lineNumber;
	      for (; i < imax; i++) {
	        if (str)
	          str += '\n';
	        lineNumber = ensureLength(i + 1, lineNumberLength);
	        str += lineNumber + '|' + lines[i];
	        if (i + 1 === lineNum) {
	          str += '\n' + repeat(' ', lineNumberLength + 1);
	          str += lines[i].substring(0, rowNum - 1).replace(/[^\s]/g, ' ');
	          str += '^';
	        }
	      }
	      return str;
	    };
	    function ensureLength(num, count) {
	      var str = String(num);
	      while (str.length < count) {
	        str += ' ';
	      }
	      return str;
	    }
	    function repeat(char_, count) {
	      var str = '';
	      while (--count > -1) {
	        str += char_;
	      }
	      return str;
	    }
	  }());
	  function _createCtor(Proto, stackFrom) {
	    var Ctor = Proto.hasOwnProperty('constructor') ? Proto.constructor : null;
	    return function() {
	      obj_defineProperty(this, 'stack', {value: _prepairStack(stackFrom || 3)});
	      obj_defineProperty(this, 'message', {value: str_format.apply(this, arguments)});
	      if (Ctor != null) {
	        Ctor.apply(this, arguments);
	      }
	    };
	  }
	  function _prepairStack(sliceFrom) {
	    var stack = new Error().stack;
	    return stack == null ? null : stack.split('\n').slice(sliceFrom).join('\n');
	  }
	}());
	var class_Dfr;
	(function() {
	  class_Dfr = function() {};
	  class_Dfr.prototype = {
	    _isAsync: true,
	    _done: null,
	    _fail: null,
	    _always: null,
	    _resolved: null,
	    _rejected: null,
	    defer: function() {
	      this._rejected = null;
	      this._resolved = null;
	      return this;
	    },
	    isResolved: function() {
	      return this._resolved != null;
	    },
	    isRejected: function() {
	      return this._rejected != null;
	    },
	    isBusy: function() {
	      return this._resolved == null && this._rejected == null;
	    },
	    resolve: function() {
	      var done = this._done,
	          always = this._always;
	      ;
	      this._resolved = arguments;
	      dfr_clearListeners(this);
	      arr_callOnce(done, this, arguments);
	      arr_callOnce(always, this, [this]);
	      return this;
	    },
	    reject: function() {
	      var fail = this._fail,
	          always = this._always;
	      ;
	      this._rejected = arguments;
	      dfr_clearListeners(this);
	      arr_callOnce(fail, this, arguments);
	      arr_callOnce(always, this, [this]);
	      return this;
	    },
	    then: function(filterSuccess, filterError) {
	      return this.pipe(filterSuccess, filterError);
	    },
	    done: function(callback) {
	      if (this._rejected != null)
	        return this;
	      return dfr_bind(this, this._resolved, this._done || (this._done = []), callback);
	    },
	    fail: function(callback) {
	      if (this._resolved != null)
	        return this;
	      return dfr_bind(this, this._rejected, this._fail || (this._fail = []), callback);
	    },
	    always: function(callback) {
	      return dfr_bind(this, this._rejected || this._resolved, this._always || (this._always = []), callback);
	    },
	    pipe: function(mix) {
	      var dfr;
	      if (typeof mix === 'function') {
	        dfr = new class_Dfr;
	        var done_ = mix,
	            fail_ = arguments.length > 1 ? arguments[1] : null;
	        this.done(delegate(dfr, 'resolve', done_)).fail(delegate(dfr, 'reject', fail_));
	        ;
	        return dfr;
	      }
	      dfr = mix;
	      var imax = arguments.length,
	          done = imax === 1,
	          fail = imax === 1,
	          i = 0,
	          x;
	      while (++i < imax) {
	        x = arguments[i];
	        switch (x) {
	          case 'done':
	            done = true;
	            break;
	          case 'fail':
	            fail = true;
	            break;
	          default:
	            console.error('Unsupported pipe channel', arguments[i]);
	            break;
	        }
	      }
	      done && this.done(delegate(dfr, 'resolve'));
	      fail && this.fail(delegate(dfr, 'reject'));
	      function pipe(dfr, method) {
	        return function() {
	          dfr[method].apply(dfr, arguments);
	        };
	      }
	      function delegate(dfr, name, fn) {
	        return function() {
	          if (fn != null) {
	            var override = fn.apply(this, arguments);
	            if (override != null) {
	              if (isDeferred(override) === true) {
	                override.pipe(dfr);
	                return;
	              }
	              dfr[name](override);
	              return;
	            }
	          }
	          dfr[name].apply(dfr, arguments);
	        };
	      }
	      return this;
	    },
	    pipeCallback: function() {
	      var self = this;
	      return function(error) {
	        if (error != null) {
	          self.reject(error);
	          return;
	        }
	        var args = _Array_slice.call(arguments, 1);
	        fn_apply(self.resolve, self, args);
	      };
	    },
	    resolveDelegate: function() {
	      return fn_proxy(this.resolve, this);
	    },
	    rejectDelegate: function() {
	      return fn_proxy(this.reject, this);
	    }
	  };
	  class_Dfr.run = function(fn, ctx) {
	    var dfr = new class_Dfr();
	    if (ctx == null)
	      ctx = dfr;
	    fn.call(ctx, fn_proxy(dfr.resolve, ctx), fn_proxy(dfr.reject, dfr), dfr);
	    return dfr;
	  };
	  function dfr_bind(dfr, arguments_, listeners, callback) {
	    if (callback == null)
	      return dfr;
	    if (arguments_ != null)
	      fn_apply(callback, dfr, arguments_);
	    else
	      listeners.push(callback);
	    return dfr;
	  }
	  function dfr_clearListeners(dfr) {
	    dfr._done = null;
	    dfr._fail = null;
	    dfr._always = null;
	  }
	  function arr_callOnce(arr, ctx, args) {
	    if (arr == null)
	      return;
	    var imax = arr.length,
	        i = -1,
	        fn;
	    while (++i < imax) {
	      fn = arr[i];
	      if (fn)
	        fn_apply(fn, ctx, args);
	    }
	    arr.length = 0;
	  }
	  function isDeferred(x) {
	    if (x == null || typeof x !== 'object')
	      return false;
	    if (x instanceof class_Dfr)
	      return true;
	    return typeof x.done === 'function' && typeof x.fail === 'function';
	    ;
	  }
	}());
	var class_EventEmitter;
	(function() {
	  class_EventEmitter = function() {
	    this._listeners = {};
	  };
	  class_EventEmitter.prototype = {
	    on: function(event, fn) {
	      if (fn != null) {
	        (this._listeners[event] || (this._listeners[event] = [])).push(fn);
	      }
	      return this;
	    },
	    once: function(event, fn) {
	      if (fn != null) {
	        fn._once = true;
	        (this._listeners[event] || (this._listeners[event] = [])).push(fn);
	      }
	      return this;
	    },
	    pipe: function(event) {
	      var that = this,
	          args;
	      return function() {
	        args = _Array_slice.call(arguments);
	        args.unshift(event);
	        fn_apply(that.trigger, that, args);
	      };
	    },
	    emit: event_trigger,
	    trigger: event_trigger,
	    off: function(event, fn) {
	      var listeners = this._listeners[event];
	      if (listeners == null)
	        return this;
	      if (arguments.length === 1) {
	        listeners.length = 0;
	        return this;
	      }
	      var imax = listeners.length,
	          i = -1;
	      while (++i < imax) {
	        if (listeners[i] === fn) {
	          listeners.splice(i, 1);
	          i--;
	          imax--;
	        }
	      }
	      return this;
	    }
	  };
	  function event_trigger() {
	    var args = _Array_slice.call(arguments),
	        event = args.shift(),
	        fns = this._listeners[event],
	        fn,
	        imax,
	        i = 0;
	    if (fns == null)
	      return this;
	    for (imax = fns.length; i < imax; i++) {
	      fn = fns[i];
	      fn_apply(fn, this, args);
	      if (fn._once === true) {
	        fns.splice(i, 1);
	        i--;
	        imax--;
	      }
	    }
	    return this;
	  }
	}());
	"use strict";
	var class_Uri;
	(function() {
	  class_Uri = class_create({
	    protocol: null,
	    value: null,
	    path: null,
	    file: null,
	    extension: null,
	    constructor: function constructor(uri) {
	      if (uri == null) {
	        return this;
	      }
	      if (util_isUri(uri)) {
	        return uri.combine("");
	      }
	      uri = normalize_uri(uri);
	      this.value = uri;
	      parse_protocol(this);
	      parse_host(this);
	      parse_search(this);
	      parse_file(this);
	      this.path = normalize_pathsSlashes(this.value);
	      if (/^[\w]+:\//.test(this.path)) {
	        this.path = "/" + this.path;
	      }
	      return this;
	    },
	    cdUp: function cdUp() {
	      var path = this.path;
	      if (path == null || path === "" || path === "/") {
	        return this;
	      }
	      if (/^\/?[a-zA-Z]+:\/?$/.test(path)) {
	        return this;
	      }
	      this.path = path.replace(/\/?[^\/]+\/?$/i, "");
	      return this;
	    },
	    combine: function combine(path) {
	      if (util_isUri(path)) {
	        path = path.toString();
	      }
	      if (!path) {
	        return util_clone(this);
	      }
	      if (rgx_win32Drive.test(path)) {
	        return new class_Uri(path);
	      }
	      var uri = util_clone(this);
	      uri.value = path;
	      parse_search(uri);
	      parse_file(uri);
	      if (!uri.value) {
	        return uri;
	      }
	      path = uri.value.replace(/^\.\//i, "");
	      if (path[0] === "/") {
	        uri.path = path;
	        return uri;
	      }
	      while (/^(\.\.\/?)/ig.test(path)) {
	        uri.cdUp();
	        path = path.substring(3);
	      }
	      uri.path = normalize_pathsSlashes(util_combinePathes(uri.path, path));
	      return uri;
	    },
	    toString: function toString() {
	      var protocol = this.protocol ? this.protocol + "://" : "";
	      var path = util_combinePathes(this.host, this.path, this.file) + (this.search || "");
	      var str = protocol + path;
	      if (!(this.file || this.search)) {
	        str += "/";
	      }
	      return str;
	    },
	    toPathAndQuery: function toPathAndQuery() {
	      return util_combinePathes(this.path, this.file) + (this.search || "");
	    },
	    toRelativeString: function toRelativeString(uri) {
	      if (typeof uri === "string")
	        uri = new class_Uri(uri);
	      if (this.path.indexOf(uri.path) === 0) {
	        var p = this.path ? this.path.replace(uri.path, "") : "";
	        if (p[0] === "/")
	          p = p.substring(1);
	        return util_combinePathes(p, this.file) + (this.search || "");
	      }
	      var current = this.path.split("/"),
	          relative = uri.path.split("/"),
	          commonpath = "",
	          i = 0,
	          length = Math.min(current.length, relative.length);
	      for (; i < length; i++) {
	        if (current[i] === relative[i])
	          continue;
	        break;
	      }
	      if (i > 0)
	        commonpath = current.splice(0, i).join("/");
	      if (commonpath) {
	        var sub = "",
	            path = uri.path,
	            forward;
	        while (path) {
	          if (this.path.indexOf(path) === 0) {
	            forward = this.path.replace(path, "");
	            break;
	          }
	          path = path.replace(/\/?[^\/]+\/?$/i, "");
	          sub += "../";
	        }
	        return util_combinePathes(sub, forward, this.file);
	      }
	      return this.toString();
	    },
	    toLocalFile: function toLocalFile() {
	      var path = util_combinePathes(this.host, this.path, this.file);
	      return util_win32Path(path);
	    },
	    toLocalDir: function toLocalDir() {
	      var path = util_combinePathes(this.host, this.path, "/");
	      return util_win32Path(path);
	    },
	    toDir: function toDir() {
	      var str = this.protocol ? this.protocol + "://" : "";
	      return str + util_combinePathes(this.host, this.path, "/");
	    },
	    isRelative: function isRelative() {
	      return !(this.protocol || this.host);
	    },
	    getName: function getName() {
	      return this.file.replace("." + this.extension, "");
	    }
	  });
	  var rgx_protocol = /^([a-zA-Z]+):\/\//,
	      rgx_extension = /\.([\w\d]+)$/i,
	      rgx_win32Drive = /(^\/?\w{1}:)(\/|$)/,
	      rgx_fileWithExt = /([^\/]+(\.[\w\d]+)?)$/i;
	  function util_isUri(object) {
	    return object && typeof object === "object" && typeof object.combine === "function";
	  }
	  function util_combinePathes() {
	    var args = arguments,
	        str = "";
	    for (var i = 0,
	        x,
	        imax = arguments.length; i < imax; i++) {
	      x = arguments[i];
	      if (!x)
	        continue;
	      if (!str) {
	        str = x;
	        continue;
	      }
	      if (str[str.length - 1] !== "/")
	        str += "/";
	      str += x[0] === "/" ? x.substring(1) : x;
	    }
	    return str;
	  }
	  function normalize_pathsSlashes(str) {
	    if (str[str.length - 1] === "/") {
	      return str.substring(0, str.length - 1);
	    }
	    return str;
	  }
	  function util_clone(source) {
	    var uri = new class_Uri(),
	        key;
	    for (key in source) {
	      if (typeof source[key] === "string") {
	        uri[key] = source[key];
	      }
	    }
	    return uri;
	  }
	  function normalize_uri(str) {
	    return str.replace(/\\/g, "/").replace(/^\.\//, "").replace(/^(\w+):\/([^\/])/, "/$1:/$2");
	  }
	  function util_win32Path(path) {
	    if (rgx_win32Drive.test(path) && path[0] === "/") {
	      return path.substring(1);
	    }
	    return path;
	  }
	  function parse_protocol(obj) {
	    var match = rgx_protocol.exec(obj.value);
	    if (match == null && obj.value[0] === "/") {
	      obj.protocol = "file";
	    }
	    if (match == null) {
	      return;
	    }
	    obj.protocol = match[1];
	    obj.value = obj.value.substring(match[0].length);
	  }
	  function parse_host(obj) {
	    if (obj.protocol == null) {
	      return;
	    }
	    if (obj.protocol === "file") {
	      var match = rgx_win32Drive.exec(obj.value);
	      if (match) {
	        obj.host = match[1];
	        obj.value = obj.value.substring(obj.host.length);
	      }
	      return;
	    }
	    var pathStart = obj.value.indexOf("/", 2);
	    obj.host = ~pathStart ? obj.value.substring(0, pathStart) : obj.value;
	    obj.value = obj.value.replace(obj.host, "");
	  }
	  function parse_search(obj) {
	    var question = obj.value.indexOf("?");
	    if (question === -1) {
	      return;
	    }
	    obj.search = obj.value.substring(question);
	    obj.value = obj.value.substring(0, question);
	  }
	  function parse_file(obj) {
	    var match = rgx_fileWithExt.exec(obj.value),
	        file = match == null ? null : match[1];
	    if (file == null) {
	      return;
	    }
	    obj.file = file;
	    obj.value = obj.value.substring(0, obj.value.length - file.length);
	    obj.value = normalize_pathsSlashes(obj.value);
	    match = rgx_extension.exec(file);
	    obj.extension = match == null ? null : match[1];
	  }
	  class_Uri.combinePathes = util_combinePathes;
	  class_Uri.combine = util_combinePathes;
	})();
	function assert_TestDom(container, mix) {
	  for (var args = [],
	      $__0 = 2; $__0 < arguments.length; $__0++)
	    args[$__0 - 2] = arguments[$__0];
	  var arr = mix;
	  if (Array.isArray(mix) === false) {
	    arr = [mix];
	  }
	  arr = arr.map(function(x) {
	    if (typeof x !== 'string') {
	      return x;
	    }
	    var ast = mask.parse(x);
	    if (ast.type !== mask.Dom.FRAGMENT) {
	      ast = {nodes: [ast]};
	    }
	    return ast;
	  });
	  var model,
	      compo,
	      callback,
	      i = 0,
	      imax = args.length,
	      x;
	  for (; i < imax; i++) {
	    x = args[i];
	    if (typeof x === 'function') {
	      callback = x;
	      continue;
	    }
	    if (model != null) {
	      compo = x;
	      continue;
	    }
	    model = x;
	  }
	  function next(error) {
	    if (error) {
	      dfr.reject(error);
	      return;
	    }
	    if (arr.length === 0) {
	      dfr.resolve();
	      return;
	    }
	    var suite = arr.shift();
	    if (typeof suite === 'function') {
	      if (suite.length) {
	        suite(next);
	        return;
	      }
	      try {
	        suite();
	      } catch (error) {
	        next(error);
	        return;
	      }
	      next();
	      return;
	    }
	    var runner = new Runner(container, suite, model, compo);
	    runner.process().done((function() {
	      return next();
	    })).fail(next);
	  }
	  if (callback != null) {
	    dfr.done((function() {
	      return callback();
	    })).fail(callback);
	  }
	  eventLoop_skip5(next);
	  return dfr;
	}
	var is_JQuery;
	(function() {
	  is_JQuery = function(x) {
	    if (typeof x.jquery === 'string')
	      return true;
	    return x.constructor === $.fn.constructor;
	  };
	}());
	var obj_typeof,
	    obj_inherit,
	    obj_extend,
	    obj_keys;
	;
	(function() {
	  obj_typeof = function(x) {
	    return Object.prototype.toString.call(x).replace('[object ', '').replace(']', '');
	  };
	  obj_inherit = function(Ctor, base) {
	    function temp() {}
	    temp.prototype = base.prototype;
	    Ctor.prototype = new temp;
	  };
	  obj_keys = Object.keys ? Object.keys : getKeys;
	  obj_extend = function(target, source) {
	    if (target == null)
	      target = {};
	    if (source == null)
	      return target;
	    for (var key in source) {
	      target[key] = source[key];
	    }
	    return target;
	  };
	  function getKeys(obj) {
	    var keys = [];
	    for (var key in keys)
	      keys.push(key);
	    return keys;
	  }
	}());
	var log_error;
	(function() {
	  log_error = console.error.bind(console, '<TestDom>');
	}());
	var dfr_call,
	    dfr_bind,
	    dfr_clear;
	(function() {
	  dfr_call = function(cbs, args) {
	    if (cbs == null)
	      return;
	    for (var i = 0; i < cbs.length; i++) {
	      cbs[i].apply(null, args || []);
	    }
	  };
	  dfr_bind = function(dfr, type, cb) {
	    if (cb == null)
	      return;
	    var name = '_' + type + 'Cb';
	    var cbs = dfr[name];
	    if (cbs == null)
	      cbs = dfr[name] = [];
	    cbs.push(cb);
	  };
	  dfr_clear = function(dfr) {
	    arr_clear(dfr._rejectCb);
	    arr_clear(dfr._alwaysCb);
	    arr_clear(dfr._resolveCb);
	  };
	  function arr_clear(arr) {
	    if (arr != null)
	      arr.length = 0;
	  }
	}());
	var node_evalMany,
	    node_eval;
	(function() {
	  node_evalMany = function() {
	    for (var args = [],
	        $__0 = 0; $__0 < arguments.length; $__0++)
	      args[$__0] = arguments[$__0];
	    args.unshift(mask.Utils.Expression.evalStatements);
	    return run.apply(null, args);
	  };
	  node_eval = function() {
	    for (var args = [],
	        $__1 = 0; $__1 < arguments.length; $__1++)
	      args[$__1] = arguments[$__1];
	    args.unshift(mask.Utils.Expression.evalStatements);
	    return run.apply(null, args)[0];
	  };
	  function run(fn, node, model, compo) {
	    if (node.expression == null) {
	      var attr = node.attr,
	          arr = [];
	      for (var key in attr) {
	        if (key === attr[key]) {
	          arr.push(key);
	        }
	      }
	      if (arr.length !== 0)
	        return arr;
	      var obj = {},
	          count = 0;
	      for (var key in attr) {
	        obj[key] = attr[key];
	        count++;
	      }
	      if (count > 0)
	        return [obj];
	      log_error('Expression expected for', node.tagName);
	      return null;
	    }
	    if (node.expression === '')
	      return [];
	    return fn(node.expression, model, null, compo);
	  }
	}());
	var assert_isAlias,
	    assert_runAlias,
	    assert_isJQuery,
	    assert_runJQuery,
	    assert_getFn,
	    assert_test;
	(function() {
	  assert_isAlias = function(name) {
	    return $.fn[name] != null;
	  };
	  assert_runAlias = function($el, name, args, attr) {
	    if ($el.eq_ != null) {
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
	  assert_isJQuery = function(name) {
	    return assert.$[name + '_'] != null;
	  };
	  assert_runJQuery = function($el, name, args, attr) {
	    assert.$[name + '_'].apply($el, [$el].concat(args));
	  };
	  assert_getFn = function(name) {
	    return check(assert_isJQuery, assert_runJQuery) || check(assert_isAlias, assert_runAlias);
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
	    assert[name].apply(assert, [ctx].concat(args));
	  };
	}());
	var eventLoop_skip5;
	(function() {
	  eventLoop_skip5 = nTickDelegate(5);
	  function nTickDelegate(ticks) {
	    return function(fn) {
	      var count = ticks;
	      function tickFn() {
	        if (--count < 0) {
	          return fn();
	        }
	        setTimeout(tickFn);
	      }
	      ;
	      tickFn();
	    };
	  }
	}());
	var Traverser = {};
	(function() {
	  [['find', 'filter', findNative], ['filter'], ['closest'], ['children'], ['siblings']].forEach((function(x) {
	    var $__0 = x,
	        name = $__0[0],
	        fallback = $__0[1],
	        customFn = $__0[2];
	    Traverser[name] = create(name, fallback, customFn);
	  }));
	  obj_extend(Traverser, {'__eq__': create('eq')});
	  function create(name, fallback, customFn) {
	    return function assert_Traverse(current) {
	      var selector = current.node.expression;
	      if (/^\s*('|")/.test(selector)) {
	        selector = node_eval(current.node);
	      }
	      var x = current.$[name](selector);
	      if (x.length === 0 && fallback) {
	        x = current.$[fallback](selector);
	      }
	      if (x.length === 0 && customFn) {
	        x = customFn(current.$, selector);
	      }
	      assert.notEqual(x.length, 0, ("Selector does not matched any elements: " + name + "(" + selector + ")"));
	      current.$ = x;
	    };
	  }
	  function findNative($el, selector) {
	    var set = $(),
	        imax = $el.length,
	        i = -1,
	        arr,
	        x;
	    while (++i < imax) {
	      x = $el[i];
	      if (x.querySelectorAll == null)
	        continue;
	      arr = x.querySelectorAll(selector);
	      set = set.add(arr);
	    }
	    return set;
	  }
	}());
	var Simulate;
	(function() {
	  Simulate = {
	    $$run: function(event, runner, current, done) {
	      runner.ensureInDom_();
	      var fn = Simulate[event];
	      if (fn) {
	        fn(runner, current, done);
	        return;
	      }
	      current.$.simulate(event, current.node.attr);
	      setTimeout(done);
	    },
	    'press': function(runner, current, done) {
	      var str = node_eval(current.node);
	      current.$.simulate('key-combo', {combo: str});
	      setTimeout(done);
	    },
	    'type': function(runner, current, done) {
	      var str = node_eval(current.node);
	      current.$.simulate('key-sequence', {
	        sequence: str,
	        delay: 10,
	        callback: function() {
	          current.$.removeData('simulate-keySequence.selection').off('keyup.simulate-keySequence').off('mouseup.simulate-keySequence');
	          ;
	          done();
	        }
	      });
	    },
	    'select': function(runner, current, done) {
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
	  function select_Option(el, str) {
	    var opts,
	        opt = find(byText);
	    if (opt == null)
	      opt = find(byAttr('value'));
	    if (opt == null)
	      opt = find(byAttr('name'));
	    if (opt == null)
	      opt = find(byAttr('id'));
	    assert.notEqual(opt, null, 'Option not found: ' + str);
	    var $__0 = opt,
	        $opt = $__0[0],
	        index = $__0[1];
	    el.get(0).selectedIndex = index;
	    $opt.simulate('click');
	    el.trigger('change');
	    function byText($el, i) {
	      var txt = $el.text();
	      return txt.trim().indexOf(str) !== -1;
	    }
	    function byAttr(name) {
	      return function($el) {
	        return $el.attr(name).trim() === str;
	      };
	    }
	    function find(fn) {
	      if (opts == null)
	        opts = el.children('option');
	      var imax = opts.length,
	          i = 0,
	          x;
	      for (; i < imax; i++) {
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
	    var str = args[0];
	    if (typeof str === 'string') {
	      var start = txt.indexOf(str);
	      if (start !== -1) {
	        select(start, start + str.length);
	      }
	      return;
	    }
	    var $__1 = args,
	        start = $__1[0],
	        end = $__1[1];
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
	var Actions;
	(function() {
	  Actions = {
	    'with': function(runner, current, done) {
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
	    'debugger': function(runner, current, done) {
	      var ctx = current.$;
	      debugger;
	      done();
	    },
	    'slot': function(runner, current, done) {
	      var fn = current.node.fn;
	      if (fn.length === 3) {
	        fn(current.$, runner.wrapAssertion_(), done);
	        return;
	      }
	      fn(current.$, runner.wrapAssertion_());
	      done();
	    },
	    'do': function(runner, current, done) {
	      Simulate.$$run(resolveAttrFirst(current.node), runner, current, done);
	    },
	    'trigger': function(runner, current, done) {
	      var args = node_evalMany(current.node, runner.model, runner.compo);
	      current.$.trigger.apply(current.$, args);
	      setTimeout(done, 16);
	    },
	    'call': function(runner, current, done) {
	      var name = resolveAttrFirst(current.node);
	      assert.is(current.$[name], 'Function');
	      var args = node_evalMany(current.node, runner.model, runner.compo);
	      current.$[name].apply(current.$, args);
	      setTimeout(done);
	    },
	    'await': function(runner, current, done) {
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
	          assert(false, ("<await> Elements are not resolved: " + selector));
	        }
	        Traverser.find(current);
	        done();
	      }
	      check();
	    },
	    'selection': function(runner, current, done) {
	      var expression = current.node.expression;
	      if (expression == null) {
	        throw Error('`caret` node expect expression: position number');
	      }
	      var pos = mask.Utils.Expression.evalStatements(expression);
	      var start = pos[0],
	          end = pos[1] || start;
	      setSelectionRange(current.$.get(0), start, end);
	      setTimeout(done, 16);
	    }
	  };
	  function resolveAttrFirst(node) {
	    var x;
	    for (x in node.attr)
	      break;
	    delete node.attr[x];
	    return x;
	  }
	  function setSelectionRange(input, selectionStart, selectionEnd) {
	    if (input.setSelectionRange) {
	      input.focus();
	      input.setSelectionRange(selectionStart, selectionEnd);
	    } else if (input.createTextRange) {
	      var range = input.createTextRange();
	      range.collapse(true);
	      range.moveEnd('character', selectionEnd);
	      range.moveStart('character', selectionStart);
	      range.select();
	    }
	  }
	  function setCaretToPos(input, pos) {
	    setSelectionRange(input, pos, pos);
	  }
	}());
	obj_extend(Actions, {hasClass: function(compo, current, done) {
	    var args = node_evalMany(current.node);
	    var fn = assert_getFn('hasClass');
	    if (args.length === 1) {
	      args.push(true);
	    }
	    fn(current.$, 'hasClass', args, current.node.attr);
	    done();
	  }});
	var Events;
	(function() {
	  Events = ["blur", "focus", "load", "resize", "scroll", "unload", "beforeunload", "click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseover", "mouseout", "mouseenter", "mouseleave", "change", "select", "submit", "keydown", "keypress", "keyup", "type", "press"];
	}());
	var options = {report: null};
	(function() {
	  assert_TestDom.config = function(mix) {
	    if (typeof mix === 'sttring') {
	      return options[mix];
	    }
	    obj_extend(options, mix);
	    return assert_TestDom;
	  };
	}());
	var Reporter,
	    ProgressReporter_DOM;
	(function() {
	  Reporter = {report: function(error, runner) {
	      if (options.report) {
	        options.report(error);
	        return;
	      }
	      if (__assert) {
	        if (__assert.ifError) {
	          __assert.ifError(error);
	          return;
	        }
	        if (error != null && __assert.fail) {
	          __assert.fail(error);
	          return;
	        }
	      }
	      if (error) {
	        throw error;
	      }
	    }};
	  ProgressReporter_DOM = function(el) {
	    var lines = [];
	    var pre = mask.render("\n\t\t\tpre > +each(.) > div {\n\t\t\t\tspan style='color: ~[: errored ? \"red\" : \"green\"]' > '~[hint]'\n\t\t\t\tspan > '~[text]'\n\t\t\t}\n\t\t", lines);
	    el.appendChild(pre);
	    return function(runner, node, error) {
	      lines.push({
	        text: runner.formatCurrentLine_(error),
	        hint: error ? '✘ ' : '✓ ',
	        errored: Boolean(error)
	      });
	      if (error) {
	        lines.push({
	          text: String(error),
	          hint: ' '
	        });
	      }
	    };
	  };
	}());
	var Runner = class_create(class_EventEmitter, class_Dfr, {
	  constructor: function Runner(container, node, model, compo) {
	    if (container.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
	      container = container.childNodes;
	    }
	    if (container.nodeType === Node.DOCUMENT_NODE) {
	      container = container.body;
	    }
	    this.model = model;
	    this.compo = compo;
	    var domLib = this.getDomLibrary_(container);
	    this.$ = domLib(container);
	    this.stack = [{
	      $: this.$,
	      node: node
	    }];
	    this.errors = [];
	    this.process = this.process.bind(this);
	    this.next_ = this.next_.bind(this);
	    this.backtrace = new Error().stack;
	    if (this.$.length === 0) {
	      this.report_(Error('No elements to test <root>'));
	    }
	  },
	  attachReporter: function(Reporter) {
	    new Reporter(this);
	    return this;
	  },
	  getCurrent_: function() {
	    return this.stack[this.stack.length - 1];
	  },
	  getCurrentModel_: function() {
	    var el = this.getCurrent_().$;
	    if (el.model) {
	      return el.model() || this.model;
	    }
	    return this.model;
	  },
	  getCurrentCompo_: function() {
	    var el = this.getCurrent_().$;
	    if (el.compo) {
	      return el.compo() || this.compo;
	    }
	    return this.compo;
	  },
	  getCurrentArgs_: function() {
	    var current = this.getCurrent_();
	    return node_evalMany(current.node, this.getCurrentModel_(), this.getCurrentCompo_());
	  },
	  getNext_: function(goDeep) {
	    var current = this.getCurrent_();
	    if (current == null)
	      return null;
	    if (goDeep !== false && current.node.nodes) {
	      this.stack.push({
	        $: current.$,
	        node: current.node.nodes[0]
	      });
	      return this.getCurrent_();
	    }
	    this.stack.pop();
	    while (this.stack.length > 0) {
	      var parent = this.getCurrent_(),
	          nodes = parent.node.nodes,
	          index = nodes.indexOf(current.node);
	      if (index >= nodes.length - 1) {
	        current = this.stack.pop();
	        continue;
	      }
	      if (index === -1) {
	        console.error('Node not found');
	        current = this.stack.pop();
	        continue;
	      }
	      this.stack.push({
	        $: parent.$,
	        node: nodes[index + 1]
	      });
	      return this.getCurrent_();
	    }
	    return null;
	  },
	  getDomLibrary_: function(mix) {
	    var el = mix != null && (typeof mix.length === 'number' ? mix[0] : mix);
	    if (el == null) {
	      return global.$;
	    }
	    var win = el.ownerDocument.defaultView;
	    var $ = win.$ || win.jQuery || window.$ || window.jQuery || mask.Compo.config.getDOMLibrary();
	    $.fn.simulate = global.$.fn.simulate;
	    return $;
	  },
	  process: function assert_TestDom(error) {
	    var current = this.getNext_(error == null);
	    if (current == null) {
	      this.emit('complete', this.errors);
	      if (this.errors.length) {
	        this.reject(this.errors);
	      } else {
	        this.resolve();
	      }
	      return;
	    }
	    var name = current.node.tagName;
	    var traverser = Traverser[name];
	    if (traverser) {
	      var error = this.run_(traverser, [current]);
	      this.next_(error);
	      return;
	    }
	    if (Events.indexOf(name) !== -1) {
	      this.run_(Simulate.$$run, [name, this, current, this.next_]);
	      return;
	    }
	    var action = Actions[name];
	    if (action) {
	      this.run_(action, [this, current, this.next_]);
	      return;
	    }
	    var args = this.getCurrentArgs_();
	    var ctx = current.$;
	    if (name === 'eq' && args.length === 1) {
	      var traverser = Traverser.__eq__;
	      var error = this.run_(traverser, [current]);
	      this.next_(error);
	      return;
	    }
	    if (is_JQuery(ctx)) {
	      var fn = assert_getFn(name);
	      if (fn) {
	        var err = this.run_(fn, [ctx, name, args, current.node.attr]);
	        this.next_(err);
	        return;
	      }
	      log_error('Uknown test function: ', name);
	      this.next_();
	      return;
	    }
	    var err = this.run_(assert_test, [ctx, name, args]);
	    this.next_(err);
	  },
	  next_: function(error) {
	    this.emit('progress', this, this.getCurrent_().node, error);
	    this.process(error);
	  },
	  run_: function(fn, args, ctx) {
	    var error;
	    try {
	      fn.apply(ctx, args);
	    } catch (err) {
	      error = err;
	    }
	    this.report_(error);
	    var next = args[args.length - 1];
	    if (error != null && typeof next === 'function') {
	      next(error);
	    }
	    return error;
	  },
	  report_: function(error) {
	    error = this.prepairError_(error);
	    Reporter.report(error, this);
	    this.emit(error ? 'fail' : 'success', error);
	    if (error) {
	      this.errors.push(error);
	    }
	  },
	  formatCurrentLine_: function(error) {
	    var node = this.getCurrent_().node,
	        indent = '';
	    var parent = node.parent;
	    while (parent != null && parent.type !== mask.Dom.FRAGMENT) {
	      indent += '  ';
	      parent = parent.parent;
	    }
	    return indent + mask.stringify({
	      tagName: node.tagName,
	      attr: node.attr,
	      expression: node.expression
	    }, 2).slice(0, -1);
	  },
	  prepairError_: function(error) {
	    if (error == null)
	      return null;
	    var node = this.getCurrent_().node,
	        tmpl = mask.stringify(node, 2),
	        lines = tmpl.split('\n');
	    if (lines.length > 7) {
	      tmpl = lines.splice(0, 6).join('\n');
	    }
	    Object.defineProperty(error, 'stack', {
	      value: tmpl + '\n' + assert.prepairStack(this.backtrace),
	      writable: true,
	      enumerable: true,
	      configurable: true
	    });
	    error.generatedMessage = false;
	    return error;
	  },
	  ensureInDom_: function() {
	    var $__0 = this;
	    this.ensureInDom_ = function() {};
	    var parent = this.$.get(0).parentNode,
	        inPage = false;
	    while (parent != null) {
	      if (parent.nodeType === Node.DOCUMENT_NODE) {
	        inPage = true;
	        break;
	      }
	      parent = parent.parentNode;
	    }
	    if (inPage)
	      return;
	    this.$.appendTo('body');
	    this.done((function() {
	      return $__0.$.remove();
	    }));
	  },
	  assert: null,
	  wrapAssertion_: function() {
	    var $__0 = this;
	    if (this.assert != null)
	      return this.assert;
	    var wrap = (function(key) {
	      return (function() {
	        for (var args = [],
	            $__1 = 0; $__1 < arguments.length; $__1++)
	          args[$__1] = arguments[$__1];
	        return $__0.run_(key && assert[key] || assert, args);
	      });
	    });
	    ;
	    this.assert = wrap();
	    for (var key in assert) {
	      if (typeof assert[key] === 'function') {
	        this.assert[key] = wrap(key);
	      }
	    }
	    return this.assert;
	  }
	});
	var compo_domtest;
	(function() {
	  compo_domtest = function(mix, model) {
	    if (typeof mix !== 'string') {
	      return test(mix);
	    }
	    var compo = new Compo;
	    mask.render(mix, model, null, null, compo);
	    return test(compo);
	  };
	  function test(compo) {
	    var u = compo.findAll(':utest'),
	        count = u.length,
	        dfr = new class_Dfr;
	    if (count === 0) {
	      __assert(false, 'No `:utest` components found');
	      return dfr.reject();
	    }
	    u.forEach((function(test) {
	      DomTest(test.$, test).done((function() {
	        if (--count === 0)
	          dfr.resolve();
	      }));
	    }));
	    return dfr;
	  }
	  mask.registerHandler(':utest', mask.Compo({render: function(model, ctx, container) {
	      if (container.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
	        container = container.childNodes;
	      this.$ = $(container);
	    }}));
	}());
	assert_TestDom.create = assert_TestDom;
	assert_TestDom.compo = compo_domtest;
	assert_TestDom.ProgressReporters = {Dom: ProgressReporter_DOM};
	
	//# sourceMappingURL=exports.es6.map
	// end:source /src/exports.es6
	
	return assert_TestDom;
}));

// source /src/jquery_simulate.es6
if (typeof jQuery !== 'undefined') {
  (function($) {
    if ($.simulate && $.simulate.prototype.simulateKeyCombo) {
      return;
    }
    ;
    (function($, undefined) {
      "use strict";
      var rkeyEvent = /^key/,
          rmouseEvent = /^(?:mouse|contextmenu)|click/,
          rdocument = /\[object (?:HTML)?Document\]/;
      function isDocument(ele) {
        return rdocument.test(Object.prototype.toString.call(ele));
      }
      function windowOfDocument(doc) {
        for (var i = 0; i < window.frames.length; i += 1) {
          if (window.frames[i].document === doc) {
            return window.frames[i];
          }
        }
        return window;
      }
      $.fn.simulate = function(type, options) {
        return this.each(function() {
          new $.simulate(this, type, options);
        });
      };
      $.simulate = function(elem, type, options) {
        var method = $.camelCase("simulate-" + type);
        this.target = elem;
        this.options = options || {};
        if (this[method]) {
          this[method]();
        } else {
          this.simulateEvent(elem, type, this.options);
        }
      };
      $.extend($.simulate, {
        keyCode: {
          BACKSPACE: 8,
          COMMA: 188,
          DELETE: 46,
          DOWN: 40,
          END: 35,
          ENTER: 13,
          ESCAPE: 27,
          HOME: 36,
          LEFT: 37,
          NUMPAD_ADD: 107,
          NUMPAD_DECIMAL: 110,
          NUMPAD_DIVIDE: 111,
          NUMPAD_ENTER: 108,
          NUMPAD_MULTIPLY: 106,
          NUMPAD_SUBTRACT: 109,
          PAGE_DOWN: 34,
          PAGE_UP: 33,
          PERIOD: 190,
          RIGHT: 39,
          SPACE: 32,
          TAB: 9,
          UP: 38
        },
        buttonCode: {
          LEFT: 0,
          MIDDLE: 1,
          RIGHT: 2
        }
      });
      $.extend($.simulate.prototype, {
        simulateEvent: function(elem, type, options) {
          var event = this.createEvent(type, options);
          this.dispatchEvent(elem, type, event, options);
        },
        createEvent: function(type, options) {
          if (rkeyEvent.test(type)) {
            return this.keyEvent(type, options);
          }
          if (rmouseEvent.test(type)) {
            return this.mouseEvent(type, options);
          }
        },
        mouseEvent: function(type, options) {
          var event,
              eventDoc,
              doc = isDocument(this.target) ? this.target : (this.target.ownerDocument || document),
              docEle,
              body;
          options = $.extend({
            bubbles: true,
            cancelable: (type !== "mousemove"),
            view: windowOfDocument(doc),
            detail: 0,
            screenX: 0,
            screenY: 0,
            clientX: 1,
            clientY: 1,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            button: 0,
            relatedTarget: undefined
          }, options);
          if (doc.createEvent) {
            event = doc.createEvent("MouseEvents");
            event.initMouseEvent(type, options.bubbles, options.cancelable, options.view, options.detail, options.screenX, options.screenY, options.clientX, options.clientY, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, options.relatedTarget || doc.body.parentNode);
            if (event.pageX === 0 && event.pageY === 0 && Object.defineProperty) {
              eventDoc = isDocument(event.relatedTarget) ? event.relatedTarget : (event.relatedTarget.ownerDocument || document);
              docEle = eventDoc.documentElement;
              body = eventDoc.body;
              Object.defineProperty(event, "pageX", {get: function() {
                  return options.clientX + (docEle && docEle.scrollLeft || body && body.scrollLeft || 0) - (docEle && docEle.clientLeft || body && body.clientLeft || 0);
                }});
              Object.defineProperty(event, "pageY", {get: function() {
                  return options.clientY + (docEle && docEle.scrollTop || body && body.scrollTop || 0) - (docEle && docEle.clientTop || body && body.clientTop || 0);
                }});
            }
          } else if (doc.createEventObject) {
            event = doc.createEventObject();
            $.extend(event, options);
            event.button = {
              0: 1,
              1: 4,
              2: 2
            }[event.button] || event.button;
          }
          return event;
        },
        keyEvent: function(type, options) {
          var event,
              doc;
          options = $.extend({
            bubbles: true,
            cancelable: true,
            view: windowOfDocument(doc),
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            keyCode: 0,
            charCode: undefined
          }, options);
          doc = isDocument(this.target) ? this.target : (this.target.ownerDocument || document);
          if (doc.createEvent) {
            try {
              event = doc.createEvent("KeyEvents");
              event.initKeyEvent(type, options.bubbles, options.cancelable, options.view, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.keyCode, options.charCode);
            } catch (err) {
              event = doc.createEvent("Events");
              event.initEvent(type, options.bubbles, options.cancelable);
              $.extend(event, {
                view: options.view,
                ctrlKey: options.ctrlKey,
                altKey: options.altKey,
                shiftKey: options.shiftKey,
                metaKey: options.metaKey,
                keyCode: options.keyCode,
                charCode: options.charCode
              });
            }
          } else if (doc.createEventObject) {
            event = doc.createEventObject();
            $.extend(event, options);
          }
          if (!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()) || (({}).toString.call(window.opera) === "[object Opera]")) {
            event.keyCode = (options.charCode > 0) ? options.charCode : options.keyCode;
            event.charCode = undefined;
          }
          return event;
        },
        dispatchEvent: function(elem, type, event, options) {
          if (options.jQueryTrigger === true) {
            $(elem).trigger($.extend({}, event, options, {type: type}));
          } else if (elem.dispatchEvent) {
            elem.dispatchEvent(event);
          } else if (elem.fireEvent) {
            elem.fireEvent("on" + type, event);
          }
        },
        simulateFocus: function() {
          var focusinEvent,
              triggered = false,
              $element = $(this.target);
          function trigger() {
            triggered = true;
          }
          $element.bind("focus", trigger);
          $element[0].focus();
          if (!triggered) {
            focusinEvent = $.Event("focusin");
            focusinEvent.preventDefault();
            $element.trigger(focusinEvent);
            $element.triggerHandler("focus");
          }
          $element.unbind("focus", trigger);
        },
        simulateBlur: function() {
          var focusoutEvent,
              triggered = false,
              $element = $(this.target);
          function trigger() {
            triggered = true;
          }
          $element.bind("blur", trigger);
          $element[0].blur();
          setTimeout(function() {
            if ($element[0].ownerDocument.activeElement === $element[0]) {
              $element[0].ownerDocument.body.focus();
            }
            if (!triggered) {
              focusoutEvent = $.Event("focusout");
              focusoutEvent.preventDefault();
              $element.trigger(focusoutEvent);
              $element.triggerHandler("blur");
            }
            $element.unbind("blur", trigger);
          }, 1);
        }
      });
      function findCenter(elem) {
        var offset,
            $document,
            $elem = $(elem);
        if (isDocument($elem[0])) {
          $document = $elem;
          offset = {
            left: 0,
            top: 0
          };
        } else {
          $document = $($elem[0].ownerDocument || document);
          offset = $elem.offset();
        }
        return {
          x: offset.left + $elem.outerWidth() / 2 - $document.scrollLeft(),
          y: offset.top + $elem.outerHeight() / 2 - $document.scrollTop()
        };
      }
      function findCorner(elem) {
        var offset,
            $document,
            $elem = $(elem);
        if (isDocument($elem[0])) {
          $document = $elem;
          offset = {
            left: 0,
            top: 0
          };
        } else {
          $document = $($elem[0].ownerDocument || document);
          offset = $elem.offset();
        }
        return {
          x: offset.left - document.scrollLeft(),
          y: offset.top - document.scrollTop()
        };
      }
      $.extend($.simulate.prototype, {simulateDrag: function() {
          var i = 0,
              target = this.target,
              options = this.options,
              center = options.handle === "corner" ? findCorner(target) : findCenter(target),
              x = Math.floor(center.x),
              y = Math.floor(center.y),
              coord = {
                clientX: x,
                clientY: y
              },
              dx = options.dx || (options.x !== undefined ? options.x - x : 0),
              dy = options.dy || (options.y !== undefined ? options.y - y : 0),
              moves = options.moves || 3;
          this.simulateEvent(target, "mousedown", coord);
          for (; i < moves; i++) {
            x += dx / moves;
            y += dy / moves;
            coord = {
              clientX: Math.round(x),
              clientY: Math.round(y)
            };
            this.simulateEvent(target.ownerDocument, "mousemove", coord);
          }
          if ($.contains(document, target)) {
            this.simulateEvent(target, "mouseup", coord);
            this.simulateEvent(target, "click", coord);
          } else {
            this.simulateEvent(document, "mouseup", coord);
          }
        }});
    })(jQuery);
    (function() {
      var focusEvent = 'onfocusin' in document.createElement('input') ? 'focusin' : 'focus';
      var n = document.createElement('div');
      n.appendChild(document.createTextNode('x-'));
      n.appendChild(document.createTextNode('x'));
      n.normalize();
      var canNormalize = n.firstChild.length == 3;
      bililiteRange = function(el, debug) {
        var ret;
        if (debug) {
          ret = new NothingRange();
        } else if (window.getSelection && el.setSelectionRange) {
          try {
            el.selectionStart;
            ret = new InputRange();
          } catch (e) {
            ret = new NothingRange();
          }
        } else if (window.getSelection) {
          ret = new W3CRange();
        } else if (document.selection) {
          ret = new IERange();
        } else {
          ret = new NothingRange();
        }
        ret._el = el;
        ret._doc = el.ownerDocument;
        ret._win = 'defaultView' in ret._doc ? ret._doc.defaultView : ret._doc.parentWindow;
        ret._textProp = textProp(el);
        ret._bounds = [0, ret.length()];
        if (!('bililiteRangeMouseDown' in ret._doc)) {
          var _doc = {_el: ret._doc};
          ret._doc.bililiteRangeMouseDown = false;
          bililiteRange.fn.listen.call(_doc, 'mousedown', function() {
            ret._doc.bililiteRangeMouseDown = true;
          });
          bililiteRange.fn.listen.call(_doc, 'mouseup', function() {
            ret._doc.bililiteRangeMouseDown = false;
          });
        }
        if (!('bililiteRangeSelection' in el)) {
          function trackSelection(evt) {
            if (evt && evt.which == 9) {
              ret._nativeSelect(ret._nativeRange(el.bililiteRangeSelection));
            } else {
              el.bililiteRangeSelection = ret._nativeSelection();
            }
          }
          trackSelection();
          if ('onbeforedeactivate' in el) {
            ret.listen('beforedeactivate', trackSelection);
          } else {
            ret.listen('mouseup', trackSelection).listen('keyup', trackSelection);
          }
          ret.listen(focusEvent, function() {
            if (!ret._doc.bililiteRangeMouseDown) {
              ret._nativeSelect(ret._nativeRange(el.bililiteRangeSelection));
            }
          });
        }
        if (!('oninput' in el)) {
          var inputhack = function() {
            ret.dispatch({type: 'input'});
          };
          ret.listen('keyup', inputhack);
          ret.listen('cut', inputhack);
          ret.listen('paste', inputhack);
          ret.listen('drop', inputhack);
          el.oninput = 'patched';
        }
        return ret;
      };
      function textProp(el) {
        if (typeof el.value != 'undefined')
          return 'value';
        if (typeof el.text != 'undefined')
          return 'text';
        if (typeof el.textContent != 'undefined')
          return 'textContent';
        return 'innerText';
      }
      function Range() {}
      Range.prototype = {
        length: function() {
          return this._el[this._textProp].replace(/\r/g, '').length;
        },
        bounds: function(s) {
          if (bililiteRange.bounds[s]) {
            this._bounds = bililiteRange.bounds[s].apply(this);
          } else if (s) {
            this._bounds = s;
          } else {
            var b = [Math.max(0, Math.min(this.length(), this._bounds[0])), Math.max(0, Math.min(this.length(), this._bounds[1]))];
            b[1] = Math.max(b[0], b[1]);
            return b;
          }
          return this;
        },
        select: function() {
          var b = this._el.bililiteRangeSelection = this.bounds();
          if (this._el === this._doc.activeElement) {
            this._nativeSelect(this._nativeRange(b));
          }
          this.dispatch({type: 'select'});
          return this;
        },
        text: function(text, select) {
          if (arguments.length) {
            var bounds = this.bounds(),
                el = this._el;
            this.dispatch({
              type: 'beforeinput',
              data: text,
              bounds: bounds
            });
            this._nativeSetText(text, this._nativeRange(bounds));
            if (select == 'start') {
              this.bounds([bounds[0], bounds[0]]);
            } else if (select == 'end') {
              this.bounds([bounds[0] + text.length, bounds[0] + text.length]);
            } else if (select == 'all') {
              this.bounds([bounds[0], bounds[0] + text.length]);
            }
            this.dispatch({
              type: 'input',
              data: text,
              bounds: bounds
            });
            return this;
          } else {
            return this._nativeGetText(this._nativeRange(this.bounds())).replace(/\r/g, '');
          }
        },
        insertEOL: function() {
          this._nativeEOL();
          this._bounds = [this._bounds[0] + 1, this._bounds[0] + 1];
          return this;
        },
        sendkeys: function(text) {
          var self = this;
          this.data().sendkeysOriginalText = this.text();
          this.data().sendkeysBounds = undefined;
          function simplechar(rng, c) {
            if (/^{[^}]*}$/.test(c))
              c = c.slice(1, -1);
            for (var i = 0; i < c.length; ++i) {
              var x = c.charCodeAt(i);
              rng.dispatch({
                type: 'keypress',
                keyCode: x,
                which: x,
                charCode: x
              });
            }
            rng.text(c, 'end');
          }
          text.replace(/{[^}]*}|[^{]+|{/g, function(part) {
            (bililiteRange.sendkeys[part] || simplechar)(self, part, simplechar);
          });
          this.bounds(this.data().sendkeysBounds);
          this.dispatch({
            type: 'sendkeys',
            which: text
          });
          return this;
        },
        top: function() {
          return this._nativeTop(this._nativeRange(this.bounds()));
        },
        scrollIntoView: function(scroller) {
          var top = this.top();
          if (this._el.scrollTop > top || this._el.scrollTop + this._el.clientHeight < top) {
            if (scroller) {
              scroller.call(this._el, top);
            } else {
              this._el.scrollTop = top;
            }
          }
          return this;
        },
        wrap: function(n) {
          this._nativeWrap(n, this._nativeRange(this.bounds()));
          return this;
        },
        selection: function(text) {
          if (arguments.length) {
            return this.bounds('selection').text(text, 'end').select();
          } else {
            return this.bounds('selection').text();
          }
        },
        clone: function() {
          return bililiteRange(this._el).bounds(this.bounds());
        },
        all: function(text) {
          if (arguments.length) {
            this.dispatch({
              type: 'beforeinput',
              data: text
            });
            this._el[this._textProp] = text;
            this.dispatch({
              type: 'input',
              data: text
            });
            return this;
          } else {
            return this._el[this._textProp].replace(/\r/g, '');
          }
        },
        element: function() {
          return this._el;
        },
        dispatch: function(opts) {
          opts = opts || {};
          var event = document.createEvent ? document.createEvent('CustomEvent') : this._doc.createEventObject();
          event.initCustomEvent && event.initCustomEvent(opts.type, !!opts.bubbles, !!opts.cancelable, opts.detail);
          for (var key in opts)
            event[key] = opts[key];
          var el = this._el;
          setTimeout(function() {
            try {
              el.dispatchEvent ? el.dispatchEvent(event) : el.fireEvent("on" + opts.type, document.createEventObject());
            } catch (e) {
              var listeners = el['listen' + opts.type];
              if (listeners)
                for (var i = 0; i < listeners.length; ++i) {
                  listeners[i].call(el, event);
                }
            }
          }, 0);
          return this;
        },
        listen: function(type, func) {
          var el = this._el;
          if (el.addEventListener) {
            el.addEventListener(type, func);
          } else {
            el.attachEvent("on" + type, func);
            var listeners = el['listen' + type] = el['listen' + type] || [];
            listeners.push(func);
          }
          return this;
        },
        dontlisten: function(type, func) {
          var el = this._el;
          if (el.removeEventListener) {
            el.removeEventListener(type, func);
          } else
            try {
              el.detachEvent("on" + type, func);
            } catch (e) {
              var listeners = el['listen' + type];
              if (listeners)
                for (var i = 0; i < listeners.length; ++i) {
                  if (listeners[i] === func)
                    listeners[i] = function() {};
                }
            }
          return this;
        }
      };
      bililiteRange.fn = Range.prototype;
      bililiteRange.extend = function(fns) {
        for (fn in fns)
          Range.prototype[fn] = fns[fn];
      };
      bililiteRange.bounds = {
        all: function() {
          return [0, this.length()];
        },
        start: function() {
          return [0, 0];
        },
        end: function() {
          return [this.length(), this.length()];
        },
        selection: function() {
          if (this._el === this._doc.activeElement) {
            this.bounds('all');
            return this._nativeSelection();
          } else {
            return this._el.bililiteRangeSelection;
          }
        }
      };
      bililiteRange.sendkeys = {
        '{enter}': function(rng) {
          simplechar(rng, '\n');
          rng.insertEOL();
        },
        '{tab}': function(rng, c, simplechar) {
          simplechar(rng, '\t');
        },
        '{newline}': function(rng, c, simplechar) {
          simplechar(rng, '\n');
        },
        '{backspace}': function(rng) {
          var b = rng.bounds();
          if (b[0] == b[1])
            rng.bounds([b[0] - 1, b[0]]);
          rng.text('', 'end');
        },
        '{del}': function(rng) {
          var b = rng.bounds();
          if (b[0] == b[1])
            rng.bounds([b[0], b[0] + 1]);
          rng.text('', 'end');
        },
        '{rightarrow}': function(rng) {
          var b = rng.bounds();
          if (b[0] == b[1])
            ++b[1];
          rng.bounds([b[1], b[1]]);
        },
        '{leftarrow}': function(rng) {
          var b = rng.bounds();
          if (b[0] == b[1])
            --b[0];
          rng.bounds([b[0], b[0]]);
        },
        '{selectall}': function(rng) {
          rng.bounds('all');
        },
        '{selection}': function(rng) {
          var s = rng.data().sendkeysOriginalText;
          for (var i = 0; i < s.length; ++i) {
            var x = s.charCodeAt(i);
            rng.dispatch({
              type: 'keypress',
              keyCode: x,
              which: x,
              charCode: x
            });
          }
          rng.text(s, 'end');
        },
        '{mark}': function(rng) {
          rng.data().sendkeysBounds = rng.bounds();
        }
      };
      bililiteRange.sendkeys['{Enter}'] = bililiteRange.sendkeys['{enter}'];
      bililiteRange.sendkeys['{Backspace}'] = bililiteRange.sendkeys['{backspace}'];
      bililiteRange.sendkeys['{Delete}'] = bililiteRange.sendkeys['{del}'];
      bililiteRange.sendkeys['{ArrowRight}'] = bililiteRange.sendkeys['{rightarrow}'];
      bililiteRange.sendkeys['{ArrowLeft}'] = bililiteRange.sendkeys['{leftarrow}'];
      function IERange() {}
      IERange.prototype = new Range();
      IERange.prototype._nativeRange = function(bounds) {
        var rng;
        if (this._el.tagName == 'INPUT') {
          rng = this._el.createTextRange();
        } else {
          rng = this._doc.body.createTextRange();
          rng.moveToElementText(this._el);
        }
        if (bounds) {
          if (bounds[1] < 0)
            bounds[1] = 0;
          if (bounds[0] > this.length())
            bounds[0] = this.length();
          if (bounds[1] < rng.text.replace(/\r/g, '').length) {
            rng.moveEnd('character', -1);
            rng.moveEnd('character', bounds[1] - rng.text.replace(/\r/g, '').length);
          }
          if (bounds[0] > 0)
            rng.moveStart('character', bounds[0]);
        }
        return rng;
      };
      IERange.prototype._nativeSelect = function(rng) {
        rng.select();
      };
      IERange.prototype._nativeSelection = function() {
        var rng = this._nativeRange();
        var len = this.length();
        var sel = this._doc.selection.createRange();
        try {
          return [iestart(sel, rng), ieend(sel, rng)];
        } catch (e) {
          return (sel.parentElement().sourceIndex < this._el.sourceIndex) ? [0, 0] : [len, len];
        }
      };
      IERange.prototype._nativeGetText = function(rng) {
        return rng.text;
      };
      IERange.prototype._nativeSetText = function(text, rng) {
        rng.text = text;
      };
      IERange.prototype._nativeEOL = function() {
        if ('value' in this._el) {
          this.text('\n');
        } else {
          this._nativeRange(this.bounds()).pasteHTML('\n<br/>');
        }
      };
      IERange.prototype._nativeTop = function(rng) {
        var startrng = this._nativeRange([0, 0]);
        return rng.boundingTop - startrng.boundingTop;
      };
      IERange.prototype._nativeWrap = function(n, rng) {
        var div = document.createElement('div');
        div.appendChild(n);
        var html = div.innerHTML.replace('><', '>' + rng.htmlText + '<');
        rng.pasteHTML(html);
      };
      function iestart(rng, constraint) {
        var len = constraint.text.replace(/\r/g, '').length;
        if (rng.compareEndPoints('StartToStart', constraint) <= 0)
          return 0;
        if (rng.compareEndPoints('StartToEnd', constraint) >= 0)
          return len;
        for (var i = 0; rng.compareEndPoints('StartToStart', constraint) > 0; ++i, rng.moveStart('character', -1))
          ;
        return i;
      }
      function ieend(rng, constraint) {
        var len = constraint.text.replace(/\r/g, '').length;
        if (rng.compareEndPoints('EndToEnd', constraint) >= 0)
          return len;
        if (rng.compareEndPoints('EndToStart', constraint) <= 0)
          return 0;
        for (var i = 0; rng.compareEndPoints('EndToStart', constraint) > 0; ++i, rng.moveEnd('character', -1))
          ;
        return i;
      }
      function InputRange() {}
      InputRange.prototype = new Range();
      InputRange.prototype._nativeRange = function(bounds) {
        return bounds || [0, this.length()];
      };
      InputRange.prototype._nativeSelect = function(rng) {
        this._el.setSelectionRange(rng[0], rng[1]);
      };
      InputRange.prototype._nativeSelection = function() {
        return [this._el.selectionStart, this._el.selectionEnd];
      };
      InputRange.prototype._nativeGetText = function(rng) {
        return this._el.value.substring(rng[0], rng[1]);
      };
      InputRange.prototype._nativeSetText = function(text, rng) {
        var val = this._el.value;
        this._el.value = val.substring(0, rng[0]) + text + val.substring(rng[1]);
      };
      InputRange.prototype._nativeEOL = function() {
        this.text('\n');
      };
      InputRange.prototype._nativeTop = function(rng) {
        var clone = this._el.cloneNode(true);
        clone.style.visibility = 'hidden';
        clone.style.position = 'absolute';
        this._el.parentNode.insertBefore(clone, this._el);
        clone.style.height = '1px';
        clone.value = this._el.value.slice(0, rng[0]);
        var top = clone.scrollHeight;
        clone.value = 'X';
        top -= clone.scrollHeight;
        clone.parentNode.removeChild(clone);
        return top;
      };
      InputRange.prototype._nativeWrap = function() {
        throw new Error("Cannot wrap in a text element");
      };
      function W3CRange() {}
      W3CRange.prototype = new Range();
      W3CRange.prototype._nativeRange = function(bounds) {
        var rng = this._doc.createRange();
        rng.selectNodeContents(this._el);
        if (bounds) {
          w3cmoveBoundary(rng, bounds[0], true, this._el);
          rng.collapse(true);
          w3cmoveBoundary(rng, bounds[1] - bounds[0], false, this._el);
        }
        return rng;
      };
      W3CRange.prototype._nativeSelect = function(rng) {
        this._win.getSelection().removeAllRanges();
        this._win.getSelection().addRange(rng);
      };
      W3CRange.prototype._nativeSelection = function() {
        var rng = this._nativeRange();
        if (this._win.getSelection().rangeCount == 0)
          return [this.length(), this.length()];
        var sel = this._win.getSelection().getRangeAt(0);
        return [w3cstart(sel, rng), w3cend(sel, rng)];
      };
      W3CRange.prototype._nativeGetText = function(rng) {
        return String.prototype.slice.apply(this._el.textContent, this.bounds());
      };
      W3CRange.prototype._nativeSetText = function(text, rng) {
        rng.deleteContents();
        rng.insertNode(this._doc.createTextNode(text));
        if (canNormalize)
          this._el.normalize();
      };
      W3CRange.prototype._nativeEOL = function() {
        var rng = this._nativeRange(this.bounds());
        rng.deleteContents();
        var br = this._doc.createElement('br');
        br.setAttribute('_moz_dirty', '');
        rng.insertNode(br);
        rng.insertNode(this._doc.createTextNode('\n'));
        rng.collapse(false);
      };
      W3CRange.prototype._nativeTop = function(rng) {
        if (this.length == 0)
          return 0;
        if (rng.toString() == '') {
          var textnode = this._doc.createTextNode('X');
          rng.insertNode(textnode);
        }
        var startrng = this._nativeRange([0, 1]);
        var top = rng.getBoundingClientRect().top - startrng.getBoundingClientRect().top;
        if (textnode)
          textnode.parentNode.removeChild(textnode);
        return top;
      };
      W3CRange.prototype._nativeWrap = function(n, rng) {
        rng.surroundContents(n);
      };
      function nextnode(node, root) {
        if (node.firstChild)
          return node.firstChild;
        if (node.nextSibling)
          return node.nextSibling;
        if (node === root)
          return null;
        while (node.parentNode) {
          node = node.parentNode;
          if (node == root)
            return null;
          if (node.nextSibling)
            return node.nextSibling;
        }
        return null;
      }
      function w3cmoveBoundary(rng, n, bStart, el) {
        if (n <= 0)
          return;
        var node = rng[bStart ? 'startContainer' : 'endContainer'];
        if (node.nodeType == 3) {
          n += rng[bStart ? 'startOffset' : 'endOffset'];
        }
        while (node) {
          if (node.nodeType == 3) {
            var length = node.nodeValue.length;
            if (n <= length) {
              rng[bStart ? 'setStart' : 'setEnd'](node, n);
              if (n == length) {
                for (var next = nextnode(node, el); next && next.nodeType == 3 && next.nodeValue.length == 0; next = nextnode(next, el)) {
                  rng[bStart ? 'setStartAfter' : 'setEndAfter'](next);
                }
                if (next && next.nodeType == 1 && next.nodeName == "BR")
                  rng[bStart ? 'setStartAfter' : 'setEndAfter'](next);
              }
              return;
            } else {
              rng[bStart ? 'setStartAfter' : 'setEndAfter'](node);
              n -= length;
            }
          }
          node = nextnode(node, el);
        }
      }
      var START_TO_START = 0;
      var START_TO_END = 1;
      var END_TO_END = 2;
      var END_TO_START = 3;
      function w3cstart(rng, constraint) {
        if (rng.compareBoundaryPoints(START_TO_START, constraint) <= 0)
          return 0;
        if (rng.compareBoundaryPoints(END_TO_START, constraint) >= 0)
          return constraint.toString().length;
        rng = rng.cloneRange();
        rng.setEnd(constraint.endContainer, constraint.endOffset);
        return constraint.toString().replace(/\r/g, '').length - rng.toString().replace(/\r/g, '').length;
      }
      function w3cend(rng, constraint) {
        if (rng.compareBoundaryPoints(END_TO_END, constraint) >= 0)
          return constraint.toString().length;
        if (rng.compareBoundaryPoints(START_TO_END, constraint) <= 0)
          return 0;
        rng = rng.cloneRange();
        rng.setStart(constraint.startContainer, constraint.startOffset);
        return rng.toString().replace(/\r/g, '').length;
      }
      function NothingRange() {}
      NothingRange.prototype = new Range();
      NothingRange.prototype._nativeRange = function(bounds) {
        return bounds || [0, this.length()];
      };
      NothingRange.prototype._nativeSelect = function(rng) {};
      NothingRange.prototype._nativeSelection = function() {
        return [0, 0];
      };
      NothingRange.prototype._nativeGetText = function(rng) {
        return this._el[this._textProp].substring(rng[0], rng[1]);
      };
      NothingRange.prototype._nativeSetText = function(text, rng) {
        var val = this._el[this._textProp];
        this._el[this._textProp] = val.substring(0, rng[0]) + text + val.substring(rng[1]);
      };
      NothingRange.prototype._nativeEOL = function() {
        this.text('\n');
      };
      NothingRange.prototype._nativeTop = function() {
        return 0;
      };
      NothingRange.prototype._nativeWrap = function() {
        throw new Error("Wrapping not implemented");
      };
      var data = [];
      bililiteRange.fn.data = function() {
        var index = this.element().bililiteRangeData;
        if (index == undefined) {
          index = this.element().bililiteRangeData = data.length;
          data[index] = new Data(this);
        }
        return data[index];
      };
      try {
        Object.defineProperty({}, 'foo', {});
        var Data = function(rng) {
          Object.defineProperty(this, 'values', {value: {}});
          Object.defineProperty(this, 'sourceRange', {value: rng});
          Object.defineProperty(this, 'toJSON', {value: function() {
              var ret = {};
              for (var i in Data.prototype)
                if (i in this.values)
                  ret[i] = this.values[i];
              return ret;
            }});
          Object.defineProperty(this, 'all', {get: function() {
              var ret = {};
              for (var i in Data.prototype)
                ret[i] = this[i];
              return ret;
            }});
        };
        Data.prototype = {};
        Object.defineProperty(Data.prototype, 'values', {value: {}});
        Object.defineProperty(Data.prototype, 'monitored', {value: {}});
        bililiteRange.data = function(name, newdesc) {
          newdesc = newdesc || {};
          var desc = Object.getOwnPropertyDescriptor(Data.prototype, name) || {};
          if ('enumerable' in newdesc)
            desc.enumerable = !!newdesc.enumerable;
          if (!('enumerable' in desc))
            desc.enumerable = true;
          if ('value' in newdesc)
            Data.prototype.values[name] = newdesc.value;
          if ('monitored' in newdesc)
            Data.prototype.monitored[name] = newdesc.monitored;
          desc.configurable = true;
          desc.get = function() {
            if (name in this.values)
              return this.values[name];
            return Data.prototype.values[name];
          };
          desc.set = function(value) {
            this.values[name] = value;
            if (Data.prototype.monitored[name])
              this.sourceRange.dispatch({
                type: 'bililiteRangeData',
                bubbles: true,
                detail: {
                  name: name,
                  value: value
                }
              });
          };
          Object.defineProperty(Data.prototype, name, desc);
        };
      } catch (err) {
        Data = function(rng) {
          this.sourceRange = rng;
        };
        Data.prototype = {};
        bililiteRange.data = function(name, newdesc) {
          if ('value' in newdesc)
            Data.prototype[name] = newdesc.value;
        };
      }
    })();
    if (!Array.prototype.forEach) {
      Array.prototype.forEach = function(fun) {
        "use strict";
        if (this === void 0 || this === null)
          throw new TypeError();
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== "function")
          throw new TypeError();
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
          if (i in t)
            fun.call(thisArg, t[i], i, t);
        }
      };
    }
    ;
    (function($) {
      "use strict";
      var originalMouseEvent = $.simulate.prototype.mouseEvent,
          rdocument = /\[object (?:HTML)?Document\]/;
      $.simulate.prototype.mouseEvent = function(type, options) {
        if (options.pageX || options.pageY) {
          var doc = rdocument.test(Object.prototype.toString.call(this.target)) ? this.target : (this.target.ownerDocument || document);
          options.clientX = (options.pageX || 0) - $(doc).scrollLeft();
          options.clientY = (options.pageY || 0) - $(doc).scrollTop();
        }
        return originalMouseEvent.apply(this, [type, options]);
      };
    })(jQuery);
    ;
    (function($, undefined) {
      "use strict";
      $.fn.simulate = function(type, options) {
        switch (type) {
          case "drag":
          case "drop":
          case "drag-n-drop":
            var ele = this.first();
            new $.simulate(ele[0], type, options);
            return ele;
          default:
            return this.each(function() {
              new $.simulate(this, type, options);
            });
        }
      };
      var now = Date.now || function() {
        return new Date().getTime();
      };
      var rdocument = /\[object (?:HTML)?Document\]/;
      function isDocument(elem) {
        return rdocument.test(Object.prototype.toString.call($(elem)[0]));
      }
      function selectFirstMatch(array, check) {
        var i;
        if ($.isFunction(check)) {
          for (i = 0; i < array.length; i += 1) {
            if (check(array[i])) {
              return array[i];
            }
          }
          return null;
        } else {
          for (i = 0; i < array.length; i += 1) {
            if (array[i]) {
              return array[i];
            }
          }
          return null;
        }
      }
      function findCenter(elem) {
        var offset,
            $elem = $(elem);
        if (isDocument($elem[0])) {
          offset = {
            left: 0,
            top: 0
          };
        } else {
          offset = $elem.offset();
        }
        return {
          x: offset.left + $elem.outerWidth() / 2,
          y: offset.top + $elem.outerHeight() / 2
        };
      }
      function pageToClientPos(x, y, docRel) {
        var $document;
        if (isDocument(y)) {
          $document = $(y);
        } else {
          $document = $(docRel || document);
        }
        if (typeof x === "number" && typeof y === "number") {
          return {
            x: x - $document.scrollLeft(),
            y: y - $document.scrollTop()
          };
        } else if (typeof x === "object" && x.pageX && x.pageY) {
          return {
            clientX: x.pageX - $document.scrollLeft(),
            clientY: x.pageY - $document.scrollTop()
          };
        }
      }
      function elementAtPosition(x, y, docRel) {
        var doc;
        if (isDocument(y)) {
          doc = y;
        } else {
          doc = docRel || document;
        }
        if (!doc.elementFromPoint) {
          return null;
        }
        var clientX = x,
            clientY = y;
        if (typeof x === "object" && (x.clientX || x.clientY)) {
          clientX = x.clientX || 0;
          clientY = x.clientY || 0;
        }
        if (elementAtPosition.prototype.check) {
          var sl,
              ele;
          if ((sl = $(doc).scrollTop()) > 0) {
            ele = doc.elementFromPoint(0, sl + $(window).height() - 1);
            if (ele !== null && ele.tagName.toUpperCase() === 'HTML') {
              ele = null;
            }
            elementAtPosition.prototype.nativeUsesRelative = (ele === null);
          } else if ((sl = $(doc).scrollLeft()) > 0) {
            ele = doc.elementFromPoint(sl + $(window).width() - 1, 0);
            if (ele !== null && ele.tagName.toUpperCase() === 'HTML') {
              ele = null;
            }
            elementAtPosition.prototype.nativeUsesRelative = (ele === null);
          }
          elementAtPosition.prototype.check = (sl <= 0);
        }
        if (!elementAtPosition.prototype.nativeUsesRelative) {
          clientX += $(doc).scrollLeft();
          clientY += $(doc).scrollTop();
        }
        return doc.elementFromPoint(clientX, clientY);
      }
      elementAtPosition.prototype.check = true;
      elementAtPosition.prototype.nativeUsesRelative = true;
      function dragFinished(ele, options) {
        var opts = options || {};
        $(ele).trigger({type: "simulate-drag"});
        if ($.isFunction(opts.callback)) {
          opts.callback.apply(ele);
        }
      }
      function interpolatedEvents(self, ele, start, drag, options) {
        var targetDoc = selectFirstMatch([ele, ele.ownerDocument], isDocument) || document,
            interpolOptions = options.interpolation,
            dragDistance = Math.sqrt(Math.pow(drag.dx, 2) + Math.pow(drag.dy, 2)),
            stepWidth,
            stepCount,
            stepVector;
        if (interpolOptions.stepWidth) {
          stepWidth = parseInt(interpolOptions.stepWidth, 10);
          stepCount = Math.floor(dragDistance / stepWidth) - 1;
          var stepScale = stepWidth / dragDistance;
          stepVector = {
            x: drag.dx * stepScale,
            y: drag.dy * stepScale
          };
        } else {
          stepCount = parseInt(interpolOptions.stepCount, 10);
          stepWidth = dragDistance / (stepCount + 1);
          stepVector = {
            x: drag.dx / (stepCount + 1),
            y: drag.dy / (stepCount + 1)
          };
        }
        var coords = $.extend({}, start);
        function interpolationStep() {
          coords.x += stepVector.x;
          coords.y += stepVector.y;
          var effectiveCoords = {
            pageX: coords.x,
            pageY: coords.y
          };
          if (interpolOptions.shaky && (interpolOptions.shaky === true || !isNaN(parseInt(interpolOptions.shaky, 10)))) {
            var amplitude = (interpolOptions.shaky === true) ? 1 : parseInt(interpolOptions.shaky, 10);
            effectiveCoords.pageX += Math.floor(Math.random() * (2 * amplitude + 1) - amplitude);
            effectiveCoords.pageY += Math.floor(Math.random() * (2 * amplitude + 1) - amplitude);
          }
          var clientCoord = pageToClientPos(effectiveCoords, targetDoc),
              eventTarget = elementAtPosition(clientCoord, targetDoc) || ele;
          self.simulateEvent(eventTarget, "mousemove", {
            pageX: Math.round(effectiveCoords.pageX),
            pageY: Math.round(effectiveCoords.pageY)
          });
        }
        var lastTime;
        function stepAndSleep() {
          var timeElapsed = now() - lastTime;
          if (timeElapsed >= stepDelay) {
            if (step < stepCount) {
              interpolationStep();
              step += 1;
              lastTime = now();
              setTimeout(stepAndSleep, stepDelay);
            } else {
              var pageCoord = {
                pageX: Math.round(start.x + drag.dx),
                pageY: Math.round(start.y + drag.dy)
              },
                  clientCoord = pageToClientPos(pageCoord, targetDoc),
                  eventTarget = elementAtPosition(clientCoord, targetDoc) || ele;
              self.simulateEvent(eventTarget, "mousemove", pageCoord);
              dragFinished(ele, options);
            }
          } else {
            setTimeout(stepAndSleep, stepDelay - timeElapsed);
          }
        }
        if ((!interpolOptions.stepDelay && !interpolOptions.duration) || ((interpolOptions.stepDelay <= 0) && (interpolOptions.duration <= 0))) {
          for (var i = 0; i < stepCount; i += 1) {
            interpolationStep();
          }
          var pageCoord = {
            pageX: Math.round(start.x + drag.dx),
            pageY: Math.round(start.y + drag.dy)
          },
              clientCoord = pageToClientPos(pageCoord, targetDoc),
              eventTarget = elementAtPosition(clientCoord, targetDoc) || ele;
          self.simulateEvent(eventTarget, "mousemove", pageCoord);
          dragFinished(ele, options);
        } else {
          var stepDelay = parseInt(interpolOptions.stepDelay, 10) || Math.ceil(parseInt(interpolOptions.duration, 10) / (stepCount + 1));
          var step = 0;
          lastTime = now();
          setTimeout(stepAndSleep, stepDelay);
        }
      }
      $.simulate.activeDrag = function() {
        if (!$.simulate._activeDrag) {
          return undefined;
        }
        return $.extend(true, {}, $.simulate._activeDrag);
      };
      $.extend($.simulate.prototype, {
        simulateDrag: function() {
          var self = this,
              ele = self.target,
              options = $.extend({
                dx: 0,
                dy: 0,
                dragTarget: undefined,
                clickToDrag: false,
                eventProps: {},
                interpolation: {
                  stepWidth: 0,
                  stepCount: 0,
                  stepDelay: 0,
                  duration: 0,
                  shaky: false
                },
                callback: undefined
              }, this.options);
          var start,
              continueDrag = ($.simulate._activeDrag && $.simulate._activeDrag.dragElement === ele);
          if (continueDrag) {
            start = $.simulate._activeDrag.dragStart;
          } else {
            start = findCenter(ele);
          }
          var x = Math.round(start.x),
              y = Math.round(start.y),
              coord = {
                pageX: x,
                pageY: y
              },
              dx,
              dy;
          if (options.dragTarget) {
            var end = findCenter(options.dragTarget);
            dx = Math.round(end.x - start.x);
            dy = Math.round(end.y - start.y);
          } else {
            dx = options.dx || 0;
            dy = options.dy || 0;
          }
          if (continueDrag) {
            $.simulate._activeDrag.dragDistance.x += dx;
            $.simulate._activeDrag.dragDistance.y += dy;
            coord = {
              pageX: Math.round(x + $.simulate._activeDrag.dragDistance.x),
              pageY: Math.round(y + $.simulate._activeDrag.dragDistance.y)
            };
          } else {
            if ($.simulate._activeDrag) {
              $($.simulate._activeDrag.dragElement).simulate("drop");
            }
            $.extend(options.eventProps, coord);
            self.simulateEvent(ele, "mousedown", options.eventProps);
            if (options.clickToDrag === true) {
              self.simulateEvent(ele, "mouseup", options.eventProps);
              self.simulateEvent(ele, "click", options.eventProps);
            }
            $(ele).add(ele.ownerDocument).one('mouseup', function() {
              $.simulate._activeDrag = undefined;
            });
            $.extend($.simulate, {_activeDrag: {
                dragElement: ele,
                dragStart: {
                  x: x,
                  y: y
                },
                dragDistance: {
                  x: dx,
                  y: dy
                }
              }});
            coord = {
              pageX: Math.round(x + dx),
              pageY: Math.round(y + dy)
            };
          }
          if (dx !== 0 || dy !== 0) {
            if (options.interpolation && (options.interpolation.stepCount || options.interpolation.stepWidth)) {
              interpolatedEvents(self, ele, {
                x: x,
                y: y
              }, {
                dx: dx,
                dy: dy
              }, options);
            } else {
              var targetDoc = selectFirstMatch([ele, ele.ownerDocument], isDocument) || document,
                  clientCoord = pageToClientPos(coord, targetDoc),
                  eventTarget = elementAtPosition(clientCoord, targetDoc) || ele;
              $.extend(options.eventProps, coord);
              self.simulateEvent(eventTarget, "mousemove", options.eventProps);
              dragFinished(ele, options);
            }
          } else {
            dragFinished(ele, options);
          }
        },
        simulateDrop: function() {
          var self = this,
              ele = this.target,
              activeDrag = $.simulate._activeDrag,
              options = $.extend({
                clickToDrop: false,
                eventProps: {},
                callback: undefined
              }, self.options),
              moveBeforeDrop = true,
              center = findCenter(ele),
              x = Math.round(center.x),
              y = Math.round(center.y),
              coord = {
                pageX: x,
                pageY: y
              },
              targetDoc = ((activeDrag) ? selectFirstMatch([activeDrag.dragElement, activeDrag.dragElement.ownerDocument], isDocument) : selectFirstMatch([ele, ele.ownerDocument], isDocument)) || document,
              clientCoord = pageToClientPos(coord, targetDoc),
              eventTarget = elementAtPosition(clientCoord, targetDoc);
          if (activeDrag && (activeDrag.dragElement === ele || isDocument(ele))) {
            x = Math.round(activeDrag.dragStart.x + activeDrag.dragDistance.x);
            y = Math.round(activeDrag.dragStart.y + activeDrag.dragDistance.y);
            coord = {
              pageX: x,
              pageY: y
            };
            clientCoord = pageToClientPos(coord, targetDoc);
            eventTarget = elementAtPosition(clientCoord, targetDoc);
            moveBeforeDrop = false;
          }
          if (!eventTarget) {
            eventTarget = (activeDrag) ? activeDrag.dragElement : ele;
          }
          $.extend(options.eventProps, coord);
          if (moveBeforeDrop === true) {
            self.simulateEvent(eventTarget, "mousemove", options.eventProps);
          }
          if (options.clickToDrop) {
            self.simulateEvent(eventTarget, "mousedown", options.eventProps);
          }
          this.simulateEvent(eventTarget, "mouseup", options.eventProps);
          if (options.clickToDrop) {
            self.simulateEvent(eventTarget, "click", options.eventProps);
          }
          $.simulate._activeDrag = undefined;
          $(eventTarget).trigger({type: "simulate-drop"});
          if ($.isFunction(options.callback)) {
            options.callback.apply(eventTarget);
          }
        },
        simulateDragNDrop: function() {
          var self = this,
              ele = this.target,
              options = $.extend({
                dragTarget: undefined,
                dropTarget: undefined
              }, self.options),
              dropEle = ((options.dragTarget || options.dx || options.dy) ? options.dropTarget : ele) || ele;
          $(ele).simulate("drag", $.extend({}, options, {
            dragTarget: options.dragTarget || ((options.dx || options.dy) ? undefined : options.dropTarget),
            callback: function() {
              $(dropEle).simulate("drop", options);
            }
          }));
        }
      });
    }(jQuery));
    ;
    (function($, undefined) {
      "use strict";
      var SpecialKeyCodes = {
        SHIFT: 16,
        CONTROL: 17,
        ALTERNATIVE: 18,
        META: 91,
        LEFT_ARROW: 37,
        UP_ARROW: 38,
        RIGHT_ARROW: 39,
        DOWN_ARROW: 40,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        ENTER: 13,
        TABULATOR: 9,
        ESCAPE: 27,
        BACKSPACE: 8,
        INSERT: 45,
        DELETE: 46,
        HOME: 36,
        END: 35,
        PAGE_UP: 33,
        PAGE_DOWN: 34
      };
      SpecialKeyCodes.CTRL = SpecialKeyCodes.CONTROL;
      SpecialKeyCodes.ALT = SpecialKeyCodes.ALTERNATIVE;
      SpecialKeyCodes.COMMAND = SpecialKeyCodes.META;
      SpecialKeyCodes.TAB = SpecialKeyCodes.TABULATOR;
      SpecialKeyCodes.ESC = SpecialKeyCodes.ESCAPE;
      $.extend($.simulate.prototype, {simulateKeyCombo: function() {
          var $target = $(this.target),
              options = $.extend({
                combo: "",
                eventProps: {},
                eventsOnly: false
              }, this.options),
              combo = options.combo,
              comboSplit = combo.split(/(\+)/),
              plusExpected = false,
              holdKeys = [],
              i;
          if (combo.length === 0) {
            return;
          }
          comboSplit = $.grep(comboSplit, function(part) {
            return (part !== "");
          });
          for (i = 0; i < comboSplit.length; i += 1) {
            var key = comboSplit[i],
                keyLowered = key.toLowerCase(),
                keySpecial = key.toUpperCase().replace('-', '_');
            if (plusExpected) {
              if (key !== "+") {
                throw 'Syntax error: expected "+"';
              } else {
                plusExpected = false;
              }
            } else {
              var keyCode;
              if (key.length > 1) {
                keyCode = SpecialKeyCodes[keySpecial];
                if (keyCode === undefined) {
                  throw 'Syntax error: unknown special key "' + key + '" (forgot "+" between keys?)';
                }
                switch (keyCode) {
                  case SpecialKeyCodes.CONTROL:
                  case SpecialKeyCodes.ALT:
                  case SpecialKeyCodes.SHIFT:
                  case SpecialKeyCodes.META:
                    options.eventProps[keyLowered + "Key"] = true;
                    break;
                }
                holdKeys.unshift(keyCode);
                options.eventProps.keyCode = keyCode;
                options.eventProps.which = keyCode;
                options.eventProps.charCode = 0;
                $target.simulate("keydown", options.eventProps);
              } else {
                keyCode = $.simulate.prototype.simulateKeySequence.prototype.charToKeyCode(key);
                holdKeys.unshift(keyCode);
                options.eventProps.keyCode = keyCode;
                options.eventProps.which = keyCode;
                options.eventProps.charCode = undefined;
                $target.simulate("keydown", options.eventProps);
                if (options.eventProps.shiftKey) {
                  key = key.toUpperCase();
                }
                options.eventProps.keyCode = key.charCodeAt(0);
                options.eventProps.charCode = options.eventProps.keyCode;
                options.eventProps.which = options.eventProps.keyCode;
                $target.simulate("keypress", options.eventProps);
                if (options.eventsOnly !== true && !options.eventProps.ctrlKey && !options.eventProps.altKey && !options.eventProps.metaKey) {
                  $target.simulate('key-sequence', {
                    sequence: key,
                    triggerKeyEvents: false
                  });
                }
              }
              plusExpected = true;
            }
          }
          if (!plusExpected) {
            throw 'Syntax error: expected key (trailing "+"?)';
          }
          options.eventProps.charCode = undefined;
          for (i = 0; i < holdKeys.length; i += 1) {
            options.eventProps.keyCode = holdKeys[i];
            options.eventProps.which = holdKeys[i];
            switch (options.eventProps.keyCode) {
              case SpecialKeyCodes.ALT:
                options.eventProps.altKey = false;
                break;
              case SpecialKeyCodes.SHIFT:
                options.eventProps.shiftKey = false;
                break;
              case SpecialKeyCodes.CONTROL:
                options.eventProps.ctrlKey = false;
                break;
              case SpecialKeyCodes.META:
                options.eventProps.metaKey = false;
                break;
              default:
                break;
            }
            $target.simulate("keyup", options.eventProps);
          }
        }});
    }(jQuery));
    ;
    (function($, undefined) {
      "use strict";
      $.simulate.prototype.quirks = $.simulate.prototype.quirks || {};
      $.extend($.simulate.prototype.quirks, {delayedSpacesInNonInputGlitchToEnd: undefined});
      $.extend($.simulate.prototype, {simulateKeySequence: function() {
          var target = this.target,
              $target = $(target),
              opts = $.extend({
                sequence: "",
                triggerKeyEvents: true,
                eventProps: {},
                delay: 0,
                callback: undefined
              }, this.options),
              sequence = opts.sequence;
          opts.delay = parseInt(opts.delay, 10);
          var localkeys = {};
          if ($.simulate.prototype.quirks.delayedSpacesInNonInputGlitchToEnd && !$target.is('input,textarea')) {
            $.extend(localkeys, {' ': function(rng, s, opts) {
                var internalOpts = $.extend({}, opts, {
                  triggerKeyEvents: false,
                  delay: 0,
                  callback: undefined
                });
                $.simulate.prototype.simulateKeySequence.defaults.simplechar(rng, '\xA0', internalOpts);
                $.simulate.prototype.simulateKeySequence.defaults['{leftarrow}'](rng, s, internalOpts);
                $.simulate.prototype.simulateKeySequence.defaults.simplechar(rng, s, opts);
                $.simulate.prototype.simulateKeySequence.defaults['{del}'](rng, s, internalOpts);
              }});
          }
          $.extend(localkeys, opts, $target.data('simulate-keySequence'));
          var rng = $.data(target, 'simulate-keySequence.selection');
          if (!rng) {
            rng = bililiteRange(target).bounds('selection');
            $.data(target, 'simulate-keySequence.selection', rng);
            $target.bind('mouseup.simulate-keySequence', function() {
              $.data(target, 'simulate-keySequence.selection').bounds('selection');
            }).bind('keyup.simulate-keySequence', function(evt) {
              if (evt.which === 9) {
                $.data(target, 'simulate-keySequence.selection').select();
              } else {
                $.data(target, 'simulate-keySequence.selection').bounds('selection');
              }
            });
          }
          $target.focus();
          if (typeof sequence === 'undefined') {
            return;
          }
          sequence = sequence.replace(/\n/g, '{enter}');
          function sequenceFinished() {
            $target.trigger({
              type: 'simulate-keySequence',
              sequence: sequence
            });
            if ($.isFunction(opts.callback)) {
              opts.callback.apply(target, [{sequence: sequence}]);
            }
          }
          function processNextToken() {
            var timeElapsed = now() - lastTime;
            if (timeElapsed >= opts.delay) {
              var match = tokenRegExp.exec(sequence);
              if (match !== null) {
                var s = match[0];
                (localkeys[s] || $.simulate.prototype.simulateKeySequence.defaults[s] || $.simulate.prototype.simulateKeySequence.defaults.simplechar)(rng, s, opts);
                setTimeout(processNextToken, opts.delay);
              } else {
                sequenceFinished();
              }
              lastTime = now();
            } else {
              setTimeout(processNextToken, opts.delay - timeElapsed);
            }
          }
          if (!opts.delay || opts.delay <= 0) {
            sequence.replace(/\{[^}]*\}|[^{]+/g, function(s) {
              (localkeys[s] || $.simulate.prototype.simulateKeySequence.defaults[s] || $.simulate.prototype.simulateKeySequence.defaults.simplechar)(rng, s, opts);
            });
            sequenceFinished();
          } else {
            var tokenRegExp = /\{[^}]*\}|[^{]/g;
            var now = Date.now || function() {
              return new Date().getTime();
            },
                lastTime = now();
            processNextToken();
          }
        }});
      $.extend($.simulate.prototype.simulateKeySequence.prototype, {
        IEKeyCodeTable: {
          33: 49,
          64: 50,
          35: 51,
          36: 52,
          37: 53,
          94: 54,
          38: 55,
          42: 56,
          40: 57,
          41: 48,
          59: 186,
          58: 186,
          61: 187,
          43: 187,
          44: 188,
          60: 188,
          45: 189,
          95: 189,
          46: 190,
          62: 190,
          47: 191,
          63: 191,
          96: 192,
          126: 192,
          91: 219,
          123: 219,
          92: 220,
          124: 220,
          93: 221,
          125: 221,
          39: 222,
          34: 222
        },
        charToKeyCode: function(character) {
          var specialKeyCodeTable = $.simulate.prototype.simulateKeySequence.prototype.IEKeyCodeTable;
          var charCode = character.charCodeAt(0);
          if (charCode >= 64 && charCode <= 90 || charCode >= 48 && charCode <= 57) {
            return charCode;
          } else if (charCode >= 97 && charCode <= 122) {
            return character.toUpperCase().charCodeAt(0);
          } else if (specialKeyCodeTable[charCode] !== undefined) {
            return specialKeyCodeTable[charCode];
          } else {
            return charCode;
          }
        }
      });
      $.simulate.prototype.simulateKeySequence.defaults = {
        simplechar: function(rng, s, opts) {
          rng.text(s, 'end');
          rng.select();
          if (opts.triggerKeyEvents) {
            for (var i = 0; i < s.length; i += 1) {
              var charCode = s.charCodeAt(i);
              var keyCode = $.simulate.prototype.simulateKeySequence.prototype.charToKeyCode(s.charAt(i));
              $(rng._el).simulate('keydown', $.extend({}, opts.eventProps, {keyCode: keyCode}));
              $(rng._el).simulate('keypress', $.extend({}, opts.eventProps, {
                keyCode: charCode,
                which: charCode,
                charCode: charCode
              }));
              $(rng._el).simulate('keyup', $.extend({}, opts.eventProps, {keyCode: keyCode}));
            }
          }
        },
        '{{}': function(rng, s, opts) {
          $.simulate.prototype.simulateKeySequence.defaults.simplechar(rng, '{', opts);
        },
        '{enter}': function(rng, s, opts) {
          rng.insertEOL();
          rng.select();
          if (opts.triggerKeyEvents === true) {
            $(rng._el).simulate('keydown', $.extend({}, opts.eventProps, {keyCode: 13}));
            $(rng._el).simulate('keypress', $.extend({}, opts.eventProps, {
              keyCode: 13,
              which: 13,
              charCode: 13
            }));
            $(rng._el).simulate('keyup', $.extend({}, opts.eventProps, {keyCode: 13}));
          }
        },
        '{backspace}': function(rng, s, opts) {
          var b = rng.bounds();
          if (b[0] === b[1]) {
            rng.bounds([b[0] - 1, b[0]]);
          }
          rng.text('', 'end');
          if (opts.triggerKeyEvents === true) {
            $(rng._el).simulate('keydown', $.extend({}, opts.eventProps, {keyCode: 8}));
            $(rng._el).simulate('keyup', $.extend({}, opts.eventProps, {keyCode: 8}));
          }
        },
        '{del}': function(rng, s, opts) {
          var b = rng.bounds();
          if (b[0] === b[1]) {
            rng.bounds([b[0], b[0] + 1]);
          }
          rng.text('', 'end');
          if (opts.triggerKeyEvents === true) {
            $(rng._el).simulate('keydown', $.extend({}, opts.eventProps, {keyCode: 46}));
            $(rng._el).simulate('keyup', $.extend({}, opts.eventProps, {keyCode: 46}));
          }
        },
        '{rightarrow}': function(rng, s, opts) {
          var b = rng.bounds();
          if (b[0] === b[1]) {
            b[1] += 1;
          }
          rng.bounds([b[1], b[1]]).select();
          if (opts.triggerKeyEvents === true) {
            $(rng._el).simulate('keydown', $.extend({}, opts.eventProps, {keyCode: 39}));
            $(rng._el).simulate('keyup', $.extend({}, opts.eventProps, {keyCode: 39}));
          }
        },
        '{leftarrow}': function(rng, s, opts) {
          var b = rng.bounds();
          if (b[0] === b[1]) {
            b[0] -= 1;
          }
          rng.bounds([b[0], b[0]]).select();
          if (opts.triggerKeyEvents === true) {
            $(rng._el).simulate('keydown', $.extend({}, opts.eventProps, {keyCode: 37}));
            $(rng._el).simulate('keyup', $.extend({}, opts.eventProps, {keyCode: 37}));
          }
        },
        '{selectall}': function(rng) {
          rng.bounds('all').select();
        }
      };
      if ($.simulate.ext_disableQuirkDetection !== true) {
        $(document).ready(function() {
          var $testDiv = $('<div/>').css({
            height: 1,
            width: 1,
            position: 'absolute',
            left: -1000,
            top: -1000
          }).appendTo('body');
          $testDiv.simulate('key-sequence', {
            sequence: '\xA0 \xA0',
            delay: 1,
            callback: function() {
              $.simulate.prototype.quirks.delayedSpacesInNonInputGlitchToEnd = ($testDiv.text() === '\xA0\xA0 ');
              $testDiv.remove();
            }
          });
        });
      }
    })(jQuery);
  }(jQuery));
}

//# sourceMappingURL=jquery_simulate.es6.map
// end:source /src/jquery_simulate.es6