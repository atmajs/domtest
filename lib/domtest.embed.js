/*!
 * DomTest v0.10.27
 * Part of the Atma.js Project
 * http://atmajs.com/
 *
 * MIT license
 * http://opensource.org/licenses/MIT
 *
 * (c) 2012, 2015 Atma.js and other contributors
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

	// source /src/library.es6
	// source /ref-utils/lib/utils.embed.js
	// source /src/refs.js
	"use strict";
	
	var _Array_slice = Array.prototype.slice,
	    _Array_splice = Array.prototype.splice,
	    _Array_indexOf = Array.prototype.indexOf,
	    _Object_create = null,
	    // in obj.js
	_Object_hasOwnProp = Object.hasOwnProperty,
	    _Object_getOwnProp = Object.getOwnPropertyDescriptor,
	    _Object_defineProperty = Object.defineProperty;
	
	// end:source /src/refs.js
	
	// source /src/coll.js
	var coll_each, coll_remove, coll_map, coll_indexOf, coll_find;
	(function () {
		coll_each = function (coll, fn, ctx) {
			if (ctx == null) ctx = coll;
			if (coll == null) return coll;
	
			var imax = coll.length,
			    i = 0;
			for (; i < imax; i++) {
				fn.call(ctx, coll[i], i);
			}
			return ctx;
		};
		coll_indexOf = function (coll, x) {
			if (coll == null) return -1;
			var imax = coll.length,
			    i = 0;
			for (; i < imax; i++) {
				if (coll[i] === x) return i;
			}
			return -1;
		};
		coll_remove = function (coll, x) {
			var i = coll_indexOf(coll, x);
			if (i === -1) return false;
			coll.splice(i, 1);
			return true;
		};
		coll_map = function (coll, fn, ctx) {
			var arr = new Array(coll.length);
			coll_each(coll, function (x, i) {
				arr[i] = fn.call(this, x, i);
			}, ctx);
			return arr;
		};
		coll_find = function (coll, fn, ctx) {
			var imax = coll.length,
			    i = 0;
			for (; i < imax; i++) {
				if (fn.call(ctx || coll, coll[i], i)) return true;
			}
			return false;
		};
	})();
	
	// end:source /src/coll.js
	
	// source /src/polyfill/arr.js
	if (Array.prototype.forEach === void 0) {
		Array.prototype.forEach = function (fn, ctx) {
			coll_each(this, fn, ctx);
		};
	}
	if (Array.prototype.indexOf === void 0) {
		Array.prototype.indexOf = function (x) {
			return coll_indexOf(this, x);
		};
	}
	
	// end:source /src/polyfill/arr.js
	// source /src/polyfill/str.js
	if (String.prototype.trim == null) {
		String.prototype.trim = function () {
			var start = -1,
			    end = this.length,
			    code;
			if (end === 0) return this;
			while (++start < end) {
				code = this.charCodeAt(start);
				if (code > 32) break;
			}
			while (--end !== 0) {
				code = this.charCodeAt(end);
				if (code > 32) break;
			}
			return start !== 0 && end !== length - 1 ? this.substring(start, end + 1) : this;
		};
	}
	
	// end:source /src/polyfill/str.js
	// source /src/polyfill/fn.js
	
	if (Function.prototype.bind == null) {
		var _Array_slice;
		Function.prototype.bind = function () {
			if (arguments.length < 2 && typeof arguments[0] === "undefined") return this;
			var fn = this,
			    args = _Array_slice.call(arguments),
			    ctx = args.shift();
			return function () {
				return fn.apply(ctx, args.concat(_Array_slice.call(arguments)));
			};
		};
	}
	
	// end:source /src/polyfill/fn.js
	
	// source /src/is.js
	var is_Function, is_Array, is_ArrayLike, is_String, is_Object, is_notEmptyString, is_rawObject, is_Date, is_NODE, is_DOM;
	
	(function () {
		is_Function = function (x) {
			return typeof x === "function";
		};
		is_Object = function (x) {
			return x != null && typeof x === "object";
		};
		is_Array = is_ArrayLike = function (arr) {
			return arr != null && typeof arr === "object" && typeof arr.length === "number" && typeof arr.slice === "function";
		};
		is_String = function (x) {
			return typeof x === "string";
		};
		is_notEmptyString = function (x) {
			return typeof x === "string" && x !== "";
		};
		is_rawObject = function (obj) {
			if (obj == null || typeof obj !== "object") return false;
	
			return obj.constructor === Object;
		};
		is_Date = function (x) {
			if (x == null || typeof x !== "object") {
				return false;
			}
			if (x.getFullYear != null && isNaN(x) === false) {
				return true;
			}
			return false;
		};
		is_DOM = typeof window !== "undefined" && window.navigator != null;
		is_NODE = !is_DOM;
	})();
	
	// end:source /src/is.js
	// source /src/obj.js
	var obj_getProperty, obj_setProperty, obj_hasProperty, obj_extend, obj_extendDefaults, obj_extendMany, obj_extendProperties, obj_extendPropertiesDefaults, obj_create, obj_toFastProps, obj_defineProperty;
	(function () {
		obj_getProperty = function (obj_, path) {
			if ("." === path) // obsolete
				return obj_;
	
			var obj = obj_,
			    chain = path.split("."),
			    imax = chain.length,
			    i = -1;
			while (obj != null && ++i < imax) {
				obj = obj[chain[i]];
			}
			return obj;
		};
		obj_setProperty = function (obj_, path, val) {
			var obj = obj_,
			    chain = path.split("."),
			    imax = chain.length - 1,
			    i = -1,
			    key;
			while (++i < imax) {
				key = chain[i];
				if (obj[key] == null) obj[key] = {};
	
				obj = obj[key];
			}
			obj[chain[i]] = val;
		};
		obj_hasProperty = function (obj, path) {
			var x = obj_getProperty(obj, path);
			return x !== void 0;
		};
		obj_defineProperty = function (obj, path, dscr) {
			var x = obj,
			    chain = path.split("."),
			    imax = chain.length - 1,
			    i = -1,
			    key;
			while (++i < imax) {
				key = chain[i];
				if (x[key] == null) x[key] = {};
				x = x[key];
			}
			key = chain[imax];
			if (_Object_defineProperty) {
				if (dscr.writable === void 0) dscr.writable = true;
				if (dscr.configurable === void 0) dscr.configurable = true;
				if (dscr.enumerable === void 0) dscr.enumerable = true;
				_Object_defineProperty(x, key, dscr);
				return;
			}
			x[key] = dscr.value === void 0 ? dscr.value : dscr.get && dscr.get();
		};
		obj_extend = function (a, b) {
			if (b == null) return a || {};
	
			if (a == null) return obj_create(b);
	
			for (var key in b) {
				a[key] = b[key];
			}
			return a;
		};
		obj_extendDefaults = function (a, b) {
			if (b == null) return a || {};
			if (a == null) return obj_create(b);
	
			for (var key in b) {
				if (a[key] == null) a[key] = b[key];
			}
			return a;
		};
		var extendPropertiesFactory = function extendPropertiesFactory(overwriteProps) {
			if (_Object_getOwnProp == null) {
				return overwriteProps ? obj_extend : obj_extendDefaults;
			}return function (a, b) {
				if (b == null) return a || {};
	
				if (a == null) return obj_create(b);
	
				var key, descr, ownDescr;
				for (key in b) {
					descr = _Object_getOwnProp(b, key);
					if (descr == null) continue;
					if (overwriteProps !== true) {
						ownDescr = _Object_getOwnProp(a, key);
						if (ownDescr != null) {
							continue;
						}
					}
					if (descr.hasOwnProperty("value")) {
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
	
		obj_extendMany = function (a) {
			var imax = arguments.length,
			    i = 1;
			for (; i < imax; i++) {
				a = obj_extend(a, arguments[i]);
			}
			return a;
		};
		obj_toFastProps = function (obj) {
			/*jshint -W027*/
			function F() {}
			F.prototype = obj;
			new F();
			return;
			eval(obj);
		};
		_Object_create = obj_create = Object.create || function (x) {
			var Ctor = function Ctor() {};
			Ctor.prototype = x;
			return new Ctor();
		};
	})();
	
	// end:source /src/obj.js
	// source /src/arr.js
	var arr_remove, arr_each, arr_indexOf, arr_contains, arr_pushMany;
	(function () {
		arr_remove = function (array, x) {
			var i = array.indexOf(x);
			if (i === -1) return false;
			array.splice(i, 1);
			return true;
		};
		arr_each = function (arr, fn, ctx) {
			arr.forEach(fn, ctx);
		};
		arr_indexOf = function (arr, x) {
			return arr.indexOf(x);
		};
		arr_contains = function (arr, x) {
			return arr.indexOf(x) !== -1;
		};
		arr_pushMany = function (arr, arrSource) {
			if (arrSource == null || arr == null || arr === arrSource) return;
	
			var il = arr.length,
			    jl = arrSource.length,
			    j = -1;
			while (++j < jl) {
				arr[il + j] = arrSource[j];
			}
		};
	})();
	
	// end:source /src/arr.js
	// source /src/fn.js
	var fn_proxy, fn_apply, fn_doNothing, fn_createByPattern;
	(function () {
		fn_proxy = function (fn, ctx) {
			return function () {
				return fn_apply(fn, ctx, arguments);
			};
		};
	
		fn_apply = function (fn, ctx, args) {
			var l = args.length;
			if (0 === l) return fn.call(ctx);
			if (1 === l) return fn.call(ctx, args[0]);
			if (2 === l) return fn.call(ctx, args[0], args[1]);
			if (3 === l) return fn.call(ctx, args[0], args[1], args[2]);
			if (4 === l) return fn.call(ctx, args[0], args[1], args[2], args[3]);
	
			return fn.apply(ctx, args);
		};
	
		fn_doNothing = function () {
			return false;
		};
	
		fn_createByPattern = function (definitions, ctx) {
			var imax = definitions.length;
			return function () {
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
	
				console.error("InvalidArgumentException for a function", definitions, arguments);
				return null;
			};
		};
	})();
	
	// end:source /src/fn.js
	// source /src/str.js
	var str_format;
	(function () {
		str_format = function (str_) {
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
		(function () {
			rgxNum = function (num) {
				return cache_[num] || (cache_[num] = new RegExp("\\{" + num + "\\}", "g"));
			};
			var cache_ = {};
		})();
	})();
	
	// end:source /src/str.js
	// source /src/class.js
	/**
	 * create([...Base], Proto)
	 * Base: Function | Object
	 * Proto: Object {
	 *    constructor: ?Function
	 *    ...
	 */
	var class_create,
	
	// with property accessor functions support
	class_createEx;
	(function () {
	
		class_create = createClassFactory(obj_extendDefaults);
		class_createEx = createClassFactory(obj_extendPropertiesDefaults);
	
		function createClassFactory(extendDefaultsFn) {
			return function () {
				var args = _Array_slice.call(arguments),
				    Proto = args.pop();
				if (Proto == null) Proto = {};
	
				var Ctor = Proto.hasOwnProperty("constructor") ? Proto.constructor : function ClassCtor() {};
	
				var i = args.length,
				    BaseCtor,
				    x;
				while (--i > -1) {
					x = args[i];
					if (typeof x === "function") {
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
			return function () {
				var args = _Array_slice.call(arguments);
				var x = fnA.apply(this, args);
				if (x !== void 0) return x;
	
				return fnB.apply(this, args);
			};
		}
	})();
	
	// end:source /src/class.js
	// source /src/error.js
	var error_createClass, error_formatSource, error_formatCursor, error_cursor;
	
	(function () {
		error_createClass = function (name, Proto, stackSliceFrom) {
			var Ctor = _createCtor(Proto, stackSliceFrom);
			Ctor.prototype = new Error();
	
			Proto.constructor = Error;
			Proto.name = name;
			obj_extend(Ctor.prototype, Proto);
			return Ctor;
		};
	
		error_formatSource = function (source, index, filename) {
			var cursor = error_cursor(source, index),
			    lines = cursor[0],
			    lineNum = cursor[1],
			    rowNum = cursor[2],
			    str = "";
			if (filename != null) {
				str += str_format(" at {0}({1}:{2})\n", filename, lineNum, rowNum);
			}
			return str + error_formatCursor(lines, lineNum, rowNum);
		};
	
		/**
	  * @returns [ lines, lineNum, rowNum ]
	  */
		error_cursor = function (str, index) {
			var lines = str.substring(0, index).split("\n"),
			    line = lines.length,
			    row = index + 1 - lines.slice(0, line - 1).join("\n").length;
			if (line > 1) {
				// remote trailing newline
				row -= 1;
			}
			return [str.split("\n"), line, row];
		};
	
		(function () {
			error_formatCursor = function (lines, lineNum, rowNum) {
	
				var BEFORE = 3,
				    AFTER = 2,
				    i = lineNum - BEFORE,
				    imax = i + BEFORE + AFTER,
				    str = "";
	
				if (i < 0) i = 0;
				if (imax > lines.length) imax = lines.length;
	
				var lineNumberLength = String(imax).length,
				    lineNumber;
	
				for (; i < imax; i++) {
					if (str) str += "\n";
	
					lineNumber = ensureLength(i + 1, lineNumberLength);
					str += lineNumber + "|" + lines[i];
	
					if (i + 1 === lineNum) {
						str += "\n" + repeat(" ", lineNumberLength + 1);
						str += lines[i].substring(0, rowNum - 1).replace(/[^\s]/g, " ");
						str += "^";
					}
				}
				return str;
			};
	
			function ensureLength(num, count) {
				var str = String(num);
				while (str.length < count) {
					str += " ";
				}
				return str;
			}
			function repeat(char_, count) {
				var str = "";
				while (--count > -1) {
					str += char_;
				}
				return str;
			}
		})();
	
		function _createCtor(Proto, stackFrom) {
			var Ctor = Proto.hasOwnProperty("constructor") ? Proto.constructor : null;
	
			return function () {
				obj_defineProperty(this, "stack", {
					value: _prepairStack(stackFrom || 3)
				});
				obj_defineProperty(this, "message", {
					value: str_format.apply(this, arguments)
				});
				if (Ctor != null) {
					Ctor.apply(this, arguments);
				}
			};
		}
	
		function _prepairStack(sliceFrom) {
			var stack = new Error().stack;
			return stack == null ? null : stack.split("\n").slice(sliceFrom).join("\n");
		}
	})();
	
	// end:source /src/error.js
	
	// source /src/class/Dfr.js
	var class_Dfr;
	(function () {
		class_Dfr = function () {};
		class_Dfr.prototype = {
			_isAsync: true,
			_done: null,
			_fail: null,
			_always: null,
			_resolved: null,
			_rejected: null,
	
			defer: function defer() {
				this._rejected = null;
				this._resolved = null;
				return this;
			},
			isResolved: function isResolved() {
				return this._resolved != null;
			},
			isRejected: function isRejected() {
				return this._rejected != null;
			},
			isBusy: function isBusy() {
				return this._resolved == null && this._rejected == null;
			},
			resolve: function resolve() {
				var done = this._done,
				    always = this._always;
	
				this._resolved = arguments;
	
				dfr_clearListeners(this);
				arr_callOnce(done, this, arguments);
				arr_callOnce(always, this, [this]);
	
				return this;
			},
			reject: function reject() {
				var fail = this._fail,
				    always = this._always;
	
				this._rejected = arguments;
	
				dfr_clearListeners(this);
				arr_callOnce(fail, this, arguments);
				arr_callOnce(always, this, [this]);
				return this;
			},
			then: function then(filterSuccess, filterError) {
				return this.pipe(filterSuccess, filterError);
			},
			done: function done(callback) {
				if (this._rejected != null) {
					return this;
				}return dfr_bind(this, this._resolved, this._done || (this._done = []), callback);
			},
			fail: function fail(callback) {
				if (this._resolved != null) {
					return this;
				}return dfr_bind(this, this._rejected, this._fail || (this._fail = []), callback);
			},
			always: function always(callback) {
				return dfr_bind(this, this._rejected || this._resolved, this._always || (this._always = []), callback);
			},
			pipe: function pipe(mix /* ..methods */) {
				var dfr;
				if (typeof mix === "function") {
					dfr = new class_Dfr();
					var done_ = mix,
					    fail_ = arguments.length > 1 ? arguments[1] : null;
	
					this.done(delegate(dfr, "resolve", done_)).fail(delegate(dfr, "reject", fail_));
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
						case "done":
							done = true;
							break;
						case "fail":
							fail = true;
							break;
						default:
							console.error("Unsupported pipe channel", arguments[i]);
							break;
					}
				}
				done && this.done(delegate(dfr, "resolve"));
				fail && this.fail(delegate(dfr, "reject"));
	
				function pipe(dfr, method) {
					return function () {
						dfr[method].apply(dfr, arguments);
					};
				}
				function delegate(dfr, name, fn) {
					return function () {
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
			pipeCallback: function pipeCallback() {
				var self = this;
				return function (error) {
					if (error != null) {
						self.reject(error);
						return;
					}
					var args = _Array_slice.call(arguments, 1);
					fn_apply(self.resolve, self, args);
				};
			},
			resolveDelegate: function resolveDelegate() {
				return fn_proxy(this.resolve, this);
			},
	
			rejectDelegate: function rejectDelegate() {
				return fn_proxy(this.reject, this);
			} };
	
		class_Dfr.run = function (fn, ctx) {
			var dfr = new class_Dfr();
			if (ctx == null) ctx = dfr;
	
			fn.call(ctx, fn_proxy(dfr.resolve, ctx), fn_proxy(dfr.reject, dfr), dfr);
			return dfr;
		};
	
		// PRIVATE
	
		function dfr_bind(dfr, arguments_, listeners, callback) {
			if (callback == null) {
				return dfr;
			}if (arguments_ != null) fn_apply(callback, dfr, arguments_);else listeners.push(callback);
	
			return dfr;
		}
	
		function dfr_clearListeners(dfr) {
			dfr._done = null;
			dfr._fail = null;
			dfr._always = null;
		}
	
		function arr_callOnce(arr, ctx, args) {
			if (arr == null) {
				return;
			}var imax = arr.length,
			    i = -1,
			    fn;
			while (++i < imax) {
				fn = arr[i];
	
				if (fn) fn_apply(fn, ctx, args);
			}
			arr.length = 0;
		}
		function isDeferred(x) {
			if (x == null || typeof x !== "object") {
				return false;
			}if (x instanceof class_Dfr) {
				return true;
			}return typeof x.done === "function" && typeof x.fail === "function";
		}
	})();
	
	// end:source /src/class/Dfr.js
	// source /src/class/EventEmitter.js
	var class_EventEmitter;
	(function () {
	
		class_EventEmitter = function () {
			this._listeners = {};
		};
		class_EventEmitter.prototype = {
			on: function on(event, fn) {
				if (fn != null) {
					(this._listeners[event] || (this._listeners[event] = [])).push(fn);
				}
				return this;
			},
			once: function once(event, fn) {
				if (fn != null) {
					fn._once = true;
					(this._listeners[event] || (this._listeners[event] = [])).push(fn);
				}
				return this;
			},
	
			pipe: function pipe(event) {
				var that = this,
				    args;
				return function () {
					args = _Array_slice.call(arguments);
					args.unshift(event);
					fn_apply(that.trigger, that, args);
				};
			},
	
			emit: event_trigger,
			trigger: event_trigger,
	
			off: function off(event, fn) {
				var listeners = this._listeners[event];
				if (listeners == null) {
					return this;
				}if (arguments.length === 1) {
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
	
			if (fns == null) {
				return this;
			}for (imax = fns.length; i < imax; i++) {
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
	})();
	
	// end:source /src/class/EventEmitter.js
	// source /src/class/Uri.es6
	"use strict";
	
	var class_Uri;
	(function () {
	
		class_Uri = class_create({
			protocol: null,
			value: null,
			path: null,
			file: null,
			extension: null,
	
			constructor: function constructor(uri) {
				if (uri == null) {
					return this;
				}if (util_isUri(uri)) {
					return uri.combine("");
				}uri = normalize_uri(uri);
	
				this.value = uri;
	
				parse_protocol(this);
				parse_host(this);
	
				parse_search(this);
				parse_file(this);
	
				// normilize path - "/some/path"
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
	
				// win32 - is base drive
				if (/^\/?[a-zA-Z]+:\/?$/.test(path)) {
					return this;
				}
	
				this.path = path.replace(/\/?[^\/]+\/?$/i, "");
				return this;
			},
			/**
	   * '/path' - relative to host
	   * '../path', 'path','./path' - relative to current path
	   */
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
			/**
	   * @return Current Uri Path{String} that is relative to @arg1 Uri
	   */
			toRelativeString: function toRelativeString(uri) {
				if (typeof uri === "string") uri = new class_Uri(uri);
	
				if (this.path.indexOf(uri.path) === 0) {
					// host folder
					var p = this.path ? this.path.replace(uri.path, "") : "";
					if (p[0] === "/") p = p.substring(1);
	
					return util_combinePathes(p, this.file) + (this.search || "");
				}
	
				// sub folder
				var current = this.path.split("/"),
				    relative = uri.path.split("/"),
				    commonpath = "",
				    i = 0,
				    length = Math.min(current.length, relative.length);
	
				for (; i < length; i++) {
					if (current[i] === relative[i]) continue;
	
					break;
				}
	
				if (i > 0) commonpath = current.splice(0, i).join("/");
	
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
			for (var i = 0, x, imax = arguments.length; i < imax; i++) {
				x = arguments[i];
				if (!x) continue;
	
				if (!str) {
					str = x;
					continue;
				}
	
				if (str[str.length - 1] !== "/") str += "/";
	
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
			return str.replace(/\\/g, "/").replace(/^\.\//, "")
	
			// win32 drive path
			.replace(/^(\w+):\/([^\/])/, "/$1:/$2");
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
			}obj.protocol = match[1];
			obj.value = obj.value.substring(match[0].length);
		}
	
		function parse_host(obj) {
			if (obj.protocol == null) {
				return;
			}if (obj.protocol === "file") {
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
			}obj.search = obj.value.substring(question);
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
	/*args*/
	//# sourceMappingURL=Uri.es6.map
	// end:source /src/class/Uri.es6
	// end:source /ref-utils/lib/utils.embed.js
	
	function assert_TestDom(container, mix, model, compo) {
		var _ref;
	
		return (_ref = new Conductor()).process.apply(_ref, arguments);
	}
	
	// source ./utils/is.js
	(function () {})();
	
	// end:source ./utils/is.js
	// source ./utils/object.js
	var obj_typeof, obj_inherit, obj_extend, obj_keys;
	
	(function () {
	
		obj_typeof = function (x) {
			return Object.prototype.toString.call(x).replace("[object ", "").replace("]", "");
		};
	
		obj_inherit = function (Ctor, base) {
	
			function temp() {}
			temp.prototype = base.prototype;
	
			Ctor.prototype = new temp();
		};
	
		obj_keys = Object.keys ? Object.keys : getKeys;
	
		obj_extend = function (target, source) {
			if (target == null) target = {};
	
			if (source == null) return target;
	
			for (var key in source) {
				target[key] = source[key];
			}
	
			return target;
		};
	
		// private
	
		function getKeys(obj) {
			var keys = [];
			for (var key in keys) keys.push(key);
	
			return keys;
		}
	})();
	
	// end:source ./utils/object.js
	// source ./utils/log.es6
	"use strict";
	
	var log_error;
	(function () {
		log_error = console.error.bind(console, "<TestDom>");
	})();
	//# sourceMappingURL=log.es6.map
	// end:source ./utils/log.es6
	// source ./utils/dfr.es6
	"use strict";
	
	var dfr_call, dfr_bind, dfr_clear;
	(function () {
	
		dfr_call = function (cbs, args) {
			if (cbs == null) return;
	
			for (var i = 0; i < cbs.length; i++) {
				cbs[i].apply(null, args || []);
			}
		};
	
		dfr_bind = function (dfr, type, cb) {
			if (cb == null) return;
			var name = "_" + type + "Cb";
			var cbs = dfr[name];
			if (cbs == null) cbs = dfr[name] = [];
	
			cbs.push(cb);
		};
	
		dfr_clear = function (dfr) {
			arr_clear(dfr._rejectCb);
			arr_clear(dfr._alwaysCb);
			arr_clear(dfr._resolveCb);
		};
	
		function arr_clear(arr) {
			if (arr != null) arr.length = 0;
		}
	})();
	//# sourceMappingURL=dfr.es6.map
	// end:source ./utils/dfr.es6
	// source ./utils/node.es6
	"use strict";
	
	var _slicedToArray = function _slicedToArray(arr, i) {
		if (Array.isArray(arr)) {
			return arr;
		} else if (Symbol.iterator in Object(arr)) {
			var _arr = [];for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
				_arr.push(_step.value);if (i && _arr.length === i) break;
			}return _arr;
		} else {
			throw new TypeError("Invalid attempt to destructure non-iterable instance");
		}
	};
	
	var node_evalMany, node_eval, node_resolveFirstAttrKey, node_getAttrArgs;
	
	(function () {
		node_evalMany = function () {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}
	
			args.unshift(mask.Utils.Expression.evalStatements);
			return run.apply(null, args);
		};
	
		node_eval = function () {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}
	
			args.unshift(mask.Utils.Expression.evalStatements);
			return run.apply(null, args)[0];
		};
		node_resolveFirstAttrKey = function (node) {
			var x = null;
			for (x in node.attr) break;
			if (x == null) {
				return null;
			}
	
			delete node.attr[x];
			return x;
		};
		node_getAttrArgs = function (node) {
			var args = [],
			    attr = node.attr,
			    obj = {},
			    hasObject = false;
			for (var key in attr) {
				if (key === attr[key]) {
					var val = key;
					if (/^[-+\d.]+$/.test(val)) {
						val = parseFloat(val);
					}
					args.push(val);
					continue;
				}
				hasObject = true;
				obj[key] = attr[key];
			}
			var imax = args.length,
			    i = -1;
			while (++i < imax) {
				if (typeof args[0] === "number") {
					var _args$splice = args.splice(0, 1);
	
					var _args$splice2 = _slicedToArray(_args$splice, 1);
	
					var num = _args$splice2[0];
	
					args.push(num);
					continue;
				}
				break;
			}
			if (hasObject) {
				args.push(obj);
			}
			return args;
		};
	
		function run(fn, node, model, compo) {
			var expr = node.expression;
			if (expr == null || expr === "") {
				return [];
			}
			return fn(expr, model, null, compo);
		}
	})();
	//# sourceMappingURL=node.es6.map
	// end:source ./utils/node.es6
	// source ./utils/eventLoop.es6
	"use strict";
	
	var eventLoop_skip5;
	(function () {
		eventLoop_skip5 = nTickDelegate(5);
	
		function nTickDelegate(ticks) {
			return function (fn) {
				var count = ticks;
				function tickFn() {
					if (--count < 0) {
						return fn();
					}
					setTimeout(tickFn);
				};
				tickFn();
			};
		}
	})();
	//# sourceMappingURL=eventLoop.es6.map
	// end:source ./utils/eventLoop.es6
	
	// source ./options.es6
	"use strict";
	
	var options = {
		report: null
	};
	(function () {
	
		assert_TestDom.config = function (mix) {
			if (typeof mix === "sttring") {
				return options[mix];
			}
	
			obj_extend(options, mix);
			return assert_TestDom;
		};
	})();
	//# sourceMappingURL=options.es6.map
	// end:source ./options.es6
	// source ./Reporter.es6
	"use strict";
	
	var Reporter, ProgressReporter_DOM;
	
	(function () {
		Reporter = {
			report: function report(error, runner) {
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
			}
		};
	
		ProgressReporter_DOM = function (el) {
			var lines = [];
			var pre = mask.render("\n\t\t\tpre > +each(.) > div {\n\t\t\t\tspan style='color: ~[: errored ? \"red\" : \"green\"]' > '~[hint]'\n\t\t\t\tspan > '~[text]'\n\t\t\t}\n\t\t", lines);
			el.appendChild(pre);
	
			return function (runner, node, error) {
				lines.push({
					text: runner.formatCurrentLine_(error),
					hint: error ? "✘ " : "✓ ",
					errored: Boolean(error)
				});
				if (error) {
					lines.push({
						text: String(error),
						hint: " "
					});
				}
			};
		};
	})();
	//# sourceMappingURL=Reporter.es6.map
	// end:source ./Reporter.es6
	
	// source ./Conductor.es6
	"use strict";
	
	var Conductor = class_create(class_EventEmitter, class_Dfr, {
	
		defaultDriver: "domlib",
		driver: null,
		runners: null,
		index: 0,
		constructor: function constructor(driverName, options) {
			this.driver = Drivers.initialize(driverName || this.defaultDriver, options);
			this.runners = [];
		},
		process: function process(container, mix, model, compo) {
			var _this = this;
	
			this.initRunners_.apply(this, arguments);
	
			// wait 5 Ticks and run, jQuery.simulate workarounds
			eventLoop_skip5(function () {
				return _this.next();
			});
			return this;
		},
		next: function next(error) {
			var _this = this;
	
			if (error) {
				var errors = this.runners.reduce(function (aggr, x) {
					return aggr.concat(x.errors);
				}, []);
				this.emit("complete", errors);
				this.reject(error);
				return;
			}
			if (this.index >= this.runners.length) {
				var errors = this.runners.reduce(function (aggr, x) {
					return aggr.concat(x.errors);
				}, []);
				this.emit("complete", errors);
				this.resolve();
				return;
			}
			this.runners[this.index++].process().done(function () {
				return _this.next();
			}).fail(function (error) {
				return _this.next(error);
			});
		},
	
		attachReporter: function attachReporter(Reporter) {
			this.runners.forEach(function (x) {
				return x.attachReporter(Reporter);
			});
			return this;
		},
	
		initRunners_: function initRunners_(container, mix, model, compo) {
			var _this = this;
	
			if (arguments.length === 0) {
				return;
			}
	
			var arr = mix;
			if (Array.isArray(mix) === false) {
				arr = [mix];
			}
			arr.map(function (suite) {
				return _this.addRunner(container, mix, model, compo);
			});
		},
		addRunner: function addRunner(container, mix, model, compo) {
			var _this = this;
	
			var suite = mix;
			if (typeof suite === "string") {
				suite = mask.parse(suite);
				if (suite.type !== mask.Dom.FRAGMENT) {
					suite = { nodes: [suite] };
				}
			}
	
			var runner = IRunner.create(this.driver, container, suite, model, compo);
			this.runners.push(runner);
			runner.on("progress", function () {
				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}
	
				return _this.emit.apply(_this, ["progress"].concat(args));
			});
		}
	
	});
	//# sourceMappingURL=Conductor.es6.map
	// end:source ./Conductor.es6
	// source ./runners/exports.es6
	// source ./IRunner.es6
	"use strict";
	
	var _toConsumableArray = function _toConsumableArray(arr) {
		if (Array.isArray(arr)) {
			for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
		} else {
			return Array.from(arr);
		}
	};
	
	var IRunner = class_create(class_EventEmitter, class_Dfr, {
		constructor: function Runner(driver, container, suite, model, compo) {
			this.errors = [];
			this.model = model;
			this.compo = compo;
			this.driver = driver;
			this.backtrace = new Error().stack;
			this.process = this.process.bind(this);
			this.next_ = this.next_.bind(this);
			this.wrapAssertion_();
		},
		stack: null,
		assert: null,
		process: function process(error) {
			throw Error("Not implemented");
			return this;
		},
	
		attachReporter: function attachReporter(Reporter) {
			new Reporter(this);
			return this;
		},
	
		next_: function assert_Next(error) {
			this.emit("progress", this, this.getCurrent_().node, error);
			this.process(error);
		},
	
		getCurrent_: function getCurrent_() {
			return this.stack[this.stack.length - 1];
		},
		getCurrentModel_: function getCurrentModel_() {
			var el = this.getCurrent_().$;
			if (el.model) {
				return el.model() || this.model;
			}
			return this.model;
		},
		getCurrentCompo_: function getCurrentCompo_() {
			var el = this.getCurrent_().$;
			if (el.compo) {
				return el.compo() || this.compo;
			}
			return this.compo;
		},
		getCurrentArgs_: function getCurrentArgs_() {
			var node = this.getCurrent_().node;
			var attrArgs = node_getAttrArgs(node);
			var exprArgs = node_evalMany(node, this.getCurrentModel_(), this.getCurrentCompo_());
			return [].concat(_toConsumableArray(attrArgs), _toConsumableArray(exprArgs));
		},
	
		getNext_: function getNext_(goDeep) {
			var current = this.getCurrent_();
			if (current == null) {
				return null;
			}if (goDeep !== false && current.node.nodes) {
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
					console.error("Node not found");
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
	
		check: function check(ctx) {
			var _driver;
	
			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
			}
	
			var name = args[0];
			var arr = args.slice(1);
	
			var fn = this.assert[name] || this.assert[name + "_"];
			if (typeof fn !== "function") {
				arr.unshift(name);
				fn = this.assert.equal;
			}
	
			if (arr.length < 2) {
				logger.log("throw", arr);
				throw Error("Invalid arguments in assertion");
			}
	
			var actualKey = arr.shift(),
			    expect = arr.pop(),
			    actual = (_driver = this.driver).getActual.apply(_driver, [ctx, actualKey].concat(_toConsumableArray(arr)));
	
			return fn.call(this.assert, actual, expect);
		},
		checkAsync: function checkAsync(ctx) {
			var _this = this;
	
			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
			}
	
			var name = args[0];
			var arr = args.slice(1);
	
			var fn = this.assert[name] || this.assert[name + "_"];
			if (typeof fn !== "function") {
				arr.unshift(name);
				fn = this.assert.equal;
			}
	
			if (arr.length < 2) {
				logger.log("throw", arr);
				throw Error("Invalid arguments in assertion");
			}
	
			var actualKey = arr.shift(),
			    expect = arr.pop();
	
			return class_Dfr.run(function (resolve, reject) {
				var _driver;
	
				(_driver = _this.driver).getActualAsync.apply(_driver, [ctx, actualKey].concat(_toConsumableArray(arr))).done(function (actual) {
					var err = fn.call(_this.assert, actual, expect);
					if (err) {
						reject(err);
						return;
					}
					resolve();
				}).fail(reject);
			});
		},
		try_: function try_(fn) {
			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
			}
	
			var error;
			try {
				fn.apply(null, args);
			} catch (err) {
				error = err;
			}
			return error;
		},
		call: function call(fn) {
			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
			}
	
			var error = this.try_.apply(this, [fn].concat(args));
			this.report_(error);
			return error;
		},
	
		run_: function run_(fn, args, ctx) {
			var error;
			try {
				fn.apply(ctx, args);
			} catch (err) {
				error = err;
			}
			this.report_(error);
			return error;
		},
	
		report_: function report_(error) {
			error = this.prepairError_(error);
			Reporter.report(error, this);
	
			this.emit(error ? "fail" : "success", error);
			if (error) {
				this.errors.push(error);
			}
		},
		wrapAssertion_: function wrapAssertion_() {
			var _this = this;
	
			if (this.assert != null) {
				return this.assert;
			}var wrap = function wrap(key) {
				return function () {
					for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
						args[_key] = arguments[_key];
					}
	
					var fn = key && assert[key] || assert;
					return _this.call.apply(_this, [fn].concat(args));
				};
			};
	
			this.assert = wrap();
	
			for (var key in assert) {
				if (typeof assert[key] === "function") {
					this.assert[key] = wrap(key);
				}
			}
			return this.assert;
		},
	
		prepairError_: function prepairError_(error) {
			if (error == null) {
				return null;
			}var node = this.getCurrent_().node,
			    stack = mask.parser.getStackTrace && mask.parser.getStackTrace(node) || "";
	
			Object.defineProperty(error, "stack", {
				value: stack + "\n" + assert.prepairStack(this.backtrace),
				writable: true,
				enumerable: true,
				configurable: true
			});
	
			error.generatedMessage = false;
			return error;
		},
	
		formatCurrentLine_: function formatCurrentLine_(error) {
			var node = this.getCurrent_().node,
			    indent = "";
	
			var parent = node.parent;
			while (parent != null && parent.type !== mask.Dom.FRAGMENT) {
				indent += "  ";
				parent = parent.parent;
			}
			return indent + mask.stringify({
				tagName: node.tagName,
				attr: node.attr,
				expression: node.expression
			}, 2).slice(0, -1);
		} });
	
	IRunner.create = function (driver, container, suite, model, compo) {
		if (typeof suite === "function") {
			return RunnerFn(driver, container, suite, model, compo);
		}
		return new RunnerNodes(driver, container, suite, model, compo);
	};
	//# sourceMappingURL=IRunner.es6.map
	// end:source ./IRunner.es6
	// source ./RunnerFn.es6
	"use strict";
	
	var RunnerFn = class_create(IRunner, {
	
		constructor: function Runner(container, fn, model, compo) {
			this.container = container;
			this.model = model;
			this.fn = fn;
		},
	
		process: function assert_TestDom() {
			var _this = this;
	
			try {
				if (this.fn.length === 0) {
					this.fn();
				} else {
					this.fn(function (error) {
						if (error) {
							_this.report_(error);
							_this.reject(error);
							return;
						}
						_this.resolve();
					});
				}
			} catch (error) {
				this.report_(error);
				this.reject(error);
			}
			return this;
		}
	});
	//# sourceMappingURL=RunnerFn.es6.map
	// end:source ./RunnerFn.es6
	// source ./RunnerNodes.es6
	"use strict";
	
	var RunnerNodes = class_create(IRunner, {
	
		constructor: function Runner(driver, root, node, model, compo) {
			this.root = root;
			this.node = node;
			this.$ = null;
			this.stack = [];
		},
	
		createRoot: function createRoot() {
			var _this = this;
	
			return this.driver.createRoot(this.root).done(function ($) {
				_this.$ = $;
				_this.stack = [{
					$: $,
					node: _this.node
				}];
			});
		},
	
		process: function assert_TestDom(error) {
			var _this = this;
	
			if (error == null && this.$ == null) {
				this.createRoot().done(function () {
					return _this.process();
				}).fail(function (error) {
					return _this.process(error);
				});
				return this;
			}
			if (error && this.errors[this.errors.length - 1] !== error) {
				this.errors.push(error);
			}
	
			var current = this.getNext_(error == null);
			if (current == null) {
				this.emit("complete", this.errors);
	
				if (this.errors.length) {
					this.reject(this.errors);
				} else {
					this.resolve();
				}
				return;
			}
	
			this.driver.process(this, current, this.next_);
			return this;
		} });
	//# sourceMappingURL=RunnerNodes.es6.map
	// end:source ./RunnerNodes.es6
	//# sourceMappingURL=exports.es6.map
	// end:source ./runners/exports.es6
	// source ./drivers/exports.es6
	"use strict";
	
	var Drivers;
	
	(function () {
	
		Drivers = {
			initialize: function initialize(name) {
				var options = arguments[1] === undefined ? null : arguments[1];
	
				var Ctor = Drivers[name] || require(name);
				return new Ctor(options);
			} };
	
		// source ./abstract/exports.es6
		//-import ./IActorAction.es6
		//-import ./IActorAssertion.es6
		// source ./IActorCollection.es6
		"use strict";
	
		var IActorCollection = class_create({
	
			constructor: function constructor() {
				this.actors = {};
			},
			canHandle: function canHandle(runner, driver, current) {
				var name = current.node.tagName;
				var x = this.actors[name];
				if (x == null) {
					return false;
				}
				if (typeof x.canHandle === "function") {
					return x.canHandle(runner, driver, current);
				}
				return true;
			},
			process: function process(runner, driver, current, next) {
				var name = current.node.tagName;
				var x = this.actors[name];
				if (typeof x === "function") {
					x.apply(undefined, arguments);
					return;
				}
				x.process.apply(x, arguments);
			},
			define: function define(name, mix) {
				if (mix == null) {
					return this;
				}
				this.actors[name] = mix;
				return this;
			}
		});
		//# sourceMappingURL=IActorCollection.es6.map
		// end:source ./IActorCollection.es6
		// source ./IActorEvent.es6
		"use strict";
	
		var IEvent = class_create({
			trigger: /*virtual*/function trigger(ctx, event) {
				for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
					args[_key - 2] = arguments[_key];
				}
	
				return new class_Dfr().resolve();
			}
		});
		//# sourceMappingURL=IActorEvent.es6.map
		// end:source ./IActorEvent.es6
		// source ./IActorTraverser.es6
		"use strict";
	
		var ITraverser = class_create({
			traverse: /*virtual*/function traverse(name, ctx, selector, done) {
				done();
			}
		});
		//# sourceMappingURL=IActorTraverser.es6.map
		// end:source ./IActorTraverser.es6
		// source ./IDriverActionCollection.es6
		"use strict";
	
		var _toArray = function _toArray(arr) {
			return Array.isArray(arr) ? arr : Array.from(arr);
		};
	
		var _toConsumableArray = function _toConsumableArray(arr) {
			if (Array.isArray(arr)) {
				for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
			} else {
				return Array.from(arr);
			}
		};
	
		var IDriverActionCollection = class_create(IActorCollection, {
			constructor: function constructor() {
				var _this = this;
	
				this.define("with", function (runner, driver, current, next) {
					var selector = driver.Traversers.getSelector(current);
					switch (selector) {
						case "model":
							current.$ = runner.getCurrentModel_();
							next();
							return;
					}
	
					current.node.tagName = "find";
					driver.Traversers.process(runner, driver, current, next);
				});
	
				this.define("debugger", function (runner, driver, current, done) {
					var ctx = current.$;
					debugger;
					done();
				});
	
				this.define("function", function (runner, driver, current, done) {
					var fn = current.node.fn,
					    ctx = current.$,
					    assert = runner.wrapAssertion_();
					if (fn.length === 3) {
						fn(ctx, assert, done);
						return;
					}
					fn(ctx, assert);
					done();
				});
				this.define("do", function (runner, driver, current, done) {
					var _driver$Events;
	
					var _runner$getCurrentArgs_ = runner.getCurrentArgs_();
	
					var _runner$getCurrentArgs_2 = _toArray(_runner$getCurrentArgs_);
	
					var event = _runner$getCurrentArgs_2[0];
	
					var args = _runner$getCurrentArgs_2.slice(1);
	
					(_driver$Events = driver.Events).run.apply(_driver$Events, [runner, driver, event, current.$].concat(_toConsumableArray(args))).always(function () {
						return done();
					});
				});
	
				this.define("trigger", function (runner, driver, current, done) {
					var _driver$Events;
	
					var _runner$getCurrentArgs_ = runner.getCurrentArgs_();
	
					var _runner$getCurrentArgs_2 = _toArray(_runner$getCurrentArgs_);
	
					var event = _runner$getCurrentArgs_2[0];
	
					var args = _runner$getCurrentArgs_2.slice(1);
	
					(_driver$Events = driver.Events).run.apply(_driver$Events, [runner, driver, event, current.$].concat(_toConsumableArray(args))).always(function () {
						return done();
					});
				});
	
				this.define("define", function (owner, runner, current, done) {
					var name = current.node.tagName,
					    nodes = current.node.nodes;
	
					current.node.nodes = null;
					_this.define(name, function (owner, runner, current, done) {
						current.node.nodes = nodes;
						done();
					});
					done();
				});
	
				this.define("call", function (runner, driver, current, done) {
					var name = node_resolveFirstAttrKey(current.node),
					    args = runner.getCurrentArgs_(),
					    ctx = current.$,
					    fn = ctx[name];
	
					if (typeof fn !== "function") {
						done("" + name + " is not a function");
						return;
					}
					var error = runner.try_.apply(runner, [fn.bind(ctx)].concat(_toConsumableArray(args)));
					if (error) {
						done(error);
						return;
					}
					setTimeout(done);
				});
	
				this.define("await", function (runner, driver, current, done) {
					var expression = current.node.expression;
					if (expression == null) {
						done("`await` node expect expression: timeout ms or a selector");
						return;
					}
					var mix = mask.Utils.Expression.eval(expression);
					if (typeof mix === "number") {
						setTimeout(done, mix);
						return;
					}
	
					var selector = driver.Traversers.getSelector(current);
					var INTERVAL = 100;
					var MAX = 1600;
					var i = 0;
					var ctx = current.$;
					function check() {
						driver.Traversers.actors.find.traverse(ctx, selector, function (x) {
							if (driver.Traversers.isEmpty(x)) {
								if (i < MAX) {
									i += INTERVAL;
									setTimeout(check, INTERVAL);
									return;
								}
	
								done("<await> Elements are not resolved: " + selector);
								return;
							}
							driver.Traversers.run(runner, driver, "find", ctx, selector).done(function () {
								return done();
							});
						});
					}
					check();
				});
			}
		});
		//# sourceMappingURL=IDriverActionCollection.es6.map
		// end:source ./IDriverActionCollection.es6
		// source ./IDriverAssertionCollection.es6
		"use strict";
	
		var _slicedToArray = function _slicedToArray(arr, i) {
			if (Array.isArray(arr)) {
				return arr;
			} else if (Symbol.iterator in Object(arr)) {
				var _arr = [];for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
					_arr.push(_step.value);if (i && _arr.length === i) break;
				}return _arr;
			} else {
				throw new TypeError("Invalid attempt to destructure non-iterable instance");
			}
		};
	
		var _toConsumableArray = function _toConsumableArray(arr) {
			if (Array.isArray(arr)) {
				for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
			} else {
				return Array.from(arr);
			}
		};
	
		var IDriverAssertionCollection = class_create(IActorCollection, {
			process: function process(runner, driver, current, next) {
				var name = current.node.tagName,
				    ctx = current.$,
				    args = runner.getCurrentArgs_();
	
				var actor = this.actors[name];
				if (actor) {
					actor(runner, driver, ctx, args, next);
					return;
				}
	
				this.assert(runner, driver, ctx, name, args, next);
			},
	
			canHandle: function canHandle(runner, driver, current) {
				return driver.isOwnCtx(current.$);
			},
	
			assert: function assert(runner, driver, ctx, name, args, next) {
				throw Error("Not implemented");
			},
	
			canHandleBase: function canHandleBase(runner, driver, current) {
				var name = current.node.tagName,
				    ctx = current.$;
	
				var fn = runner.assert[name] || runner.assert[name + "_"];
				if (typeof fn !== "function") {
					return ctx[name] !== void 0;
				}
	
				var _runner$getCurrentArgs_ = runner.getCurrentArgs_();
	
				var _runner$getCurrentArgs_2 = _slicedToArray(_runner$getCurrentArgs_, 1);
	
				var key = _runner$getCurrentArgs_2[0];
	
				return ctx[key] !== void 0;
			},
			processBase: function processBase(runner, driver, current, done) {
				var name = current.node.tagName,
				    ctx = current.$,
				    args = runner.getCurrentArgs_();
	
				var error = runner.check.apply(runner, [ctx, name].concat(_toConsumableArray(args)));
				done(error);
			}
		});
		//# sourceMappingURL=IDriverAssertionCollection.es6.map
		// end:source ./IDriverAssertionCollection.es6
		// source ./IDriverEventCollection.es6
		"use strict";
	
		var _toConsumableArray = function _toConsumableArray(arr) {
			if (Array.isArray(arr)) {
				for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
			} else {
				return Array.from(arr);
			}
		};
	
		var IDriverEventCollection = class_create(IActorCollection, {
			process: function process(runner, driver, current, next) {
	
				var event = current.node.tagName,
				    args = runner.getCurrentArgs_() || [],
				    ctx = current.$;
	
				this.run.apply(this, [runner, driver, event, ctx].concat(_toConsumableArray(args))).done(function () {
					return next();
				}).fail(next);
			},
			run: function run(runner, driver, event, ctx) {
				var _this = this;
	
				for (var _len = arguments.length, args = Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++) {
					args[_key - 4] = arguments[_key];
				}
	
				return class_Dfr.run(function (resolve, reject) {
					driver.beforeEvent && driver.beforeEvent(runner);
					var actor = _this.actors[event];
					if (actor == null) {
						reject("Event is not defined for the current driver: " + event);
						return;
					}
	
					var dfr = actor.call.apply(actor, [_this, ctx].concat(args));
					if (dfr == null) {
						setTimeout(resolve);
						return;
					}
					dfr.always(function () {
						return setTimeout(resolve);
					});
				});
			}
		});
		//# sourceMappingURL=IDriverEventCollection.es6.map
		// end:source ./IDriverEventCollection.es6
		// source ./IDriverTraverserCollection.es6
		"use strict";
	
		var IDriverTraverserCollection = class_create(IActorCollection, {
	
			isEmpty: function isEmpty(x) {
				if (x == null) {
					return true;
				}
				if (typeof x.length === "number") {
					return x.length === 0;
				}
				return false;
			},
			process: function process(runner, driver, current, next) {
				var selector = this.getSelector(current),
				    name = current.node.tagName,
				    ctx = current.$;
	
				this.run(runner, driver, name, ctx, selector).done(function () {
					return next();
				}).fail(next);
			},
			getSelector: function getSelector(current) {
				var selector = current.node.expression;
				if (/^\s*('|")/.test(selector)) {
					selector = node_eval(current.node);
				}
				return selector;
			},
			run: function run(runner, driver, fnName, ctx, selector) {
				var _this = this;
	
				return class_Dfr.run(function (resolve, reject) {
					var actor = _this.actors[fnName];
					if (actor == null) {
						reject("Traverser is not found in current driver: " + fnName);
						return;
					}
					actor.traverse(ctx, selector, function (x) {
						var error = runner.assert.notEqual(_this.isEmpty(x), true, "Selector does not matched any elements: " + fnName + "('" + selector + "')");
						if (error) {
							reject(error);
							return;
						}
						runner.getCurrent_().$ = x;
						resolve();
					});
				});
			}
		});
		//# sourceMappingURL=IDriverTraverserCollection.es6.map
		// end:source ./IDriverTraverserCollection.es6
		// source ./IDriver.es6
		"use strict";
	
		var IDriver = class_create({
	
			Traversers: new IDriverTraverserCollection(),
			Events: new IDriverEventCollection(),
			Actions: new IDriverActionCollection(),
			Assertions: new IDriverAssertionCollection(),
	
			options: null,
	
			constructor: function constructor() {
				var options = arguments[0] === undefined ? {} : arguments[0];
	
				this.options = options;
			},
	
			process: function process(runner, current, next) {
	
				var fns = ["Traversers", "Events", "Actions", "Assertions"],
				    imax = fns.length,
				    i = -1;
				while (++i < imax) {
					var collection = this[fns[i]];
					if (collection.canHandle(runner, this, current)) {
						collection.process(runner, this, current, next);
						return;
					}
				}
				if (this.Assertions.canHandleBase(runner, this, current)) {
					this.Assertions.processBase(runner, this, current, next);
					return;
				}
				next("Uknown strategy: " + current.node.tagName);
			},
	
			createRoot: function createRoot(root) {
				return new class_Dfr().reject("Not implemented");
			},
	
			getActual: function getActual(ctx, key) {
				for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
					args[_key - 2] = arguments[_key];
				}
	
				var actual = ctx[key];
				if (typeof actual === "function") {
					return actual.apply(ctx, args);
				}
				return actual;
			},
			getActualAsync: function getActualAsync(ctx, key) {
				for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
					args[_key - 2] = arguments[_key];
				}
	
				var actual = ctx[key];
				if (typeof actual === "function") {
					return actual.apply(ctx, args);
				}
				return ctx.then(function ($) {
					return $[key];
				});
			}
		});
		//# sourceMappingURL=IDriver.es6.map
		// end:source ./IDriver.es6
		//# sourceMappingURL=exports.es6.map
		// end:source ./abstract/exports.es6
		// source ./domlib/domlib.es6
		"use strict";
	
		(function () {
	
			// source ./utils/assert.es6
			"use strict";
	
			var assert_getFn, assert_test;
	
			(function () {
	
				assert_getFn = function (name) {
					if (_isJQuery(name)) {
						return _runJQuery;
					}
					if (_isAlias(name)) {
						return _runAlias;
					}
				};
	
				assert_test = function (ctx, name, args) {
					if (typeof assert[name] !== "function") {
						ctx = ctx[name];
						name = "equal";
					}
	
					assert[name].apply(assert, [ctx].concat(args));
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
					if (typeof mix === "function") {
						var actual = mix.apply($el, args);
						assert.equal(actual, expect);
						return;
					}
					assert.equal(mix, expect);
				};
	
				function _isJQuery(name) {
					return assert.$[name + "_"] != null;
				};
				function _runJQuery($el, name, args) {
					assert.$[name + "_"].apply($el, [$el].concat(args));
				};
			})();
			//# sourceMappingURL=assert.es6.map
			// end:source ./utils/assert.es6
			// source ./utils/traversers.es6
			"use strict";
	
			var traverser_findNative;
			(function () {
				traverser_findNative = function ($el, selector) {
					var set = $(),
					    imax = $el.length,
					    i = -1,
					    arr,
					    x;
					while (++i < imax) {
						x = $el[i];
						if (x.querySelectorAll == null) continue;
						arr = x.querySelectorAll(selector);
						set = set.add(arr);
					}
					return set;
				};
			})();
			//# sourceMappingURL=traversers.es6.map
			// end:source ./utils/traversers.es6
			// source ./utils/runner.es6
			"use strict";
	
			var runner_ensureInDOM;
			(function () {
				runner_ensureInDOM = function (runner) {
					var parent = runner.$.get(0).parentNode,
					    inPage = false;
					while (parent != null) {
						if (parent.nodeType === Node.DOCUMENT_NODE) {
							inPage = true;
							break;
						}
						parent = parent.parentNode;
					}
					if (inPage) return;
	
					runner.$.appendTo("body");
					runner.always(function () {
						return runner.$.remove();
					});
				};
			})();
			//# sourceMappingURL=runner.es6.map
			// end:source ./utils/runner.es6
	
			// source ./traverser.es6
			"use strict";
	
			var DomLibTraversers = class_create(IDriverTraverserCollection, {});
			//# sourceMappingURL=traverser.es6.map
			// end:source ./traverser.es6
			// source ./event.es6
			"use strict";
	
			var DomLibEvents = class_create(IDriverEventCollection, {});
			//# sourceMappingURL=event.es6.map
			// end:source ./event.es6
			// source ./action.es6
			"use strict";
	
			var DomLibActions = class_create(IDriverActionCollection, {});
			//# sourceMappingURL=action.es6.map
			// end:source ./action.es6
			// source ./assertion.es6
			"use strict";
	
			var DomLibAssertions = class_create(IDriverAssertionCollection, {
				assert: function assert(runner, driver, $el, name, args, next) {
					var fn = assert_getFn(name);
					if (fn) {
						var err = runner.call(fn, $el, name, args);
						next(err);
						return;
					}
					next("Uknown test function " + name);
				}
			});
			//# sourceMappingURL=assertion.es6.map
			// end:source ./assertion.es6
	
			var Driver = Drivers.domlib = Drivers.Default = class_create(IDriver, {
				Traversers: new DomLibTraversers(),
				Events: new DomLibEvents(),
				Actions: new DomLibActions(),
				Assertions: new DomLibAssertions(),
	
				domLib: null,
	
				createRoot: function createRoot(container) {
					var el = container;
					if (el.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
						el = el.childNodes;
					}
					if (el.nodeType === Node.DOCUMENT_NODE) {
						el = el.body;
					}
					this.domLib = this.getDomLibrary_(el);
	
					var dfr = new class_Dfr();
					var $root = this.domLib(el);
					if ($root.length === 0) {
						return dfr.reject("Set is empty. No elements to test");
					}
					return dfr.resolve($root);
				},
	
				beforeEvent: function beforeEvent(runner) {
					runner_ensureInDOM(runner);
				},
	
				getDomLibrary_: function getDomLibrary_(mix) {
					var el = mix != null && (typeof mix.length === "number" ? mix[0] : mix);
					if (el == null) {
						return global.$;
					}
	
					var win = el.ownerDocument.defaultView;
					var $ = win.$ || win.jQuery || window.$ || window.jQuery || mask.Compo.config.getDOMLibrary();
	
					$.fn.simulate = global.$.fn.simulate;
					return $;
				},
	
				isOwnCtx: function isOwnCtx(ctx) {
					if (ctx == null) {
						return false;
					}
					if (ctx.constructor.fn == null) {
						return false;
					}
					return ctx.constructor === this.domLib.fn.constructor;
				}
			});
	
			// source ./events/exports.es6
			// source ./type.es6
			"use strict";
	
			(function () {
				Driver.prototype.Events.define("type", function ($, str) {
					var dfr = new class_Dfr();
					$.simulate("key-sequence", {
						sequence: str,
						delay: 10,
						callback: function callback() {
							$.removeData("simulate-keySequence.selection").off("keyup.simulate-keySequence").off("mouseup.simulate-keySequence");
							dfr.resolve();
						}
					});
					return dfr;
				});
			})();
			//# sourceMappingURL=type.es6.map
			// end:source ./type.es6
			// source ./press.es6
			"use strict";
	
			(function () {
				Driver.prototype.Events.define("press", function ($, str) {
					$.simulate("key-combo", {
						combo: str
					});
				});
			})();
			//# sourceMappingURL=press.es6.map
			// end:source ./press.es6
			// source ./select.es6
			"use strict";
	
			var _slicedToArray = function _slicedToArray(arr, i) {
				if (Array.isArray(arr)) {
					return arr;
				} else if (Symbol.iterator in Object(arr)) {
					var _arr = [];for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
						_arr.push(_step.value);if (i && _arr.length === i) break;
					}return _arr;
				} else {
					throw new TypeError("Invalid attempt to destructure non-iterable instance");
				}
			};
	
			(function () {
				Driver.prototype.Events.define("select", function ($) {
					for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
						args[_key - 1] = arguments[_key];
					}
	
					var el = $.filter("select").eq(0);
					if (el.length !== 0) {
						var str = args[0];
	
						select_Option(el, str);
						return;
					}
	
					var el = $.filter("input, textarea").eq(0);
					if (el.length !== 0) {
						el.get(0).focus();
						select_TextRange(el.get(0), args);
						return;
					}
					assert(false, "`Select` should be invoked in \"input\" or \"select\" context");
				});
	
				function select_Option(el, str) {
					var opts,
					    opt = find(byText);
					if (opt == null) opt = find(byAttr("value"));
					if (opt == null) opt = find(byAttr("name"));
					if (opt == null) opt = find(byAttr("id"));
	
					assert.notEqual(opt, null, "Option not found: " + str);
	
					var _opt = _slicedToArray(opt, 2);
	
					var $opt = _opt[0];
					var index = _opt[1];
	
					el.get(0).selectedIndex = index;
					$opt.simulate("click");
					el.trigger("change");
	
					function byText($el, i) {
						var txt = $el.text();
						return txt.trim().indexOf(str) !== -1;
					}
					function byAttr(name) {
						return function ($el) {
							return $el.attr(name).trim() === str;
						};
					}
					function find(fn) {
						if (opts == null) opts = el.children("option");
	
						var imax = opts.length,
						    i = 0,
						    x;
						for (; i < imax; i++) {
							x = opts.eq(i);
							if (fn(x, i) === true) {
								return [x, i];
							}
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
	
					var _args = _slicedToArray(args, 1);
	
					var str = _args[0];
	
					if (typeof str === "string") {
						var start = txt.indexOf(str);
						if (start !== -1) {
							select(start, start + str.length);
						}
						return;
					}
	
					var _args2 = _slicedToArray(args, 2);
	
					var start = _args2[0];
					var end = _args2[1];
	
					if (typeof start === "number" && typeof end === "number") {
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
						console.error("<DomTest> Unable to selec the range");
					}
				}
			})();
			//# sourceMappingURL=select.es6.map
			// end:source ./select.es6
			// source ./generic.es6
			"use strict";
	
			(function () {
				["blur", "focus", "load", "resize", "scroll", "unload", "beforeunload", "click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseover", "mouseout", "mouseenter", "mouseleave", "change", "submit", "keydown", "keypress", "keyup"].forEach(function (event) {
					Driver.prototype.Events.define(event, triggerDelegate(event));
				});
	
				function triggerDelegate(event) {
					return function ($) {
						for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
							args[_key - 1] = arguments[_key];
						}
	
						if ($.simulate) {
							var rkeyEvent = /^key/,
							    rmouseEvent = /^(?:mouse|contextmenu)|click/;
	
							if (rkeyEvent.test(event) || rmouseEvent.test(event)) {
								$.simulate.apply($, [event].concat(args));
								return;
							}
						}
						$.trigger.apply($, [event].concat(args));
					};
				}
			})();
			//# sourceMappingURL=generic.es6.map
			// end:source ./generic.es6
			//# sourceMappingURL=exports.es6.map
			// end:source ./events/exports.es6
			// source ./actions/exports.es6
			// source ./selection.es6
			"use strict";
	
			var _toConsumableArray = function _toConsumableArray(arr) {
				if (Array.isArray(arr)) {
					for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
				} else {
					return Array.from(arr);
				}
			};
	
			(function () {
				Driver.prototype.Actions.define("select", function (runner, driver, current, done) {
					var _current$$;
	
					var expression = current.node.expression;
					if (expression == null) {
						throw Error("`caret` node expect expression: position number");
					}
					var args = mask.Utils.Expression.evalStatements(expression);
	
					(_current$$ = current.$).select.apply(_current$$, _toConsumableArray(args)).done(function () {
						return done();
					});
				});
			})();
			//# sourceMappingURL=selection.es6.map
			// end:source ./selection.es6
			//# sourceMappingURL=exports.es6.map
			// end:source ./actions/exports.es6
			// source ./assertions/exports.es6
			// source ./class.es6
			"use strict";
	
			var _toConsumableArray = function _toConsumableArray(arr) {
				if (Array.isArray(arr)) {
					for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
				} else {
					return Array.from(arr);
				}
			};
	
			(function () {
				Driver.prototype.Assertions.define("hasClass", function (runner, driver, ctx, args, done) {
					if (args.length === 1) {
						args.push(true);
					}
	
					var error = runner.check.apply(runner, [ctx, "hasClass"].concat(_toConsumableArray(args)));
					done(error);
				});
			})();
			//# sourceMappingURL=class.es6.map
			// end:source ./class.es6
			//# sourceMappingURL=exports.es6.map
			// end:source ./assertions/exports.es6
			// source ./traversers/exports.es6
			// source ./eq.es6
			"use strict";
	
			Driver.prototype.Traversers.define("eq", {
				traverse: function traverse(ctx, selector, done) {
					var x = ctx.eq(selector);
					done(x);
				},
				canHandle: function canHandle(runner, driver, current) {
					var args = runner.getCurrentArgs_();
					return args.length === 1;
				}
			});
			//# sourceMappingURL=eq.es6.map
			// end:source ./eq.es6
			// source ./find.es6
			"use strict";
	
			Driver.prototype.Traversers.define("find", {
				traverse: function traverse(ctx, selector, done) {
					var x = ctx.find(selector);
					if (x.length === 0) {
						x = ctx.filter(selector);
					}
					if (x.length === 0) {
						x = traverser_findNative(ctx, selector);
					}
					done(x);
				},
				canHandle: function canHandle(runner, driver, current) {
					var args = runner.getCurrentArgs_();
					return args.length === 1;
				}
			});
			//# sourceMappingURL=find.es6.map
			// end:source ./find.es6
			// source ./generic.es6
			"use strict";
	
			["filter", "closest", "children", "siblings"].forEach(function (name) {
				Driver.prototype.Traversers.define(name, {
					traverse: function traverse(ctx, selector, done) {
						var set = ctx[name](selector);
						done(set);
					} });
			});
			//# sourceMappingURL=generic.es6.map
			// end:source ./generic.es6
			//# sourceMappingURL=exports.es6.map
			// end:source ./traversers/exports.es6
		})();
		//# sourceMappingURL=domlib.es6.map
		// end:source ./domlib/domlib.es6
		// source ./jmask/jmask.es6
		"use strict";
	
		(function () {
	
			// source ./traverser.es6
			"use strict";
	
			var JMaskTraversers = class_create(IDriverTraverserCollection, {});
			//# sourceMappingURL=traverser.es6.map
			// end:source ./traverser.es6
			// source ./assertion.es6
			"use strict";
	
			var _toConsumableArray = function _toConsumableArray(arr) {
				if (Array.isArray(arr)) {
					for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
				} else {
					return Array.from(arr);
				}
			};
	
			var JMaskAssertions = class_create(IDriverAssertionCollection, {
				assert: function assert(runner, driver, $el, name, _x, next) {
					var args = arguments[4] === undefined ? [] : arguments[4];
	
					var err = runner.check.apply(runner, [$el, name].concat(_toConsumableArray(args)));
					next(err);
				}
			});
			//# sourceMappingURL=assertion.es6.map
			// end:source ./assertion.es6
	
			var Driver = Drivers.jmask = class_create(IDriver, {
				Traversers: new JMaskTraversers(),
				Assertions: new JMaskAssertions(),
	
				createRoot: function createRoot(node) {
					var $root = mask.jmask(node);
					var dfr = new class_Dfr();
					if ($root.length === 0) {
						return dfr.reject("Set is empty. No elements to test");
					}
					return dfr.resolve($root);
				},
	
				isOwnCtx: function isOwnCtx(ctx) {
					if (ctx == null) {
						return false;
					}
					return ctx.constructor === mask.jmask;
				}
			});
	
			// source ./assertions/exports.es6
			// source ./class.es6
			"use strict";
	
			var _toConsumableArray = function _toConsumableArray(arr) {
				if (Array.isArray(arr)) {
					for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
				} else {
					return Array.from(arr);
				}
			};
	
			(function () {
				Driver.prototype.Assertions.define("hasClass", function (runner, driver, ctx, args, done) {
					if (args.length === 1) {
						args.push(true);
					}
					var error = runner.check.apply(runner, [ctx, "hasClass"].concat(_toConsumableArray(args)));
					done(error);
				});
			})();
			//# sourceMappingURL=class.es6.map
			// end:source ./class.es6
			//# sourceMappingURL=exports.es6.map
			// end:source ./assertions/exports.es6
			// source ./traversers/exports.es6
			// source ./eq.es6
			"use strict";
	
			Driver.prototype.Traversers.define("eq", {
				traverse: function traverse(ctx, selector, done) {
					var x = ctx.eq(selector);
					done(x);
				},
				canHandle: function canHandle(runner, driver, current) {
					var args = runner.getCurrentArgs_();
					return args.length === 1;
				}
			});
			//# sourceMappingURL=eq.es6.map
			// end:source ./eq.es6
			// source ./find.es6
			"use strict";
	
			Driver.prototype.Traversers.define("find", {
				traverse: function traverse(ctx, selector, done) {
					var x = ctx.find(selector);
					if (x.length === 0) {
						x = ctx.filter(selector);
					}
					done(x);
				},
				canHandle: function canHandle(runner, driver, current) {
					var args = runner.getCurrentArgs_();
					return args.length === 1;
				}
			});
			//# sourceMappingURL=find.es6.map
			// end:source ./find.es6
			// source ./generic.es6
			"use strict";
	
			["filter", "closest", "children"].forEach(function (name) {
				Driver.prototype.Traversers.define(name, {
					traverse: function traverse(ctx, selector, done) {
						var set = ctx[name](selector);
						done(set);
					} });
			});
			//# sourceMappingURL=generic.es6.map
			// end:source ./generic.es6
			//# sourceMappingURL=exports.es6.map
			// end:source ./traversers/exports.es6
		})();
		//# sourceMappingURL=jmask.es6.map
		// end:source ./jmask/jmask.es6
		// source ./cheerio/cheerio.es6
		"use strict";
	
		(function () {
	
			// source ./traverser.es6
			"use strict";
	
			var CheerioTraversers = class_create(IDriverTraverserCollection, {});
			//# sourceMappingURL=traverser.es6.map
			// end:source ./traverser.es6
			// source ./assertion.es6
			"use strict";
	
			var _toConsumableArray = function _toConsumableArray(arr) {
				if (Array.isArray(arr)) {
					for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
				} else {
					return Array.from(arr);
				}
			};
	
			var CheerioAssertions = class_create(IDriverAssertionCollection, {
				assert: function assert(runner, driver, $el, name, _x, next) {
					var args = arguments[4] === undefined ? [] : arguments[4];
	
					var err = runner.check.apply(runner, [$el, name].concat(_toConsumableArray(args)));
					next(err);
				}
			});
			//# sourceMappingURL=assertion.es6.map
			// end:source ./assertion.es6
	
			var Driver = Drivers.cheerio = class_create(IDriver, {
				Traversers: new CheerioTraversers(),
				Assertions: new CheerioAssertions(),
	
				cheerio: null,
				createRoot: function createRoot(mix) {
					var _this = this;
	
					return class_Dfr.run(function (resolve, reject) {
						if (mix == null) {
							reject("Root context is undefined");
							return;
						}
						if (typeof mix !== "string") {
							resolve(mix);
							return;
						}
						var str = mix.trim();
						if (str === "") {
							reject("Root context is empty");
							return;
						}
						var $ = _this.cheerio = require("cheerio");
						if (/^\w+:\/\//.test(str)) {
							_this.loadUrl(str).done(resolve).fail(reject);
							return;
						}
						var $root = $(str);
						if ($root.length === 0) {
							reject("Set is empty. No html to test");
							return;
						}
						return resolve($root);
					});
				},
	
				loadUrl: function loadUrl(url) {
					var _this = this;
	
					var request = require("request");
					var dfr = new class_Dfr();
					request(url, function (error, response, body) {
						if (error) {
							dfr.reject(error);
							return;
						}
						dfr.resolve(_this.cheerio(body));
					});
					return dfr;
				},
	
				isOwnCtx: function isOwnCtx(ctx) {
					if (ctx == null) {
						return false;
					}
					return ctx.constructor === this.cheerio;
				}
			});
	
			// source ./assertions/exports.es6
			// source ./class.es6
			"use strict";
	
			var _toConsumableArray = function _toConsumableArray(arr) {
				if (Array.isArray(arr)) {
					for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
				} else {
					return Array.from(arr);
				}
			};
	
			(function () {
				Driver.prototype.Assertions.define("hasClass", function (runner, driver, ctx, args, done) {
					if (args.length === 1) {
						args.push(true);
					}
					var error = runner.check.apply(runner, [ctx, "hasClass"].concat(_toConsumableArray(args)));
					done(error);
				});
			})();
			//# sourceMappingURL=class.es6.map
			// end:source ./class.es6
			//# sourceMappingURL=exports.es6.map
			// end:source ./assertions/exports.es6
			// source ./traversers/exports.es6
			// source ./eq.es6
			"use strict";
	
			Driver.prototype.Traversers.define("eq", {
				traverse: function traverse(ctx, selector, done) {
					var x = ctx.eq(selector);
					done(x);
				},
				canHandle: function canHandle(runner, driver, current) {
					var args = runner.getCurrentArgs_();
					return args.length === 1;
				}
			});
			//# sourceMappingURL=eq.es6.map
			// end:source ./eq.es6
			// source ./find.es6
			"use strict";
	
			Driver.prototype.Traversers.define("find", {
				traverse: function traverse(ctx, selector, done) {
					var x = ctx.find(selector);
					if (x.length === 0) {
						x = ctx.filter(selector);
					}
					done(x);
				},
				canHandle: function canHandle(runner, driver, current) {
					var args = runner.getCurrentArgs_();
					return args.length === 1;
				}
			});
			//# sourceMappingURL=find.es6.map
			// end:source ./find.es6
			// source ./generic.es6
			"use strict";
	
			["filter", "closest", "children"].forEach(function (name) {
				Driver.prototype.Traversers.define(name, {
					traverse: function traverse(ctx, selector, done) {
						var set = ctx[name](selector);
						done(set);
					} });
			});
			//# sourceMappingURL=generic.es6.map
			// end:source ./generic.es6
			//# sourceMappingURL=exports.es6.map
			// end:source ./traversers/exports.es6
		})();
		//# sourceMappingURL=cheerio.es6.map
		// end:source ./cheerio/cheerio.es6
		// source selenium/selenium.es6
		"use strict";
	
		(function () {
			var _webdriver, _browser, SQuery;
	
			// source ./traverser.es6
			"use strict";
	
			var SeleniumTraversers = class_create(IDriverTraverserCollection, {});
			//# sourceMappingURL=traverser.es6.map
			// end:source ./traverser.es6
			// source ./event.es6
			"use strict";
	
			var SeleniumEvents = class_create(IDriverEventCollection, {});
			//# sourceMappingURL=event.es6.map
			// end:source ./event.es6
			// source ./action.es6
			"use strict";
	
			var SeleniumActions = class_create(IDriverActionCollection, {});
			//# sourceMappingURL=action.es6.map
			// end:source ./action.es6
			// source ./assertion.es6
			"use strict";
	
			var _toConsumableArray = function _toConsumableArray(arr) {
				if (Array.isArray(arr)) {
					for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
				} else {
					return Array.from(arr);
				}
			};
	
			var SeleniumAssertions = class_create(IDriverAssertionCollection, {
				assert: function assert(runner, driver, $el, name, _x, next) {
					var args = arguments[4] === undefined ? [] : arguments[4];
	
					runner.checkAsync.apply(runner, [$el, name].concat(_toConsumableArray(args))).done(function () {
						return next();
					}).fail(function (err) {
						return next(err);
					});
				}
			});
			//# sourceMappingURL=assertion.es6.map
			// end:source ./assertion.es6
	
			var Driver = Drivers.selenium = class_create(IDriver, {
				Traversers: new SeleniumTraversers(),
				Events: new SeleniumEvents(),
				Actions: new SeleniumActions(),
				Assertions: new SeleniumAssertions(),
	
				createRoot: function createRoot(str) {
					var _this = this;
	
					return class_Dfr.run(function (resolve, reject) {
						if (str == null || /^(\w+:\/\/)|^(\/\w+)/.test(str) === false) {
							reject("URL is expected by selenium driver");
							return;
						}
						if (SQuery == null) {
							SQuery = require("selenium-query");
						}
						SQuery.load(str, _this.options).then(function ($) {
							return resolve($);
						}, function (err) {
							return reject(err);
						});
					});
				},
	
				isOwnCtx: function isOwnCtx(ctx) {
					if (ctx == null) {
						return false;
					}
					return typeof ctx.length === "number";
				}
			});
	
			// source ./events/exports.es6
			// source ./type.es6
			"use strict";
	
			(function () {
				Driver.prototype.Events.define("type", function ($, str) {
					return $.type(str);
				});
			})();
			//# sourceMappingURL=type.es6.map
			// end:source ./type.es6
			// source ./press.es6
			"use strict";
	
			(function () {
				Driver.prototype.Events.define("press", function ($, str) {
					return $.press(str);
				});
			})();
			//# sourceMappingURL=press.es6.map
			// end:source ./press.es6
			// source ./select.es6
			"use strict";
	
			(function () {
				Driver.prototype.Events.define("select", function ($) {
					for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
						args[_key - 1] = arguments[_key];
					}
	
					return $.select.apply($, args);
				});
			})();
			//# sourceMappingURL=select.es6.map
			// end:source ./select.es6
			// source ./generic.es6
			"use strict";
	
			(function () {
				["blur", "focus", "load", "resize", "scroll", "unload", "beforeunload", "click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseover", "mouseout", "mouseenter", "mouseleave", "change", "submit", "keydown", "keypress", "keyup"].forEach(function (event) {
					Driver.prototype.Events.define(event, triggerDelegate(event));
				});
	
				function triggerDelegate(event) {
					return function ($) {
						for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
							args[_key - 1] = arguments[_key];
						}
	
						var fn = $.simulate || $.trigger;
						return fn.call.apply(fn, [$, event].concat(args));
					};
				}
			})();
			//# sourceMappingURL=generic.es6.map
			// end:source ./generic.es6
			//# sourceMappingURL=exports.es6.map
			// end:source ./events/exports.es6
			// source ./actions/exports.es6
			// source ./selection.es6
			"use strict";
	
			(function () {
				Driver.prototype.Actions.define("selection", function (runner, driver, current, done) {
					var expression = current.node.expression;
					if (expression == null) {
						throw Error("`caret` node expect expression: position number");
					}
					var pos = mask.Utils.Expression.evalStatements(expression);
					var start = pos[0],
					    end = pos[1] || start;
	
					setSelectionRange(current.$.get(0), start, end);
					setTimeout(done, 16);
				});
	
				function setSelectionRange(input, selectionStart, selectionEnd) {
					if (input.setSelectionRange) {
						input.focus();
						input.setSelectionRange(selectionStart, selectionEnd);
					} else if (input.createTextRange) {
						var range = input.createTextRange();
						range.collapse(true);
						range.moveEnd("character", selectionEnd);
						range.moveStart("character", selectionStart);
						range.select();
					}
				}
	
				function setCaretToPos(input, pos) {
					setSelectionRange(input, pos, pos);
				}
			})();
			//# sourceMappingURL=selection.es6.map
			// end:source ./selection.es6
			//# sourceMappingURL=exports.es6.map
			// end:source ./actions/exports.es6
			// source ./assertions/exports.es6
			// source ./class.es6
			"use strict";
	
			var _toConsumableArray = function _toConsumableArray(arr) {
				if (Array.isArray(arr)) {
					for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
				} else {
					return Array.from(arr);
				}
			};
	
			(function () {
				Driver.prototype.Assertions.define("hasClass", function (runner, driver, ctx, args, done) {
					if (args.length === 1) {
						args.push(true);
					}
					runner.checkAsync.apply(runner, [ctx, "hasClass"].concat(_toConsumableArray(args))).done(function () {
						return done();
					}).fail(function (err) {
						return done(err);
					});
				});
			})();
			//# sourceMappingURL=class.es6.map
			// end:source ./class.es6
			//# sourceMappingURL=exports.es6.map
			// end:source ./assertions/exports.es6
			// source ./traversers/exports.es6
			// source ./eq.es6
			"use strict";
	
			Driver.prototype.Traversers.define("eq", {
				traverse: function traverse(ctx, selector, done) {
					ctx.eq(selector).done(done);
				},
				canHandle: function canHandle(runner, driver, current) {
					var args = runner.getCurrentArgs_();
					return args.length === 1;
				}
			});
			//# sourceMappingURL=eq.es6.map
			// end:source ./eq.es6
			// source ./find.es6
			"use strict";
	
			Driver.prototype.Traversers.define("find", {
				traverse: function traverse(ctx, selector, done) {
					ctx.find(selector).done(function ($) {
	
						if ($.length === 0) {
							ctx.filter(selector).done(done);
							return;
						}
						done($);
					});
				},
				canHandle: function canHandle(runner, driver, current) {
					var args = runner.getCurrentArgs_();
					return args.length === 1;
				}
			});
			//# sourceMappingURL=find.es6.map
			// end:source ./find.es6
			// source ./generic.es6
			"use strict";
	
			["filter", "closest", "children", "siblings"].forEach(function (name) {
				Driver.prototype.Traversers.define(name, {
					traverse: function traverse(ctx, selector, done) {
						ctx[name](selector).done(done);
					} });
			});
			//# sourceMappingURL=generic.es6.map
			// end:source ./generic.es6
			//# sourceMappingURL=exports.es6.map
			// end:source ./traversers/exports.es6
		})();
		//# sourceMappingURL=selenium.es6.map
		// end:source selenium/selenium.es6
	})();
	
	/*...*/
	//# sourceMappingURL=exports.es6.map
	// end:source ./drivers/exports.es6
	
	// source ./compo.es6
	"use strict";
	
	var compo_domtest;
	
	(function () {
	
		compo_domtest = function (mix, model) {
	
			if (typeof mix !== "string") {
				return test(mix);
			}
	
			var compo = new Compo();
			mask.render(mix, model, null, null, compo);
	
			return test(compo);
		};
	
		function test(compo) {
			var compos = compo.findAll(":utest");
	
			if (compos.length === 0) {
				var msg = "No `:utest` components found";
				__assert(false, msg);
				return new class_Dfr().reject(msg);
			}
	
			var conductor = new DomTest.Conductor();
	
			compos.forEach(function (compo) {
				conductor.addRunner(compo.$, compo);
			});
			return conductor.process();
		}
	
		mask.registerHandler(":utest", mask.Compo({
			render: function render(model, ctx, container) {
				if (container.nodeType === Node.DOCUMENT_FRAGMENT_NODE) container = container.childNodes;
	
				this.$ = $(container);
			}
		}));
	})();
	//# sourceMappingURL=compo.es6.map
	// end:source ./compo.es6
	
	obj_extend(assert_TestDom, {
		create: assert_TestDom,
		compo: compo_domtest,
		ProgressReporters: {
			Dom: ProgressReporter_DOM
		},
		Drivers: Drivers,
		Conductor: Conductor,
		use: function use(driverName) {
			var options = arguments[1] === undefined ? null : arguments[1];
	
			return new Conductor(driverName, options);
		}
	});
	//# sourceMappingURL=library.es6.map
	// end:source /src/library.es6

	return assert_TestDom;
}));

/* jQuery simulate failes in 'strict' mode */
// source /src/jquery_simulate.js
if (typeof jQuery !== 'undefined') {

	(function($){
		if ($.simulate && $.simulate.prototype.simulateKeyCombo) {
			return;
		}

		// source /bower_components/jquery-simulate-ext/libs/jquery.simulate.js
		 /*!
		 * jQuery Simulate v0.0.1 - simulate browser mouse and keyboard events
		 * https://github.com/jquery/jquery-simulate
		 *
		 * Copyright 2012 jQuery Foundation and other contributors
		 * Released under the MIT license.
		 * http://jquery.org/license
		 *
		 * Date: Sun Dec 9 12:15:33 2012 -0500
		 */
		
		;(function( $, undefined ) {
			"use strict";
		
		var rkeyEvent = /^key/,
			rmouseEvent = /^(?:mouse|contextmenu)|click/,
			rdocument = /\[object (?:HTML)?Document\]/;
		
		function isDocument(ele) {
			return rdocument.test(Object.prototype.toString.call(ele));
		}
		
		function windowOfDocument(doc) {
			for (var i=0; i < window.frames.length; i+=1) {
				if (window.frames[i].document === doc) {
					return window.frames[i];
				}
			}
			return window;
		}
		
		$.fn.simulate = function( type, options ) {
			return this.each(function() {
				new $.simulate( this, type, options );
			});
		};
		
		$.simulate = function( elem, type, options ) {
			var method = $.camelCase( "simulate-" + type );
		
			this.target = elem;
			this.options = options || {};
		
			if ( this[ method ] ) {
				this[ method ]();
			} else {
				this.simulateEvent( elem, type, this.options );
			}
		};
		
		$.extend( $.simulate, {
		
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
		
		$.extend( $.simulate.prototype, {
		
			simulateEvent: function( elem, type, options ) {
				var event = this.createEvent( type, options );
				this.dispatchEvent( elem, type, event, options );
			},
		
			createEvent: function( type, options ) {
				if ( rkeyEvent.test( type ) ) {
					return this.keyEvent( type, options );
				}
		
				if ( rmouseEvent.test( type ) ) {
					return this.mouseEvent( type, options );
				}
			},
		
			mouseEvent: function( type, options ) {
				var event,
					eventDoc,
					doc = isDocument(this.target)? this.target : (this.target.ownerDocument || document),
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
				}, options );
		
				
				
				if ( doc.createEvent ) {
					event = doc.createEvent( "MouseEvents" );
					event.initMouseEvent( type, options.bubbles, options.cancelable,
						options.view, options.detail,
						options.screenX, options.screenY, options.clientX, options.clientY,
						options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
						options.button, options.relatedTarget || doc.body.parentNode );
		
					// IE 9+ creates events with pageX and pageY set to 0.
					// Trying to modify the properties throws an error,
					// so we define getters to return the correct values.
					if ( event.pageX === 0 && event.pageY === 0 && Object.defineProperty ) {
						eventDoc = isDocument(event.relatedTarget)? event.relatedTarget : (event.relatedTarget.ownerDocument || document);
						docEle = eventDoc.documentElement;
						body = eventDoc.body;
		
						Object.defineProperty( event, "pageX", {
							get: function() {
								return options.clientX +
									( docEle && docEle.scrollLeft || body && body.scrollLeft || 0 ) -
									( docEle && docEle.clientLeft || body && body.clientLeft || 0 );
							}
						});
						Object.defineProperty( event, "pageY", {
							get: function() {
								return options.clientY +
									( docEle && docEle.scrollTop || body && body.scrollTop || 0 ) -
									( docEle && docEle.clientTop || body && body.clientTop || 0 );
							}
						});
					}
				} else if ( doc.createEventObject ) {
					event = doc.createEventObject();
					$.extend( event, options );
					// standards event.button uses constants defined here: http://msdn.microsoft.com/en-us/library/ie/ff974877(v=vs.85).aspx
					// old IE event.button uses constants defined here: http://msdn.microsoft.com/en-us/library/ie/ms533544(v=vs.85).aspx
					// so we actually need to map the standard back to oldIE
					event.button = {
						0: 1,
						1: 4,
						2: 2
					}[ event.button ] || event.button;
				}
		
				return event;
			},
		
			keyEvent: function( type, options ) {
				var event, doc;
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
				}, options );
		
				doc = isDocument(this.target)? this.target : (this.target.ownerDocument || document);
				if ( doc.createEvent ) {
					try {
						event = doc.createEvent( "KeyEvents" );
						event.initKeyEvent( type, options.bubbles, options.cancelable, options.view,
							options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
							options.keyCode, options.charCode );
					// initKeyEvent throws an exception in WebKit
					// see: http://stackoverflow.com/questions/6406784/initkeyevent-keypress-only-works-in-firefox-need-a-cross-browser-solution
					// and also https://bugs.webkit.org/show_bug.cgi?id=13368
					// fall back to a generic event until we decide to implement initKeyboardEvent
					} catch( err ) {
						event = doc.createEvent( "Events" );
						event.initEvent( type, options.bubbles, options.cancelable );
						$.extend( event, {
							view: options.view,
							ctrlKey: options.ctrlKey,
							altKey: options.altKey,
							shiftKey: options.shiftKey,
							metaKey: options.metaKey,
							keyCode: options.keyCode,
							charCode: options.charCode
						});
					}
				} else if ( doc.createEventObject ) {
					event = doc.createEventObject();
					$.extend( event, options );
				}
		
				if ( !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() ) || (({}).toString.call( window.opera ) === "[object Opera]") ) {
					event.keyCode = (options.charCode > 0) ? options.charCode : options.keyCode;
					event.charCode = undefined;
				}
		
				return event;
			},
		
			dispatchEvent: function( elem, type, event, options ) {
				if (options.jQueryTrigger === true) {
					$(elem).trigger($.extend({}, event, options, {type: type}));
				}
				else if ( elem.dispatchEvent ) {
					elem.dispatchEvent( event );
				} else if ( elem.fireEvent ) {
					elem.fireEvent( "on" + type, event );
				}
			},
		
			simulateFocus: function() {
				var focusinEvent,
					triggered = false,
					$element = $( this.target );
		
				function trigger() {
					triggered = true;
				}
		
				$element.bind( "focus", trigger );
				$element[ 0 ].focus();
		
				if ( !triggered ) {
					focusinEvent = $.Event( "focusin" );
					focusinEvent.preventDefault();
					$element.trigger( focusinEvent );
					$element.triggerHandler( "focus" );
				}
				$element.unbind( "focus", trigger );
			},
		
			simulateBlur: function() {
				var focusoutEvent,
					triggered = false,
					$element = $( this.target );
		
				function trigger() {
					triggered = true;
				}
		
				$element.bind( "blur", trigger );
				$element[ 0 ].blur();
		
				// blur events are async in IE
				setTimeout(function() {
					// IE won't let the blur occur if the window is inactive
					if ( $element[ 0 ].ownerDocument.activeElement === $element[ 0 ] ) {
						$element[ 0 ].ownerDocument.body.focus();
					}
		
					// Firefox won't trigger events if the window is inactive
					// IE doesn't trigger events if we had to manually focus the body
					if ( !triggered ) {
						focusoutEvent = $.Event( "focusout" );
						focusoutEvent.preventDefault();
						$element.trigger( focusoutEvent );
						$element.triggerHandler( "blur" );
					}
					$element.unbind( "blur", trigger );
				}, 1 );
			}
		});
		
		
		
		/** complex events **/
		
		function findCenter( elem ) {
			var offset,
				$document,
				$elem = $( elem );
			
			if ( isDocument($elem[0]) ) {
				$document = $elem;
				offset = { left: 0, top: 0 };
			}
			else {
				$document = $( $elem[0].ownerDocument || document );
				offset = $elem.offset();
			}
			
			return {
				x: offset.left + $elem.outerWidth() / 2 - $document.scrollLeft(),
				y: offset.top + $elem.outerHeight() / 2 - $document.scrollTop()
			};
		}
		
		function findCorner( elem ) {
			var offset,
				$document,
				$elem = $( elem );
			
			if ( isDocument($elem[0]) ) {
				$document = $elem;
				offset = { left: 0, top: 0 };
			}
			else {
				$document = $( $elem[0].ownerDocument || document );
				offset = $elem.offset();
			}
		
			return {
				x: offset.left - document.scrollLeft(),
				y: offset.top - document.scrollTop()
			};
		}
		
		$.extend( $.simulate.prototype, {
			simulateDrag: function() {
				var i = 0,
					target = this.target,
					options = this.options,
					center = options.handle === "corner" ? findCorner( target ) : findCenter( target ),
					x = Math.floor( center.x ),
					y = Math.floor( center.y ),
					coord = { clientX: x, clientY: y },
					dx = options.dx || ( options.x !== undefined ? options.x - x : 0 ),
					dy = options.dy || ( options.y !== undefined ? options.y - y : 0 ),
					moves = options.moves || 3;
		
				this.simulateEvent( target, "mousedown", coord );
		
				for ( ; i < moves ; i++ ) {
					x += dx / moves;
					y += dy / moves;
		
					coord = {
						clientX: Math.round( x ),
						clientY: Math.round( y )
					};
		
					this.simulateEvent( target.ownerDocument, "mousemove", coord );
				}
		
				if ( $.contains( document, target ) ) {
					this.simulateEvent( target, "mouseup", coord );
					this.simulateEvent( target, "click", coord );
				} else {
					this.simulateEvent( document, "mouseup", coord );
				}
			}
		});
		
		})( jQuery );
		
		// end:source /bower_components/jquery-simulate-ext/libs/jquery.simulate.js
		// source /bower_components/jquery-simulate-ext/libs/bililiteRange.js
		// Cross-broswer implementation of text ranges and selections
		// documentation: http://bililite.com/blog/2011/01/17/cross-browser-text-ranges-and-selections/
		// Version: 2.6
		// Copyright (c) 2013 Daniel Wachsstock
		// MIT license:
		// Permission is hereby granted, free of charge, to any person
		// obtaining a copy of this software and associated documentation
		// files (the "Software"), to deal in the Software without
		// restriction, including without limitation the rights to use,
		// copy, modify, merge, publish, distribute, sublicense, and/or sell
		// copies of the Software, and to permit persons to whom the
		// Software is furnished to do so, subject to the following
		// conditions:
		
		// The above copyright notice and this permission notice shall be
		// included in all copies or substantial portions of the Software.
		
		// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
		// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
		// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
		// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
		// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
		// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
		// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
		// OTHER DEALINGS IN THE SOFTWARE.
		
		(function(){
		
		// a bit of weirdness with IE11: using 'focus' is flaky, even if I'm not bubbling, as far as I can tell.
		var focusEvent = 'onfocusin' in document.createElement('input') ? 'focusin' : 'focus';
		
		// IE11 normalize is buggy (http://connect.microsoft.com/IE/feedback/details/809424/node-normalize-removes-text-if-dashes-are-present)
		var n = document.createElement('div');
		n.appendChild(document.createTextNode('x-'));
		n.appendChild(document.createTextNode('x'));
		n.normalize();
		var canNormalize = n.firstChild.length == 3;
		
		
		bililiteRange = function(el, debug){
			var ret;
			if (debug){
				ret = new NothingRange(); // Easier to force it to use the no-selection type than to try to find an old browser
			}else if (window.getSelection && el.setSelectionRange){
				// Standards. Element is an input or textarea 
				// note that some input elements do not allow selections
				try{
					el.selectionStart; // even getting the selection in such an element will throw
					ret = new InputRange();
				}catch(e){
					ret = new NothingRange();
				}
			}else if (window.getSelection){
				// Standards, with any other kind of element
				ret = new W3CRange();
			}else if (document.selection){
				// Internet Explorer
				ret = new IERange();
			}else{
				// doesn't support selection
				ret = new NothingRange();
			}
			ret._el = el;
			// determine parent document, as implemented by John McLear <john@mclear.co.uk>
			ret._doc = el.ownerDocument;
			ret._win = 'defaultView' in ret._doc ? ret._doc.defaultView : ret._doc.parentWindow;
			ret._textProp = textProp(el);
			ret._bounds = [0, ret.length()];
			//  There's no way to detect whether a focus event happened as a result of a click (which should change the selection)
			// or as a result of a keyboard event (a tab in) or a script  action (el.focus()). So we track it globally, which is a hack, and is likely to fail
			// in edge cases (right-clicks, drag-n-drop), and is vulnerable to a lower-down handler preventing bubbling.
			// I just don't know a better way.
			// I'll hack my event-listening code below, rather than create an entire new bilililiteRange, potentially before the DOM has loaded
			if (!('bililiteRangeMouseDown' in ret._doc)){
				var _doc = {_el: ret._doc};
				ret._doc.bililiteRangeMouseDown = false;
				bililiteRange.fn.listen.call(_doc, 'mousedown', function() {
					ret._doc.bililiteRangeMouseDown = true;
				});
				bililiteRange.fn.listen.call(_doc, 'mouseup', function() {
					ret._doc.bililiteRangeMouseDown = false;
				});
			}
			// note that bililiteRangeSelection is an array, which means that copying it only copies the address, which points to the original.
			// make sure that we never let it (always do return [bililiteRangeSelection[0], bililiteRangeSelection[1]]), which means never returning
			// this._bounds directly
			if (!('bililiteRangeSelection' in el)){
				// start tracking the selection
				function trackSelection(evt){
					if (evt && evt.which == 9){
						// do tabs my way, by restoring the selection
						// there's a flash of the browser's selection, but I don't see a way of avoiding that
						ret._nativeSelect(ret._nativeRange(el.bililiteRangeSelection));
					}else{
						el.bililiteRangeSelection = ret._nativeSelection();
					}
				}
				trackSelection();
				// only IE does this right and allows us to grab the selection before blurring
				if ('onbeforedeactivate' in el){
					ret.listen('beforedeactivate', trackSelection);
				}else{
					// with standards-based browsers, have to listen for every user interaction
					ret.listen('mouseup', trackSelection).listen('keyup', trackSelection);
				}
				ret.listen(focusEvent, function(){
					// restore the correct selection when the element comes into focus (mouse clicks change the position of the selection)
					// Note that Firefox will not fire the focus event until the window/tab is active even if el.focus() is called
					// https://bugzilla.mozilla.org/show_bug.cgi?id=566671
					if (!ret._doc.bililiteRangeMouseDown){
						ret._nativeSelect(ret._nativeRange(el.bililiteRangeSelection));
					}
				});
			}
			if (!('oninput' in el)){
				// give IE8 a chance. Note that this still fails in IE11, which has has oninput on contenteditable elements but does not 
				// dispatch input events. See http://connect.microsoft.com/IE/feedback/details/794285/ie10-11-input-event-does-not-fire-on-div-with-contenteditable-set
				// TODO: revisit this when I have IE11 running on my development machine
				var inputhack = function() {ret.dispatch({type: 'input'}) };
				ret.listen('keyup', inputhack);
				ret.listen('cut', inputhack);
				ret.listen('paste', inputhack);
				ret.listen('drop', inputhack);
				el.oninput = 'patched';
			}
			return ret;
		}
		
		function textProp(el){
			// returns the property that contains the text of the element
			// note that for <body> elements the text attribute represents the obsolete text color, not the textContent.
			// we document that these routines do not work for <body> elements so that should not be relevant
			if (typeof el.value != 'undefined') return 'value';
			if (typeof el.text != 'undefined') return 'text';
			if (typeof el.textContent != 'undefined') return 'textContent';
			return 'innerText';
		}
		
		// base class
		function Range(){}
		Range.prototype = {
			length: function() {
				return this._el[this._textProp].replace(/\r/g, '').length; // need to correct for IE's CrLf weirdness
			},
			bounds: function(s){
				if (bililiteRange.bounds[s]){
					this._bounds = bililiteRange.bounds[s].apply(this);
				}else if (s){
					this._bounds = s; // don't do error checking now; things may change at a moment's notice
				}else{
					var b = [
						Math.max(0, Math.min (this.length(), this._bounds[0])),
						Math.max(0, Math.min (this.length(), this._bounds[1]))
					];
					b[1] = Math.max(b[0], b[1]);
					return b; // need to constrain it to fit
				}
				return this; // allow for chaining
			},
			select: function(){
				var b = this._el.bililiteRangeSelection = this.bounds();
				if (this._el === this._doc.activeElement){
					// only actually select if this element is active!
					this._nativeSelect(this._nativeRange(b));
				}
				this.dispatch({type: 'select'});
				return this; // allow for chaining
			},
			text: function(text, select){
				if (arguments.length){
					var bounds = this.bounds(), el = this._el;
					// signal the input per DOM 3 input events, http://www.w3.org/TR/DOM-Level-3-Events/#h4_events-inputevents
					// we add another field, bounds, which are the bounds of the original text before being changed.
					this.dispatch({type: 'beforeinput', data: text, bounds: bounds});
					this._nativeSetText(text, this._nativeRange(bounds));
					if (select == 'start'){
						this.bounds ([bounds[0], bounds[0]]);
					}else if (select == 'end'){
						this.bounds ([bounds[0]+text.length, bounds[0]+text.length]);
					}else if (select == 'all'){
						this.bounds ([bounds[0], bounds[0]+text.length]);
					}
					this.dispatch({type: 'input', data: text, bounds: bounds});
					return this; // allow for chaining
				}else{
					return this._nativeGetText(this._nativeRange(this.bounds())).replace(/\r/g, ''); // need to correct for IE's CrLf weirdness
				}
			},
			insertEOL: function (){
				this._nativeEOL();
				this._bounds = [this._bounds[0]+1, this._bounds[0]+1]; // move past the EOL marker
				return this;
			},
			sendkeys: function (text){
				var self = this;
				this.data().sendkeysOriginalText = this.text();
				this.data().sendkeysBounds = undefined;
				function simplechar (rng, c){
					if (/^{[^}]*}$/.test(c)) c = c.slice(1,-1);	// deal with unknown {key}s
					for (var i =0; i < c.length; ++i){
						var x = c.charCodeAt(i);
						rng.dispatch({type: 'keypress', keyCode: x, which: x, charCode: x});
					}
					rng.text(c, 'end');
				}
				text.replace(/{[^}]*}|[^{]+|{/g, function(part){
					(bililiteRange.sendkeys[part] || simplechar)(self, part, simplechar);
				});
				this.bounds(this.data().sendkeysBounds);
				this.dispatch({type: 'sendkeys', which: text});
				return this;
			},
			top: function(){
				return this._nativeTop(this._nativeRange(this.bounds()));
			},
			scrollIntoView: function(scroller){
				var top = this.top();
				// scroll into position if necessary
				if (this._el.scrollTop > top || this._el.scrollTop+this._el.clientHeight < top){
					if (scroller){
						scroller.call(this._el, top);
					}else{
						this._el.scrollTop = top;
					}
				}
				return this;
			},
			wrap: function (n){
				this._nativeWrap(n, this._nativeRange(this.bounds()));
				return this;
			},
			selection: function(text){
				if (arguments.length){
					return this.bounds('selection').text(text, 'end').select();
				}else{
					return this.bounds('selection').text();
				}
			},
			clone: function(){
				return bililiteRange(this._el).bounds(this.bounds());
			},
			all: function(text){
				if (arguments.length){
					this.dispatch ({type: 'beforeinput', data: text});
					this._el[this._textProp] = text;
					this.dispatch ({type: 'input', data: text});
					return this;
				}else{
					return this._el[this._textProp].replace(/\r/g, ''); // need to correct for IE's CrLf weirdness
				}
			},
			element: function() { return this._el },
			// includes a quickie polyfill for CustomEvent for IE that isn't perfect but works for me
			// IE10 allows custom events but not "new CustomEvent"; have to do it the old-fashioned way
			dispatch: function(opts){
				opts = opts || {};
				var event = document.createEvent ? document.createEvent('CustomEvent') : this._doc.createEventObject();
				event.initCustomEvent && event.initCustomEvent(opts.type, !!opts.bubbles, !!opts.cancelable, opts.detail);
				for (var key in opts) event[key] = opts[key];
				// dispatch event asynchronously (in the sense of on the next turn of the event loop; still should be fired in order of dispatch
				var el = this._el;
				setTimeout(function(){
					try {
						el.dispatchEvent ? el.dispatchEvent(event) : el.fireEvent("on" + opts.type, document.createEventObject());
						}catch(e){
						// IE8 will not let me fire custom events at all. Call them directly
							var listeners = el['listen'+opts.type];
							if (listeners) for (var i = 0; i < listeners.length; ++i){
								listeners[i].call(el, event);
							}
						}
				}, 0);
				return this;
			},
			listen: function (type, func){
				var el = this._el;
				if (el.addEventListener){
					el.addEventListener(type, func);
				}else{
					el.attachEvent("on" + type, func);
					// IE8 can't even handle custom events created with createEventObject  (though it permits attachEvent), so we have to make our own
					var listeners = el['listen'+type] = el['listen'+type] || [];
					listeners.push(func);
				}
				return this;
			},
			dontlisten: function (type, func){
				var el = this._el;
				if (el.removeEventListener){
					el.removeEventListener(type, func);
				}else try{
					el.detachEvent("on" + type, func);
				}catch(e){
					var listeners = el['listen'+type];
					if (listeners) for (var i = 0; i < listeners.length; ++i){
						if (listeners[i] === func) listeners[i] = function(){}; // replace with a noop
					}
				}
				return this;
			}
		};
		
		// allow extensions ala jQuery
		bililiteRange.fn = Range.prototype; // to allow monkey patching
		bililiteRange.extend = function(fns){
			for (fn in fns) Range.prototype[fn] = fns[fn];
		};
		
		//bounds functions
		bililiteRange.bounds = {
			all: function() { return [0, this.length()] },
			start: function () { return [0,0] },
			end: function () { return [this.length(), this.length()] },
			selection: function(){
				if (this._el === this._doc.activeElement){
					this.bounds ('all'); // first select the whole thing for constraining
					return this._nativeSelection();
				}else{
					return this._el.bililiteRangeSelection;
				}
			}
		};
		
		// sendkeys functions
		bililiteRange.sendkeys = {
			'{enter}': function (rng){
				simplechar(rng, '\n');
				rng.insertEOL();
			},
			'{tab}': function (rng, c, simplechar){
				simplechar(rng, '\t'); // useful for inserting what would be whitespace
			},
			'{newline}': function (rng, c, simplechar){
				simplechar(rng, '\n'); // useful for inserting what would be whitespace (and if I don't want to use insertEOL, which does some fancy things)
			},
			'{backspace}': function (rng){
				var b = rng.bounds();
				if (b[0] == b[1]) rng.bounds([b[0]-1, b[0]]); // no characters selected; it's just an insertion point. Remove the previous character
				rng.text('', 'end'); // delete the characters and update the selection
			},
			'{del}': function (rng){
				var b = rng.bounds();
				if (b[0] == b[1]) rng.bounds([b[0], b[0]+1]); // no characters selected; it's just an insertion point. Remove the next character
				rng.text('', 'end'); // delete the characters and update the selection
			},
			'{rightarrow}':  function (rng){
				var b = rng.bounds();
				if (b[0] == b[1]) ++b[1]; // no characters selected; it's just an insertion point. Move to the right
				rng.bounds([b[1], b[1]]);
			},
			'{leftarrow}': function (rng){
				var b = rng.bounds();
				if (b[0] == b[1]) --b[0]; // no characters selected; it's just an insertion point. Move to the left
				rng.bounds([b[0], b[0]]);
			},
			'{selectall}' : function (rng){
				rng.bounds('all');
			},
			'{selection}': function (rng){
				// insert the characters without the sendkeys processing
				var s = rng.data().sendkeysOriginalText;
				for (var i =0; i < s.length; ++i){
					var x = s.charCodeAt(i);
					rng.dispatch({type: 'keypress', keyCode: x, which: x, charCode: x});
				}
				rng.text(s, 'end');
			},
			'{mark}' : function (rng){
				rng.data().sendkeysBounds = rng.bounds();
			}
		};
		// Synonyms from the proposed DOM standard (http://www.w3.org/TR/DOM-Level-3-Events-key/)
		bililiteRange.sendkeys['{Enter}'] = bililiteRange.sendkeys['{enter}'];
		bililiteRange.sendkeys['{Backspace}'] = bililiteRange.sendkeys['{backspace}'];
		bililiteRange.sendkeys['{Delete}'] = bililiteRange.sendkeys['{del}'];
		bililiteRange.sendkeys['{ArrowRight}'] = bililiteRange.sendkeys['{rightarrow}'];
		bililiteRange.sendkeys['{ArrowLeft}'] = bililiteRange.sendkeys['{leftarrow}'];
		
		function IERange(){}
		IERange.prototype = new Range();
		IERange.prototype._nativeRange = function (bounds){
			var rng;
			if (this._el.tagName == 'INPUT'){
				// IE 8 is very inconsistent; textareas have createTextRange but it doesn't work
				rng = this._el.createTextRange();
			}else{
				rng = this._doc.body.createTextRange ();
				rng.moveToElementText(this._el);
			}
			if (bounds){
				if (bounds[1] < 0) bounds[1] = 0; // IE tends to run elements out of bounds
				if (bounds[0] > this.length()) bounds[0] = this.length();
				if (bounds[1] < rng.text.replace(/\r/g, '').length){ // correct for IE's CrLf weirdness
					// block-display elements have an invisible, uncounted end of element marker, so we move an extra one and use the current length of the range
					rng.moveEnd ('character', -1);
					rng.moveEnd ('character', bounds[1]-rng.text.replace(/\r/g, '').length);
				}
				if (bounds[0] > 0) rng.moveStart('character', bounds[0]);
			}
			return rng;					
		};
		IERange.prototype._nativeSelect = function (rng){
			rng.select();
		};
		IERange.prototype._nativeSelection = function (){
			// returns [start, end] for the selection constrained to be in element
			var rng = this._nativeRange(); // range of the element to constrain to
			var len = this.length();
			var sel = this._doc.selection.createRange();
			try{
				return [
					iestart(sel, rng),
					ieend (sel, rng)
				];
			}catch (e){
				// TODO: determine if this is still necessary, since we only call _nativeSelection if _el is active
				// IE gets upset sometimes about comparing text to input elements, but the selections cannot overlap, so make a best guess
				return (sel.parentElement().sourceIndex < this._el.sourceIndex) ? [0,0] : [len, len];
			}
		};
		IERange.prototype._nativeGetText = function (rng){
			return rng.text;
		};
		IERange.prototype._nativeSetText = function (text, rng){
			rng.text = text;
		};
		IERange.prototype._nativeEOL = function(){
			if ('value' in this._el){
				this.text('\n'); // for input and textarea, insert it straight
			}else{
				this._nativeRange(this.bounds()).pasteHTML('\n<br/>');
			}
		};
		IERange.prototype._nativeTop = function(rng){
			var startrng = this._nativeRange([0,0]);
			return rng.boundingTop - startrng.boundingTop;
		}
		IERange.prototype._nativeWrap = function(n, rng) {
			// hacky to use string manipulation but I don't see another way to do it.
			var div = document.createElement('div');
			div.appendChild(n);
			// insert the existing range HTML after the first tag
			var html = div.innerHTML.replace('><', '>'+rng.htmlText+'<');
			rng.pasteHTML(html);
		};
		
		// IE internals
		function iestart(rng, constraint){
			// returns the position (in character) of the start of rng within constraint. If it's not in constraint, returns 0 if it's before, length if it's after
			var len = constraint.text.replace(/\r/g, '').length; // correct for IE's CrLf weirdness
			if (rng.compareEndPoints ('StartToStart', constraint) <= 0) return 0; // at or before the beginning
			if (rng.compareEndPoints ('StartToEnd', constraint) >= 0) return len;
			for (var i = 0; rng.compareEndPoints ('StartToStart', constraint) > 0; ++i, rng.moveStart('character', -1));
			return i;
		}
		function ieend (rng, constraint){
			// returns the position (in character) of the end of rng within constraint. If it's not in constraint, returns 0 if it's before, length if it's after
			var len = constraint.text.replace(/\r/g, '').length; // correct for IE's CrLf weirdness
			if (rng.compareEndPoints ('EndToEnd', constraint) >= 0) return len; // at or after the end
			if (rng.compareEndPoints ('EndToStart', constraint) <= 0) return 0;
			for (var i = 0; rng.compareEndPoints ('EndToStart', constraint) > 0; ++i, rng.moveEnd('character', -1));
			return i;
		}
		
		// an input element in a standards document. "Native Range" is just the bounds array
		function InputRange(){}
		InputRange.prototype = new Range();
		InputRange.prototype._nativeRange = function(bounds) {
			return bounds || [0, this.length()];
		};
		InputRange.prototype._nativeSelect = function (rng){
			this._el.setSelectionRange(rng[0], rng[1]);
		};
		InputRange.prototype._nativeSelection = function(){
			return [this._el.selectionStart, this._el.selectionEnd];
		};
		InputRange.prototype._nativeGetText = function(rng){
			return this._el.value.substring(rng[0], rng[1]);
		};
		InputRange.prototype._nativeSetText = function(text, rng){
			var val = this._el.value;
			this._el.value = val.substring(0, rng[0]) + text + val.substring(rng[1]);
		};
		InputRange.prototype._nativeEOL = function(){
			this.text('\n');
		};
		InputRange.prototype._nativeTop = function(rng){
			// I can't remember where I found this clever hack to find the location of text in a text area
			var clone = this._el.cloneNode(true);
			clone.style.visibility = 'hidden';
			clone.style.position = 'absolute';
			this._el.parentNode.insertBefore(clone, this._el);
			clone.style.height = '1px';
			clone.value = this._el.value.slice(0, rng[0]);
			var top = clone.scrollHeight;
			// this gives the bottom of the text, so we have to subtract the height of a single line
			clone.value = 'X';
			top -= clone.scrollHeight;
			clone.parentNode.removeChild(clone);
			return top;
		}
		InputRange.prototype._nativeWrap = function() {throw new Error("Cannot wrap in a text element")};
		
		function W3CRange(){}
		W3CRange.prototype = new Range();
		W3CRange.prototype._nativeRange = function (bounds){
			var rng = this._doc.createRange();
			rng.selectNodeContents(this._el);
			if (bounds){
				w3cmoveBoundary (rng, bounds[0], true, this._el);
				rng.collapse (true);
				w3cmoveBoundary (rng, bounds[1]-bounds[0], false, this._el);
			}
			return rng;					
		};
		W3CRange.prototype._nativeSelect = function (rng){
			this._win.getSelection().removeAllRanges();
			this._win.getSelection().addRange (rng);
		};
		W3CRange.prototype._nativeSelection = function (){
			// returns [start, end] for the selection constrained to be in element
			var rng = this._nativeRange(); // range of the element to constrain to
			if (this._win.getSelection().rangeCount == 0) return [this.length(), this.length()]; // append to the end
			var sel = this._win.getSelection().getRangeAt(0);
			return [
				w3cstart(sel, rng),
				w3cend (sel, rng)
			];
			}
		W3CRange.prototype._nativeGetText = function (rng){
			return String.prototype.slice.apply(this._el.textContent, this.bounds());
			// return rng.toString(); // this fails in IE11 since it insists on inserting \r's before \n's in Ranges. node.textContent works as expected
		};
		W3CRange.prototype._nativeSetText = function (text, rng){
			rng.deleteContents();
			rng.insertNode (this._doc.createTextNode(text));
			if (canNormalize) this._el.normalize(); // merge the text with the surrounding text
		};
		W3CRange.prototype._nativeEOL = function(){
			var rng = this._nativeRange(this.bounds());
			rng.deleteContents();
			var br = this._doc.createElement('br');
			br.setAttribute ('_moz_dirty', ''); // for Firefox
			rng.insertNode (br);
			rng.insertNode (this._doc.createTextNode('\n'));
			rng.collapse (false);
		};
		W3CRange.prototype._nativeTop = function(rng){
			if (this.length == 0) return 0; // no text, no scrolling
			if (rng.toString() == ''){
				var textnode = this._doc.createTextNode('X');
				rng.insertNode (textnode);
			}
			var startrng = this._nativeRange([0,1]);
			var top = rng.getBoundingClientRect().top - startrng.getBoundingClientRect().top;
			if (textnode) textnode.parentNode.removeChild(textnode);
			return top;
		}
		W3CRange.prototype._nativeWrap = function(n, rng) {
			rng.surroundContents(n);
		};
		
		// W3C internals
		function nextnode (node, root){
			//  in-order traversal
			// we've already visited node, so get kids then siblings
			if (node.firstChild) return node.firstChild;
			if (node.nextSibling) return node.nextSibling;
			if (node===root) return null;
			while (node.parentNode){
				// get uncles
				node = node.parentNode;
				if (node == root) return null;
				if (node.nextSibling) return node.nextSibling;
			}
			return null;
		}
		function w3cmoveBoundary (rng, n, bStart, el){
			// move the boundary (bStart == true ? start : end) n characters forward, up to the end of element el. Forward only!
			// if the start is moved after the end, then an exception is raised
			if (n <= 0) return;
			var node = rng[bStart ? 'startContainer' : 'endContainer'];
			if (node.nodeType == 3){
			  // we may be starting somewhere into the text
			  n += rng[bStart ? 'startOffset' : 'endOffset'];
			}
			while (node){
				if (node.nodeType == 3){
					var length = node.nodeValue.length;
					if (n <= length){
						rng[bStart ? 'setStart' : 'setEnd'](node, n);
						// special case: if we end next to a <br>, include that node.
						if (n == length){
							// skip past zero-length text nodes
							for (var next = nextnode (node, el); next && next.nodeType==3 && next.nodeValue.length == 0; next = nextnode(next, el)){
								rng[bStart ? 'setStartAfter' : 'setEndAfter'](next);
							}
							if (next && next.nodeType == 1 && next.nodeName == "BR") rng[bStart ? 'setStartAfter' : 'setEndAfter'](next);
						}
						return;
					}else{
						rng[bStart ? 'setStartAfter' : 'setEndAfter'](node); // skip past this one
						n -= length; // and eat these characters
					}
				}
				node = nextnode (node, el);
			}
		}
		var     START_TO_START                 = 0; // from the w3c definitions
		var     START_TO_END                   = 1;
		var     END_TO_END                     = 2;
		var     END_TO_START                   = 3;
		// from the Mozilla documentation, for range.compareBoundaryPoints(how, sourceRange)
		// -1, 0, or 1, indicating whether the corresponding boundary-point of range is respectively before, equal to, or after the corresponding boundary-point of sourceRange. 
		    // * Range.END_TO_END compares the end boundary-point of sourceRange to the end boundary-point of range.
		    // * Range.END_TO_START compares the end boundary-point of sourceRange to the start boundary-point of range.
		    // * Range.START_TO_END compares the start boundary-point of sourceRange to the end boundary-point of range.
		    // * Range.START_TO_START compares the start boundary-point of sourceRange to the start boundary-point of range. 
		function w3cstart(rng, constraint){
			if (rng.compareBoundaryPoints (START_TO_START, constraint) <= 0) return 0; // at or before the beginning
			if (rng.compareBoundaryPoints (END_TO_START, constraint) >= 0) return constraint.toString().length;
			rng = rng.cloneRange(); // don't change the original
			rng.setEnd (constraint.endContainer, constraint.endOffset); // they now end at the same place
			return constraint.toString().replace(/\r/g, '').length - rng.toString().replace(/\r/g, '').length;
		}
		function w3cend (rng, constraint){
			if (rng.compareBoundaryPoints (END_TO_END, constraint) >= 0) return constraint.toString().length; // at or after the end
			if (rng.compareBoundaryPoints (START_TO_END, constraint) <= 0) return 0;
			rng = rng.cloneRange(); // don't change the original
			rng.setStart (constraint.startContainer, constraint.startOffset); // they now start at the same place
			return rng.toString().replace(/\r/g, '').length;
		}
		
		function NothingRange(){}
		NothingRange.prototype = new Range();
		NothingRange.prototype._nativeRange = function(bounds) {
			return bounds || [0,this.length()];
		};
		NothingRange.prototype._nativeSelect = function (rng){ // do nothing
		};
		NothingRange.prototype._nativeSelection = function(){
			return [0,0];
		};
		NothingRange.prototype._nativeGetText = function (rng){
			return this._el[this._textProp].substring(rng[0], rng[1]);
		};
		NothingRange.prototype._nativeSetText = function (text, rng){
			var val = this._el[this._textProp];
			this._el[this._textProp] = val.substring(0, rng[0]) + text + val.substring(rng[1]);
		};
		NothingRange.prototype._nativeEOL = function(){
			this.text('\n');
		};
		NothingRange.prototype._nativeTop = function(){
			return 0;
		};
		NothingRange.prototype._nativeWrap = function() {throw new Error("Wrapping not implemented")};
		
		
		// data for elements, similar to jQuery data, but allows for monitoring with custom events
		var data = []; // to avoid attaching javascript objects to DOM elements, to avoid memory leaks
		bililiteRange.fn.data = function(){
			var index = this.element().bililiteRangeData;
			if (index == undefined){
				index = this.element().bililiteRangeData = data.length;
				data[index] = new Data(this);
			}
			return data[index];
		}
		try {
			Object.defineProperty({},'foo',{}); // IE8 will throw an error
			var Data = function(rng) {
				// we use JSON.stringify to display the data values. To make some of those non-enumerable, we have to use properties
				Object.defineProperty(this, 'values', {
					value: {}
				});
				Object.defineProperty(this, 'sourceRange', {
					value: rng
				});
				Object.defineProperty(this, 'toJSON', {
					value: function(){
						var ret = {};
						for (var i in Data.prototype) if (i in this.values) ret[i] = this.values[i];
						return ret;
					}
				});
				// to display all the properties (not just those changed), use JSON.stringify(state.all)
				Object.defineProperty(this, 'all', {
					get: function(){
						var ret = {};
						for (var i in Data.prototype) ret[i] = this[i];
						return ret;
					}
				});
			}
		
			Data.prototype = {};
			Object.defineProperty(Data.prototype, 'values', {
				value: {}
			});
			Object.defineProperty(Data.prototype, 'monitored', {
				value: {}
			});
			
			bililiteRange.data = function (name, newdesc){
				newdesc = newdesc || {};
				var desc = Object.getOwnPropertyDescriptor(Data.prototype, name) || {};
				if ('enumerable' in newdesc) desc.enumerable = !!newdesc.enumerable;
				if (!('enumerable' in desc)) desc.enumerable = true; // default
				if ('value' in newdesc) Data.prototype.values[name] = newdesc.value;
				if ('monitored' in newdesc) Data.prototype.monitored[name] = newdesc.monitored;
				desc.configurable = true;
				desc.get = function (){
					if (name in this.values) return this.values[name];
					return Data.prototype.values[name];
				};
				desc.set = function (value){
					this.values[name] = value;
					if (Data.prototype.monitored[name]) this.sourceRange.dispatch({
						type: 'bililiteRangeData',
						bubbles: true,
						detail: {name: name, value: value}
					});
				}
				Object.defineProperty(Data.prototype, name, desc);
			}
		}catch(err){
			// if we can't set object property properties, just use old-fashioned properties
		  Data = function(rng){ this.sourceRange = rng };
			Data.prototype = {};
			bililiteRange.data = function(name, newdesc){
				if ('value' in newdesc) Data.prototype[name] = newdesc.value;
			}
		}
		
		})();
		
		// Polyfill for forEach, per Mozilla documentation. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Polyfill
		if (!Array.prototype.forEach)
		{
		  Array.prototype.forEach = function(fun /*, thisArg */)
		  {
		    "use strict";
		
		    if (this === void 0 || this === null)
		      throw new TypeError();
		
		    var t = Object(this);
		    var len = t.length >>> 0;
		    if (typeof fun !== "function")
		      throw new TypeError();
		
		    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
		    for (var i = 0; i < len; i++)
		    {
		      if (i in t)
		        fun.call(thisArg, t[i], i, t);
		    }
		  };
		}
		
		// end:source /bower_components/jquery-simulate-ext/libs/bililiteRange.js
		// source /bower_components/jquery-simulate-ext/src/jquery.simulate.ext.js
		/*jshint camelcase:true, plusplus:true, forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, maxerr:100, white:false, onevar:false */
		/*global jQuery:true $:true */
		
		/* jQuery Simulate Extended Plugin 1.3.0
		 * http://github.com/j-ulrich/jquery-simulate-ext
		 * 
		 * Copyright (c) 2014 Jochen Ulrich
		 * Licensed under the MIT license (MIT-LICENSE.txt).
		 */
		
		;(function( $ ) {
			"use strict";
		
			/* Overwrite the $.simulate.prototype.mouseEvent function
			 * to convert pageX/Y to clientX/Y
			 */
			var originalMouseEvent = $.simulate.prototype.mouseEvent,
				rdocument = /\[object (?:HTML)?Document\]/;
			
			$.simulate.prototype.mouseEvent = function(type, options) {
				if (options.pageX || options.pageY) {
					var doc = rdocument.test(Object.prototype.toString.call(this.target))? this.target : (this.target.ownerDocument || document);
					options.clientX = (options.pageX || 0) - $(doc).scrollLeft();
					options.clientY = (options.pageY || 0) - $(doc).scrollTop();
				}
				return originalMouseEvent.apply(this, [type, options]);
			};
			
			
		})( jQuery );
		
		// end:source /bower_components/jquery-simulate-ext/src/jquery.simulate.ext.js
		// source /bower_components/jquery-simulate-ext/src/jquery.simulate.drag-n-drop.js
		/*jshint camelcase:true, plusplus:true, forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, maxerr:100, white:false, onevar:false */
		/*global jQuery:true $:true */
		
		/* jQuery Simulate Drag-n-Drop Plugin 1.3.0
		 * http://github.com/j-ulrich/jquery-simulate-ext
		 * 
		 * Copyright (c) 2014 Jochen Ulrich
		 * Licensed under the MIT license (MIT-LICENSE.txt).
		 */
		
		;(function($, undefined) {
			"use strict";
			
			/* Overwrite the $.fn.simulate function to reduce the jQuery set to the first element for the
			 * drag-n-drop interactions.
			 */
			$.fn.simulate = function( type, options ) {
				switch (type) {
				case "drag":
				case "drop":
				case "drag-n-drop":
					var ele = this.first();
					new $.simulate( ele[0], type, options);
					return ele;
				default:
					return this.each(function() {
						new $.simulate( this, type, options );
					});
				}
			};
			
			var now = Date.now || function() { return new Date().getTime(); };
			
			var rdocument = /\[object (?:HTML)?Document\]/;
			/**
			 * Tests whether an object is an (HTML) document object.
			 * @param {DOM Element} elem - the object/element to be tested
			 * @returns {Boolean} <code>true</code> if <i>elem</i> is an (HTML) document object.
			 * @private
			 * @author julrich
			 * @since 1.1
			 */
			function isDocument( elem ) {
				return rdocument.test(Object.prototype.toString.call($(elem)[0]));
			}
			
			/**
			 * Selects the first match from an array.
			 * @param {Array} array - Array of objects to be be tested
			 * @param {Function} check - Callback function that accepts one argument (which will be one element
			 * from the <i>array</i>) and returns a boolean.
			 * @returns {Boolean|null} the first element in <i>array</i> for which <i>check</i> returns <code>true</code>.
			 * If none of the elements in <i>array</i> passes <i>check</i>, <code>null</code> is returned.
			 * @private
			 * @author julrich
			 * @since 1.1
			 */
			function selectFirstMatch(array, check) {
				var i;
				if ($.isFunction(check)) {
					for (i=0; i < array.length; i+=1) {
						if (check(array[i])) {
							return array[i];
						}
					}
					return null;
				}
				else {
					for (i=0; i < array.length; i+=1) {
						if (array[i]) {
							return array[i];
						}
					}
					return null;
				}
			}
			
			// Based on the findCenter function from jquery.simulate.js
			/**
			 * Calculates the position of the center of an DOM element.
			 * @param {DOM Element} elem - the element whose center should be calculated.
			 * @returns {Object} an object with the properties <code>x</code> and <code>y</code>
			 * representing the position of the center of <i>elem</i> in page relative coordinates
			 * (i.e. independent of any scrolling).
			 * @private
			 * @author julrich
			 * @since 1.0
			 */
			function findCenter( elem ) {
				var offset,
					$elem = $( elem );
				if ( isDocument($elem[0]) ) {
					offset = {left: 0, top: 0}; 
				}
				else {
					offset = $elem.offset();
				}
					
				return {
					x: offset.left + $elem.outerWidth() / 2,
					y: offset.top + $elem.outerHeight() / 2
				};
			}
			
			/**
			 * Converts page relative coordinates into client relative coordinates.
			 * @param {Numeric|Object} x - Either the x coordinate of the page relative coordinates or
			 * an object with the properties <code>pageX</code> and <code>pageY</code> representing page
			 * relative coordinates.
			 * @param {Numeric} [y] - If <i>x</i> is numeric (i.e. the x coordinate of page relative coordinates),
			 * then this is the y coordinate. If <i>x</i> is an object, this parameter is skipped.
			 * @param {DOM Document} [docRel] - Optional DOM document object used to calculate the client relative
			 * coordinates. The page relative coordinates are interpreted as being relative to that document and
			 * the scroll position of that document is used to calculate the client relative coordinates.
			 * By default, <code>document</code> is used.
			 * @returns {Object} an object representing the client relative coordinates corresponding to the
			 * given page relative coordinates. The object either provides the properties <code>x</code> and
			 * <code>y</code> when <i>x</i> and <i>y</i> were given as arguments, or <code>clientX</code>
			 * and <code>clientY</code> when the parameter <i>x</i> was given as an object (see above).
			 * @private
			 * @author julrich
			 * @since 1.0
			 */
			function pageToClientPos(x, y, docRel) {
				var $document;
				if ( isDocument(y) ) {
					$document = $(y);
				} else {
					$document = $(docRel || document);
				}
				
				if (typeof x === "number" && typeof y === "number") {
					return {
						x: x - $document.scrollLeft(),
						y: y - $document.scrollTop()
					};
				}
				else if (typeof x === "object" && x.pageX && x.pageY) {
					return {
						clientX: x.pageX - $document.scrollLeft(),
						clientY: x.pageY - $document.scrollTop()
					};
				}
			}
			
			/**
			 * Browser-independent implementation of <code>document.elementFromPoint()</code>.
			 * 
			 * When run for the first time on a scrolled page, this function performs a check on how
			 * <code>document.elementFromPoint()</code> is implemented in the current browser. It stores
			 * the results in two static variables so that the check can be skipped for successive calls.
			 * 
			 * @param {Numeric|Object} x - Either the x coordinate of client relative coordinates or an object
			 * with the properties <code>x</code> and <code>y</code> representing client relative coordinates.
			 * @param {Numeric} [y] - If <i>x</i> is numeric (i.e. the x coordinate of client relative coordinates),
			 * this is the y coordinate. If <i>x</i> is an object, this parameter is skipped.
			 * @param {DOM Document} [docRel] - Optional DOM document object
			 * @returns {DOM Element|Null}
			 * @private
			 * @author Nicolas Zeh (Basic idea), julrich
			 * @see http://www.zehnet.de/2010/11/19/document-elementfrompoint-a-jquery-solution/
			 * @since 1.0
			 */
			function elementAtPosition(x, y, docRel) {
				var doc;
				if ( isDocument(y) ) {
					doc = y;
				} else {
					doc = docRel || document;
				}
				
				if(!doc.elementFromPoint) {
					return null;
				}
		
				var clientX = x, clientY = y;
				if (typeof x === "object" && (x.clientX || x.clientY)) {
					clientX = x.clientX || 0 ;
					clientY = x.clientY || 0;
				}
				
				if(elementAtPosition.prototype.check)
				{
					var sl, ele;
					if ((sl = $(doc).scrollTop()) >0)
					{
						ele = doc.elementFromPoint(0, sl + $(window).height() -1);
						if ( ele !== null && ele.tagName.toUpperCase() === 'HTML' ) { ele = null; }
						elementAtPosition.prototype.nativeUsesRelative = ( ele === null );
					}
					else if((sl = $(doc).scrollLeft()) >0)
					{
						ele = doc.elementFromPoint(sl + $(window).width() -1, 0);
						if ( ele !== null && ele.tagName.toUpperCase() === 'HTML' ) { ele = null; }
						elementAtPosition.prototype.nativeUsesRelative = ( ele === null );
					}
					elementAtPosition.prototype.check = (sl<=0); // Check was not meaningful because we were at scroll position 0
				}
		
				if(!elementAtPosition.prototype.nativeUsesRelative)
				{
					clientX += $(doc).scrollLeft();
					clientY += $(doc).scrollTop();
				}
		
				return doc.elementFromPoint(clientX,clientY);
			}
			// Default values for the check variables
			elementAtPosition.prototype.check = true;
			elementAtPosition.prototype.nativeUsesRelative = true;
			
			/**
			 * Informs the rest of the world that the drag is finished.
			 * @param {DOM Element} ele - The element which was dragged.
			 * @param {Object} [options] - The drag options.
			 * @fires simulate-drag
			 * @private
			 * @author julrich 
			 * @since 1.0
			 */
			function dragFinished(ele, options) {
				var opts = options || {};
				$(ele).trigger({type: "simulate-drag"});
				if ($.isFunction(opts.callback)) {
					opts.callback.apply(ele);
				}
			}
			
			/**
			 * Generates a series of <code>mousemove</code> events for a drag.
			 * @param {Object} self - The simulate object.
			 * @param {DOM Element} ele - The element which is dragged.
			 * @param {Object} start - The start coordinates of the drag, represented using the properties
			 * <code>x</code> and <code>y</code>.
			 * @param {Object} drag - The distance to be dragged, represented using the properties <code>dx</code>
			 * and <code>dy</code>.
			 * @param {Object} options - The drag options. Must have the property <code>interpolation</code>
			 * containing the interpolation options (<code>stepWidth</code>, <code>stepCount</code>, etc.).
			 * @requires eventTarget
			 * @requires now()
			 * @private
			 * @author julrich
			 * @since 1.0
			 */
			function interpolatedEvents(self, ele, start, drag, options) {
				var targetDoc = selectFirstMatch([ele, ele.ownerDocument], isDocument) || document,
					interpolOptions = options.interpolation,
					dragDistance = Math.sqrt(Math.pow(drag.dx,2) + Math.pow(drag.dy,2)), // sqrt(a^2 + b^2)
					stepWidth, stepCount, stepVector;
				
				if (interpolOptions.stepWidth) {
					stepWidth = parseInt(interpolOptions.stepWidth, 10);
					stepCount = Math.floor(dragDistance / stepWidth)-1;
					var stepScale = stepWidth / dragDistance;
					stepVector = {x: drag.dx*stepScale, y: drag.dy*stepScale };
				}
				else {
					stepCount = parseInt(interpolOptions.stepCount, 10);
					stepWidth = dragDistance / (stepCount+1);
					stepVector = {x: drag.dx/(stepCount+1), y: drag.dy/(stepCount+1)};
				}
				
				
				var coords = $.extend({},start);
				
				/**
				 * Calculates the effective coordinates for one <code>mousemove</code> event and fires the event.
				 * @requires eventTarget
				 * @requires targetDoc
				 * @requires coords
				 * @requires stepVector
				 * @requires interpolOptions
				 * @fires mousemove
				 * @inner
				 * @author julrich
				 * @since 1.0
				 */
				function interpolationStep() {
					coords.x += stepVector.x;
					coords.y += stepVector.y;
					var effectiveCoords = {pageX: coords.x, pageY: coords.y};
					if (interpolOptions.shaky && (interpolOptions.shaky === true || !isNaN(parseInt(interpolOptions.shaky,10)) )) {
						var amplitude = (interpolOptions.shaky === true)? 1 : parseInt(interpolOptions.shaky,10);
						effectiveCoords.pageX += Math.floor(Math.random()*(2*amplitude+1)-amplitude);
						effectiveCoords.pageY += Math.floor(Math.random()*(2*amplitude+1)-amplitude);
					}
					var clientCoord = pageToClientPos(effectiveCoords, targetDoc),
						eventTarget = elementAtPosition(clientCoord, targetDoc) || ele;
					self.simulateEvent( eventTarget, "mousemove", {pageX: Math.round(effectiveCoords.pageX), pageY: Math.round(effectiveCoords.pageY)});	
				}
				
				
				var lastTime;
				
				/**
				 * Performs one interpolation step (i.e. cares about firing the event) and then sleeps for
				 * <code>stepDelay</code> milliseconds.
				 * @requires lastTime
				 * @requires stepDelay
				 * @requires step
				 * @requires ele
				 * @requires eventTarget
				 * @reuiqre targetDoc
				 * @requires start
				 * @requires drag
				 * @requires now()
				 * @inner
				 * @author julrich
				 * @since 1.0
				 */
				function stepAndSleep() {
					var timeElapsed = now() - lastTime; // Work-around for Firefox & IE "bug": setTimeout can fire before the timeout
					if (timeElapsed >= stepDelay) {
						if (step < stepCount) {
							interpolationStep();
							step += 1;
							lastTime = now();
							setTimeout(stepAndSleep, stepDelay);
						}
						else {
							var pageCoord = {pageX: Math.round(start.x+drag.dx), pageY: Math.round(start.y+drag.dy)},
								clientCoord = pageToClientPos(pageCoord, targetDoc),
								eventTarget = elementAtPosition(clientCoord, targetDoc) || ele;
							self.simulateEvent( eventTarget, "mousemove", pageCoord);
							dragFinished(ele, options);
						}
					}
					else {
						setTimeout(stepAndSleep, stepDelay - timeElapsed);
					}
		
				}
		
				if ( (!interpolOptions.stepDelay && !interpolOptions.duration) || ((interpolOptions.stepDelay <= 0) && (interpolOptions.duration <= 0)) ) {
					// Trigger as fast as possible
					for (var i=0; i < stepCount; i+=1) {
						interpolationStep();
					}
					var pageCoord = {pageX: Math.round(start.x+drag.dx), pageY: Math.round(start.y+drag.dy)},
						clientCoord = pageToClientPos(pageCoord, targetDoc),
						eventTarget = elementAtPosition(clientCoord, targetDoc) || ele;
					self.simulateEvent( eventTarget, "mousemove", pageCoord);
					dragFinished(ele, options);
				}
				else {
					var stepDelay = parseInt(interpolOptions.stepDelay,10) || Math.ceil(parseInt(interpolOptions.duration,10) / (stepCount+1));
					var step = 0;
		
					lastTime = now();
					setTimeout(stepAndSleep, stepDelay);
				}
				
			}
		
			/**
			 * @returns {Object|undefined} an object containing information about the currently active drag
			 * or <code>undefined</code> when there is no active drag.
			 * The returned object contains the following properties:
			 * <ul>
			 *     <li><code>dragElement</code>: the dragged element</li>
			 *     <li><code>dragStart</code>: object with the properties <code>x</code> and <code>y</code>
			 * representing the page relative start coordinates of the drag</li>
			 *     <li><code>dragDistance</code>: object with the properties <code>x</code> and <code>y</code>
			 * representing the distance of the drag in x and y direction</li>
			 * </ul>
			 * @public
			 * @author julrich
			 * @since 1.0
			 */
			$.simulate.activeDrag = function() {
				if (!$.simulate._activeDrag) {
					return undefined;
				}
				return $.extend(true,{},$.simulate._activeDrag);
			};
			
			$.extend( $.simulate.prototype,
		
			/**
			 * @lends $.simulate.prototype
			 */
			{
				
			
				/**
				 * Simulates a drag.
				 *
				 * @see https://github.com/j-ulrich/jquery-simulate-ext/blob/master/doc/drag-n-drop.md
				 * @public
				 * @author julrich
				 * @since 1.0
				 */
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
						},	this.options);
					
					var start,
						continueDrag = ($.simulate._activeDrag && $.simulate._activeDrag.dragElement === ele);
					
					if (continueDrag) {
						start = $.simulate._activeDrag.dragStart;
					}
					else {
						start = findCenter( ele );
					}
						
					var x = Math.round( start.x ),
						y = Math.round( start.y ),
						coord = { pageX: x, pageY: y },
						dx,
						dy;
						
					if (options.dragTarget) {
						var end = findCenter(options.dragTarget);
						dx = Math.round(end.x - start.x);
						dy = Math.round(end.y - start.y);
					}
					else {
						dx = options.dx || 0;
						dy = options.dy || 0;
					}
						
					if (continueDrag) {
						// We just continue to move the dragged element
						$.simulate._activeDrag.dragDistance.x += dx;
						$.simulate._activeDrag.dragDistance.y += dy;	
						coord = { pageX: Math.round(x + $.simulate._activeDrag.dragDistance.x) , pageY: Math.round(y + $.simulate._activeDrag.dragDistance.y) };
					}
					else {
						if ($.simulate._activeDrag) {
							// Drop before starting a new drag
							$($.simulate._activeDrag.dragElement).simulate( "drop" );
						}
						
						// We start a new drag
						$.extend(options.eventProps, coord);
						self.simulateEvent( ele, "mousedown", options.eventProps );
						if (options.clickToDrag === true) {
							self.simulateEvent( ele, "mouseup", options.eventProps );
							self.simulateEvent( ele, "click", options.eventProps );
						}
						$(ele).add(ele.ownerDocument).one('mouseup', function() {
							$.simulate._activeDrag = undefined;
						});
						
						$.extend($.simulate, {
							_activeDrag: {
								dragElement: ele,
								dragStart: { x: x, y: y },
								dragDistance: { x: dx, y: dy }
							}
						});
						coord = { pageX: Math.round(x + dx), pageY: Math.round(y + dy) };
					}
		
					if (dx !== 0 || dy !== 0) {
						
						if ( options.interpolation && (options.interpolation.stepCount || options.interpolation.stepWidth) ) {
							interpolatedEvents(self, ele, {x: x, y: y}, {dx: dx, dy: dy}, options);
						}
						else {
							var targetDoc = selectFirstMatch([ele, ele.ownerDocument], isDocument) || document,
								clientCoord = pageToClientPos(coord, targetDoc),
								eventTarget = elementAtPosition(clientCoord, targetDoc) || ele;
		
							$.extend(options.eventProps, coord);
							self.simulateEvent( eventTarget, "mousemove", options.eventProps );
							dragFinished(ele, options);
						}
					}
					else {
						dragFinished(ele, options);
					}
				},
				
				/**
				 * Simulates a drop.
				 * 
				 * @see https://github.com/j-ulrich/jquery-simulate-ext/blob/master/doc/drag-n-drop.md
				 * @public
				 * @author julrich
				 * @since 1.0
				 */
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
						center = findCenter( ele ),
						x = Math.round( center.x ),
						y = Math.round( center.y ),
						coord = { pageX: x, pageY: y },
						targetDoc = ( (activeDrag)? selectFirstMatch([activeDrag.dragElement, activeDrag.dragElement.ownerDocument], isDocument) : selectFirstMatch([ele, ele.ownerDocument], isDocument) ) || document, 
						clientCoord = pageToClientPos(coord, targetDoc),
						eventTarget = elementAtPosition(clientCoord, targetDoc);
					
					if (activeDrag && (activeDrag.dragElement === ele || isDocument(ele))) {
						// We already moved the mouse during the drag so we just simulate the drop on the end position
						x = Math.round(activeDrag.dragStart.x + activeDrag.dragDistance.x);
						y = Math.round(activeDrag.dragStart.y + activeDrag.dragDistance.y);
						coord = { pageX: x, pageY: y };
						clientCoord = pageToClientPos(coord, targetDoc);
						eventTarget = elementAtPosition(clientCoord, targetDoc);
						moveBeforeDrop = false;
					}
					
					if (!eventTarget) {
						eventTarget = (activeDrag)? activeDrag.dragElement : ele;
					}
					
					$.extend(options.eventProps, coord);
		
					if (moveBeforeDrop === true) {
						// Else we assume the drop should happen on target, so we move there
						self.simulateEvent( eventTarget, "mousemove", options.eventProps );
					}
		
					if (options.clickToDrop) {
						self.simulateEvent( eventTarget, "mousedown", options.eventProps );
					}
					this.simulateEvent( eventTarget, "mouseup", options.eventProps );
					if (options.clickToDrop) {
						self.simulateEvent( eventTarget, "click", options.eventProps );
					}
					
					$.simulate._activeDrag = undefined;
					$(eventTarget).trigger({type: "simulate-drop"});
					if ($.isFunction(options.callback)) {
						options.callback.apply(eventTarget);
					}
				},
				
				/**
				 * Simulates a drag followed by drop.
				 * 
				 * @see https://github.com/j-ulrich/jquery-simulate-ext/blob/master/doc/drag-n-drop.md
				 * @public
				 * @author julrich
				 * @since 1.0
				 */
				simulateDragNDrop: function() {
					var self = this,
						ele = this.target,
						options = $.extend({
							dragTarget: undefined,
							dropTarget: undefined
						}, self.options),
						// If there is a dragTarget or dx/dy, then we drag there and simulate an independent drop on dropTarget or ele
						dropEle = ((options.dragTarget || options.dx || options.dy)? options.dropTarget : ele) || ele;
		/*
						dx = (options.dropTarget)? 0 : (options.dx || 0),
						dy = (options.dropTarget)? 0 : (options.dy || 0),
						dragDistance = { dx: dx, dy: dy };
					
					$.extend(options, dragDistance);
		*/			
					$(ele).simulate( "drag", $.extend({},options,{
						// If there is no dragTarget, no dx and no dy, we drag onto the dropTarget directly
						dragTarget: options.dragTarget || ((options.dx || options.dy)?undefined:options.dropTarget),
						callback: function() {
							$(dropEle).simulate( "drop", options );
						}
					}));
					
				}
			});
			
		}(jQuery));
		// end:source /bower_components/jquery-simulate-ext/src/jquery.simulate.drag-n-drop.js
		// source /bower_components/jquery-simulate-ext/src/jquery.simulate.key-combo.js
		/*jshint camelcase:true, plusplus:true, forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, maxerr:100, white:false, onevar:false */
		/*global jQuery:true $:true */
		
		/* jQuery Simulate Key-Combo Plugin 1.3.0
		 * http://github.com/j-ulrich/jquery-simulate-ext
		 * 
		 * Copyright (c) 2014 Jochen Ulrich
		 * Licensed under the MIT license (MIT-LICENSE.txt).
		 */
		
		/**
		 * 
		 * For details about key events, key codes, char codes etc. see http://unixpapa.com/js/key.html
		 */
		
		;(function($,undefined) {
			"use strict";
		
			/**
			 * Key codes of special keys.
			 * @private
			 * @author julrich
			 * @since 1.3.0
			 */
			var SpecialKeyCodes = {
				// Modifier Keys
				SHIFT:			16,
				CONTROL:		17,
				ALTERNATIVE:	18,
				META:			91,
				// Arrow Keys
				LEFT_ARROW:		37,
				UP_ARROW:		38,
				RIGHT_ARROW:	39,
				DOWN_ARROW:		40,
				// Function Keys
				F1:				112,
				F2:				113,
				F3:				114,
				F4:				115,
				F5:				116,
				F6:				117,
				F7:				118,
				F8:				119,
				F9:				120,
				F10:			121,
				F11:			122,
				F12:			123,
				// Other
				ENTER:			13,
				TABULATOR:		9,
				ESCAPE:			27,
				BACKSPACE:		8,
				INSERT:			45,
				DELETE:			46,
				HOME:			36,
				END:			35,
				PAGE_UP:		33,
				PAGE_DOWN:		34,
		
			};
			
			// SpecialKeyCode aliases
			SpecialKeyCodes.CTRL	= SpecialKeyCodes.CONTROL;
			SpecialKeyCodes.ALT		= SpecialKeyCodes.ALTERNATIVE;
			SpecialKeyCodes.COMMAND	= SpecialKeyCodes.META;
			SpecialKeyCodes.TAB		= SpecialKeyCodes.TABULATOR;
			SpecialKeyCodes.ESC		= SpecialKeyCodes.ESCAPE;
			
		
			$.extend( $.simulate.prototype,
					
			/**
			 * @lends $.simulate.prototype
			 */		
			{
				
				
				/**
				 * Simulates simultaneous key presses
				 * 
				 * @see https://github.com/j-ulrich/jquery-simulate-ext/blob/master/doc/key-combo.md
				 * @public
				 * @author julrich
				 * @since 1.0
				 */
				simulateKeyCombo: function() {
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
					
					// Remove empty parts
					comboSplit = $.grep(comboSplit, function(part) {
						return (part !== "");
					});
					
					for (i=0; i < comboSplit.length; i+=1) {
						var key = comboSplit[i],
							keyLowered = key.toLowerCase(),
							keySpecial = key.toUpperCase().replace('-','_');
						
						if (plusExpected) {
							if (key !== "+") {
								throw 'Syntax error: expected "+"';
							}
							else {
								plusExpected = false;
							}
						}
						else {
							var keyCode;
							if ( key.length > 1) {
								// Assume a special key
								keyCode = SpecialKeyCodes[keySpecial];
								
								if (keyCode === undefined) {
									throw 'Syntax error: unknown special key "'+key+'" (forgot "+" between keys?)';
								}
								
								switch (keyCode) {
								case SpecialKeyCodes.CONTROL:
								case SpecialKeyCodes.ALT:
								case SpecialKeyCodes.SHIFT:
								case SpecialKeyCodes.META:
									options.eventProps[keyLowered+"Key"] = true;
									break;
								}
								holdKeys.unshift(keyCode);
								options.eventProps.keyCode = keyCode;
								options.eventProps.which = keyCode;
								options.eventProps.charCode = 0;
								$target.simulate("keydown", options.eventProps);
								
							}
							else {
								// "Normal" key
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
									$target.simulate('key-sequence', {sequence: key, triggerKeyEvents: false});
								}
							}
							
							plusExpected = true;
						}
					}
					
					if (!plusExpected) {
						throw 'Syntax error: expected key (trailing "+"?)';
					}
					
					// Release keys
					options.eventProps.charCode = undefined;
					for (i=0; i < holdKeys.length; i+=1) {
						options.eventProps.keyCode = holdKeys[i];
						options.eventProps.which = holdKeys[i];
						switch (options.eventProps.keyCode) {
						case SpecialKeyCodes.ALT:		options.eventProps.altKey = false; break;
						case SpecialKeyCodes.SHIFT:		options.eventProps.shiftKey = false; break;
						case SpecialKeyCodes.CONTROL:	options.eventProps.ctrlKey = false; break;
						case SpecialKeyCodes.META:		options.eventProps.metaKey = false; break;
						default:
							break;
						}
						$target.simulate("keyup", options.eventProps);				
					}
				}
				
			});
		}(jQuery));
		// end:source /bower_components/jquery-simulate-ext/src/jquery.simulate.key-combo.js
		// source /bower_components/jquery-simulate-ext/src/jquery.simulate.key-sequence.js
		/*jshint camelcase:true, plusplus:true, forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, maxerr:100, white:false, onevar:false */
		/*global jQuery:true $:true bililiteRange:true */
		
		/* jQuery Simulate Key-Sequence Plugin 1.3.0
		 * http://github.com/j-ulrich/jquery-simulate-ext
		 * 
		 * Copyright (c) 2014 Jochen Ulrich
		 * Licensed under the MIT license (MIT-LICENSE.txt).
		 * 
		 * The plugin is an extension and modification of the jQuery sendkeys plugin by Daniel Wachsstock.
		 * Therefore, the original copyright notice and license follow below.
		 */
		
		// insert characters in a textarea or text input field
		// special characters are enclosed in {}; use {{} for the { character itself
		// documentation: http://bililite.com/blog/2008/08/20/the-fnsendkeys-plugin/
		// Version: 2.0
		// Copyright (c) 2010 Daniel Wachsstock
		// MIT license:
		// Permission is hereby granted, free of charge, to any person
		// obtaining a copy of this software and associated documentation
		// files (the "Software"), to deal in the Software without
		// restriction, including without limitation the rights to use,
		// copy, modify, merge, publish, distribute, sublicense, and/or sell
		// copies of the Software, and to permit persons to whom the
		// Software is furnished to do so, subject to the following
		// conditions:
		//
		// The above copyright notice and this permission notice shall be
		// included in all copies or substantial portions of the Software.
		//
		// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
		// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
		// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
		// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
		// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
		// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
		// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
		// OTHER DEALINGS IN THE SOFTWARE.
		
		;(function($, undefined){
			"use strict";
			
			$.simulate.prototype.quirks = $.simulate.prototype.quirks || {};
			
			$.extend($.simulate.prototype.quirks, 
		
			/**
			 * @lends $.simulate.prototype.quirks
			 */		
			{
				/**
				 * When simulating with delay in non-input elements,
				 * all spaces are simulated at the end of the sequence instead
				 * of the correct position.
				 * @see {@link https://github.com/j-ulrich/jquery-simulate-ext/issues/6|issues #6}
				 */
				delayedSpacesInNonInputGlitchToEnd: undefined
		
			});
			
			$.extend($.simulate.prototype,
					
			/**
			 * @lends $.simulate.prototype
			 */		
			{
				
				/**
				 * Simulates sequencial key strokes.
				 * 
				 * @see https://github.com/j-ulrich/jquery-simulate-ext/blob/master/doc/key-sequence.md
				 * @public
				 * @author Daniel Wachsstock, julrich
				 * @since 1.0
				 */
				simulateKeySequence: function() {
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
					
					opts.delay = parseInt(opts.delay,10);
		
					var localkeys = {};
		
					// Fix for #6 (https://github.com/j-ulrich/jquery-simulate-ext/issues/6)
					if ($.simulate.prototype.quirks.delayedSpacesInNonInputGlitchToEnd && !$target.is('input,textarea')) {
						$.extend(localkeys, {
							' ': function(rng, s, opts) {
								var internalOpts = $.extend({}, opts, {
									triggerKeyEvents: false,
									delay: 0,
									callback: undefined
								});
								$.simulate.prototype.simulateKeySequence.defaults.simplechar(rng, '\xA0', internalOpts);
								$.simulate.prototype.simulateKeySequence.defaults['{leftarrow}'](rng, s, internalOpts);
								$.simulate.prototype.simulateKeySequence.defaults.simplechar(rng, s, opts);
								$.simulate.prototype.simulateKeySequence.defaults['{del}'](rng, s, internalOpts);
							}
						});
					}
		
					$.extend(localkeys, opts, $target.data('simulate-keySequence')); // allow for element-specific key functions
		
					// most elements to not keep track of their selection when they lose focus, so we have to do it for them
					var rng = $.data (target, 'simulate-keySequence.selection');
					if (!rng){
						rng = bililiteRange(target).bounds('selection');
						$.data(target, 'simulate-keySequence.selection', rng);
						$target.bind('mouseup.simulate-keySequence', function(){
							// we have to update the saved range. The routines here update the bounds with each press, but actual keypresses and mouseclicks do not
							$.data(target, 'simulate-keySequence.selection').bounds('selection');
						}).bind('keyup.simulate-keySequence', function(evt){
							// restore the selection if we got here with a tab (a click should select what was clicked on)
							if (evt.which === 9){
								// there's a flash of selection when we restore the focus, but I don't know how to avoid that.
								$.data(target, 'simulate-keySequence.selection').select();
							}else{
								$.data(target, 'simulate-keySequence.selection').bounds('selection');
							}	
						});
					}
					$target.focus();
					if (typeof sequence === 'undefined') { // no string, so we just set up the event handlers
						return;
					}
					sequence = sequence.replace(/\n/g, '{enter}'); // turn line feeds into explicit break insertions
					
					/**
					 * Informs the rest of the world that the sequences is finished.
					 * @fires simulate-keySequence
					 * @requires target
					 * @requires sequence
					 * @requires opts
					 * @inner
					 * @author julrich
					 * @since 1.0
					 */
					function sequenceFinished() {
						$target.trigger({type: 'simulate-keySequence', sequence: sequence});
						if ($.isFunction(opts.callback)) {
							opts.callback.apply(target, [{
								sequence: sequence
							}]);
						}
					}
					
					/**
					 * Simulates the key stroke for one character (or special sequence) and sleeps for
					 * <code>opts.delay</code> milliseconds.
					 * @requires lastTime
					 * @requires now()
					 * @requires tokenRegExp
					 * @requires opts
					 * @requires rng
					 * @inner
					 * @author julrich
					 * @since 1.0
					 */
					function processNextToken() {
						var timeElapsed = now() - lastTime; // Work-around for Firefox "bug": setTimeout can fire before the timeout
						if (timeElapsed >= opts.delay) {
							var match = tokenRegExp.exec(sequence);
							if ( match !== null ) {
								var s = match[0];
								(localkeys[s] || $.simulate.prototype.simulateKeySequence.defaults[s] || $.simulate.prototype.simulateKeySequence.defaults.simplechar)(rng, s, opts);
								setTimeout(processNextToken, opts.delay);
							}
							else {
								sequenceFinished();
							}
							lastTime = now();
						}
						else {
							setTimeout(processNextToken, opts.delay - timeElapsed);
						}
					}
		
					if (!opts.delay || opts.delay <= 0) {
						// Run as fast as possible
						sequence.replace(/\{[^}]*\}|[^{]+/g, function(s){
							(localkeys[s] || $.simulate.prototype.simulateKeySequence.defaults[s] || $.simulate.prototype.simulateKeySequence.defaults.simplechar)(rng, s, opts);
						});
						sequenceFinished();
					}
					else {
						var tokenRegExp = /\{[^}]*\}|[^{]/g; // This matches curly bracket expressions or single characters
						var now = Date.now || function() { return new Date().getTime(); },
							lastTime = now();
						
						processNextToken();
					}
					
				}
			});
		
			$.extend($.simulate.prototype.simulateKeySequence.prototype,
					
			/**
			 * @lends $.simulate.prototype.simulateKeySequence.prototype
			 */		
			{
				
					/**
					 * Maps special character char codes to IE key codes (covers IE and Webkit)
					 * @author julrich
					 * @since 1.0
					 */
					IEKeyCodeTable: {
						33: 49,	// ! -> 1
						64: 50,	// @ -> 2
						35: 51,	// # -> 3
						36: 52,	// $ -> 4
						37: 53,	// % -> 5
						94: 54,	// ^ -> 6
						38: 55,	// & -> 7
						42: 56,	// * -> 8
						40: 57,	// ( -> 9
						41: 48,	// ) -> 0
						
						59: 186,	// ; -> 186
						58: 186,	// : -> 186
						61: 187,	// = -> 187
						43: 187,	// + -> 187
						44: 188,	// , -> 188
						60: 188,	// < -> 188
						45: 189,	// - -> 189
						95: 189,	// _ -> 189
						46: 190,	// . -> 190
						62: 190,	// > -> 190
						47: 191,	// / -> 191
						63: 191,	// ? -> 191
						96: 192,	// ` -> 192
						126: 192,	// ~ -> 192
						91: 219,	// [ -> 219
						123: 219,	// { -> 219
						92: 220,	// \ -> 220
						124: 220,	// | -> 220
						93: 221,	// ] -> 221
						125: 221,	// } -> 221
						39: 222,	// ' -> 222
						34: 222		// " -> 222
					},
					
					/**
					 * Tries to convert character codes to key codes.
					 * @param {Numeric} character - A character code
					 * @returns {Numeric} The key code corresponding to the given character code,
					 * based on the key code table of InternetExplorer. If no corresponding key code
					 * could be found (which will be the case for all special characters except the common
					 * ones), the character code itself is returned. However, <code>keyCode === charCode</code>
					 * does not imply that no key code was found because some key codes are identical to the
					 * character codes (e.g. for uppercase characters).
					 * @requires $.simulate.prototype.simulateKeySequence.prototype.IEKeyCodeTable
					 * @see $.simulate.prototype.simulateKeySequence.prototype.IEKeyCodeTable
					 * @author julrich
					 * @since 1.0
					 */
					charToKeyCode: function(character) {
						var specialKeyCodeTable = $.simulate.prototype.simulateKeySequence.prototype.IEKeyCodeTable;
						var charCode = character.charCodeAt(0);
				
						if (charCode >= 64 && charCode <= 90 || charCode >= 48 && charCode <= 57) {
							// A-Z and 0-9
							return charCode;
						}
						else if (charCode >= 97 && charCode <= 122) {
							// a-z -> A-Z
							return character.toUpperCase().charCodeAt(0);
						}
						else if (specialKeyCodeTable[charCode] !== undefined) {
							return specialKeyCodeTable[charCode];
						}
						else {
							return charCode;
						}
					}
			});
		
			// add the functions publicly so they can be overridden
			$.simulate.prototype.simulateKeySequence.defaults = {
				
				/**
				 * Simulates key strokes of "normal" characters (i.e. non-special sequences).
				 * @param {Object} rng - bililiteRange object of the simulation target element.
				 * @param {String} s - String of (simple) characters to be simulated. 
				 * @param {Object} opts - The key-sequence options.
				 * @author Daniel Wachsstock, julrich
				 * @since 1.0
				 */
				simplechar: function (rng, s, opts){
					rng.text(s, 'end');
					rng.select();
					if (opts.triggerKeyEvents) {
						for (var i =0; i < s.length; i += 1){
							var charCode = s.charCodeAt(i);
							var keyCode = $.simulate.prototype.simulateKeySequence.prototype.charToKeyCode(s.charAt(i));
							// a bit of cheating: rng._el is the element associated with rng.
							$(rng._el).simulate('keydown', $.extend({}, opts.eventProps, {keyCode: keyCode}));
							$(rng._el).simulate('keypress', $.extend({}, opts.eventProps,{keyCode: charCode, which: charCode, charCode: charCode}));
							$(rng._el).simulate('keyup', $.extend({}, opts.eventProps, {keyCode: keyCode}));
						}
					}
				},
				
				/**
				 * Simulates key strokes of a curly opening bracket. 
				 * @param {Object} rng - bililiteRange object of the simulation target element.
				 * @param {String} s - Ignored. 
				 * @param {Object} opts - The key-sequence options.
				 * @author Daniel Wachsstock, julrich
				 * @since 1.0
				 */
				'{{}': function (rng, s, opts){
					$.simulate.prototype.simulateKeySequence.defaults.simplechar(rng, '{', opts);
				},
				
				/**
				 * Simulates hitting the enter button.
				 * @param {Object} rng - bililiteRange object of the simulation target element.
				 * @param {String} s - Ignored. 
				 * @param {Object} opts - The key-sequence options.
				 * @author Daniel Wachsstock, julrich
				 * @since 1.0
				 */
				'{enter}': function (rng, s, opts){
					rng.insertEOL();
					rng.select();
					if (opts.triggerKeyEvents === true) {
						$(rng._el).simulate('keydown', $.extend({}, opts.eventProps, {keyCode: 13}));
						$(rng._el).simulate('keypress', $.extend({}, opts.eventProps, {keyCode: 13, which: 13, charCode: 13}));
						$(rng._el).simulate('keyup', $.extend({}, opts.eventProps, {keyCode: 13}));
					}
				},
				
				/**
				 * Simulates hitting the backspace button.
				 * @param {Object} rng - bililiteRange object of the simulation target element.
				 * @param {String} s - Ignored. 
				 * @param {Object} opts - The key-sequence options.
				 * @author Daniel Wachsstock, julrich
				 * @since 1.0
				 */
				'{backspace}': function (rng, s, opts){
					var b = rng.bounds();
					if (b[0] === b[1]) { rng.bounds([b[0]-1, b[0]]); } // no characters selected; it's just an insertion point. Remove the previous character
					rng.text('', 'end'); // delete the characters and update the selection
					if (opts.triggerKeyEvents === true) {
						$(rng._el).simulate('keydown', $.extend({}, opts.eventProps, {keyCode: 8}));
						$(rng._el).simulate('keyup', $.extend({}, opts.eventProps, {keyCode: 8}));
					}
				},
				
				/**
				 * Simulates hitting the delete button.
				 * @param {Object} rng - bililiteRange object of the simulation target element.
				 * @param {String} s - Ignored. 
				 * @param {Object} opts - The key-sequence options.
				 * @author Daniel Wachsstock, julrich
				 * @since 1.0
				 */
				'{del}': function (rng, s, opts){
					var b = rng.bounds();
					if (b[0] === b[1]) { rng.bounds([b[0], b[0]+1]); } // no characters selected; it's just an insertion point. Remove the next character
					rng.text('', 'end'); // delete the characters and update the selection
					if (opts.triggerKeyEvents === true) {
						$(rng._el).simulate('keydown', $.extend({}, opts.eventProps, {keyCode: 46}));
						$(rng._el).simulate('keyup', $.extend({}, opts.eventProps, {keyCode: 46}));
					}
				},
				
				/**
				 * Simulates hitting the right arrow button.
				 * @param {Object} rng - bililiteRange object of the simulation target element.
				 * @param {String} s - Ignored. 
				 * @param {Object} opts - The key-sequence options.
				 * @author Daniel Wachsstock, julrich
				 * @since 1.0
				 */
				'{rightarrow}':  function (rng, s, opts){
					var b = rng.bounds();
					if (b[0] === b[1]) { b[1] += 1; } // no characters selected; it's just an insertion point. Move to the right
					rng.bounds([b[1], b[1]]).select();
					if (opts.triggerKeyEvents === true) {
						$(rng._el).simulate('keydown', $.extend({}, opts.eventProps, {keyCode: 39}));
						$(rng._el).simulate('keyup', $.extend({}, opts.eventProps, {keyCode: 39}));
					}
				},
				
				/**
				 * Simulates hitting the left arrow button.
				 * @param {Object} rng - bililiteRange object of the simulation target element.
				 * @param {String} s - Ignored. 
				 * @param {Object} opts - The key-sequence options.
				 * @author Daniel Wachsstock, julrich
				 * @since 1.0
				 */
				'{leftarrow}': function (rng, s, opts){
					var b = rng.bounds();
					if (b[0] === b[1]) { b[0] -= 1; } // no characters selected; it's just an insertion point. Move to the left
					rng.bounds([b[0], b[0]]).select();
					if (opts.triggerKeyEvents === true) {
						$(rng._el).simulate('keydown', $.extend({}, opts.eventProps, {keyCode: 37}));
						$(rng._el).simulate('keyup', $.extend({}, opts.eventProps, {keyCode: 37}));
					}
				},
				
				/**
				 * Selects all characters in the target element.
				 * @param {Object} rng - bililiteRange object of the simulation target element.
				 * @author Daniel Wachsstock, julrich
				 * @since 1.0
				 */
				'{selectall}' : function (rng){
					rng.bounds('all').select();
				}
			};
			
			
				
			
			//####### Quirk detection #######
			if ($.simulate.ext_disableQuirkDetection !== true) { // Fixes issue #9 (https://github.com/j-ulrich/jquery-simulate-ext/issues/9)
				$(document).ready(function() {
					// delayedSpacesInNonInputGlitchToEnd
					// See issues #6 (https://github.com/j-ulrich/jquery-simulate-ext/issues/6)
					/* Append a div to the document (bililiteRange needs the element to be in the document), simulate
					 * a delayed sequence containing a space in the middle and check if the space moves to the end.
					 */
					var $testDiv = $('<div/>').css({height: 1, width: 1, position: 'absolute', left: -1000, top: -1000}).appendTo('body');
					$testDiv.simulate('key-sequence', {sequence: '\xA0 \xA0', delay:1, callback: function() {
						$.simulate.prototype.quirks.delayedSpacesInNonInputGlitchToEnd = ($testDiv.text() === '\xA0\xA0 ');
						$testDiv.remove();
					}});
				});
			}
		
		})(jQuery);
		// end:source /bower_components/jquery-simulate-ext/src/jquery.simulate.key-sequence.js

	}(jQuery));
}
// end:source /src/jquery_simulate.js