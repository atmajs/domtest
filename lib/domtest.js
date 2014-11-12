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
		
		global.TestDom = fn;
	}
	
	construct();
	
}(this, function(global, mask, $, __assert){
	'use strict';
	
	// source /src/exports.es6
	function assert_TestDom(container, utest, callback) {
	  if (typeof utest === 'string') {
	    utest = mask.parse(utest);
	    if (utest.type !== mask.Dom.FRAGMENT)
	      utest = {nodes: [utest]};
	  }
	  var runner = new Runner(container, utest);
	  runner.process();
	  runner.always(callback);
	  return runner;
	}
	assert_TestDom.create = assert_TestDom;
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
	    args.unshift(mask.Utils.Expression.eval);
	    return run.apply(null, args);
	  };
	  function run(fn, node, model, compo) {
	    if (node.expression == null) {
	      log_error('Expression expected for', node.tagName);
	      return null;
	    }
	    return fn(node.expression, model, null, compo);
	  }
	}());
	var assert_isAlias,
	    assert_runAlias,
	    assert_isJQuery,
	    assert_runJQuery,
	    assert_getFn;
	(function() {
	  assert_isAlias = function(name) {
	    return $.fn[name] != null;
	  };
	  assert_runAlias = function($el, name, args, attr) {
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
	}());
	var Traverser = {};
	(function() {
	  [['find', 'filter'], ['filter'], ['closest'], ['children'], ['siblings']].forEach((function(x) {
	    var $__0 = x,
	        name = $__0[0],
	        fallback = $__0[1];
	    Traverser[name] = create(name, fallback);
	  }));
	  function create(name, fallback) {
	    return function assert_Traverse(current) {
	      var selector = current.node.expression;
	      var x = current.$[name](selector);
	      if (fallback && x.length === 0) {
	        x = current.$[fallback](selector);
	      }
	      assert.notEqual(x.length, 0, ("Selector does not matched any elements: " + name + "(" + selector + ")"));
	      current.$ = x;
	    };
	  }
	}());
	var Simulate = {
	  'press': function(runner, current, done) {
	    var str = node_eval(current.node);
	    current.$.simulate('key-combo', {combo: str});
	    setTimeout(done);
	  },
	  'type': function(runner, current, done) {
	    var str = node_eval(current.node);
	    current.$.simulate('key-sequence', {sequence: str});
	    setTimeout(done);
	  }
	};
	var Actions = {
	  'with': function(compo, current, done) {
	    Traverser.find(current);
	    done();
	  },
	  'debugger': function(compo, current, done) {
	    var $element = current.$;
	    debugger;
	    done();
	  },
	  'slot': function(compo, current, done) {
	    var fn = current.node.fn;
	    if (fn.length === 2) {
	      fn(current.$, done);
	      return;
	    }
	    fn(current.$);
	    done();
	  },
	  'do': function(compo, current, done) {
	    var event;
	    for (event in current.node.attr)
	      break;
	    var fn = Simulate[event];
	    if (fn) {
	      fn(compo, current, done);
	      return;
	    }
	    current.$.simulate(event, current.node.attr);
	    setTimeout(done);
	  },
	  'call': function(runner, current, done) {
	    var name;
	    for (name in current.node.attr)
	      break;
	    assert.is(current.$[name], 'Function');
	    var args = node_evalMany(current.node, runner.model, runner.compo);
	    current.$.apply(current.$, args);
	  },
	  'await': function(compo, current, done) {
	    var expression = current.node.expression;
	    var num = parseFloat(expression);
	    if (num === num) {
	      setTimeout(done, num);
	      return;
	    }
	    var selector = expression;
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
	  }
	};
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
	var Reporter;
	(function() {
	  Reporter = {report: function(error, runner) {
	      var fn = options.report;
	      if (fn) {
	        fn(error);
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
	}());
	function Runner(container, node, model, compo) {
	  if (container.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
	    container = container.childNodes;
	  this.model = model;
	  this.compo = compo;
	  this.stack = [{
	    $: $(container),
	    node: node
	  }];
	  this.process = this.process.bind(this);
	  this.backtrace = new Error().stack;
	}
	Runner.prototype = {
	  getCurrent: function() {
	    return this.stack[this.stack.length - 1];
	  },
	  getNext: function(goDeep) {
	    var current = this.getCurrent();
	    if (current == null)
	      return null;
	    if (goDeep !== false && current.node.nodes) {
	      this.stack.push({
	        $: current.$,
	        node: current.node.nodes[0]
	      });
	      return this.getCurrent();
	    }
	    this.stack.pop();
	    while (this.stack.length > 0) {
	      var parent = this.getCurrent(),
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
	      return this.getCurrent();
	    }
	    return null;
	  },
	  process: function assert_TestDom(error) {
	    var current = this.getNext(error == null);
	    if (current == null) {
	      this.resolve();
	      return;
	    }
	    var name = current.node.tagName;
	    var traverser = Traverser[name];
	    if (traverser) {
	      var error = this.run(traverser, [current]);
	      this.process(error);
	      return;
	    }
	    var action = Actions[name];
	    if (action) {
	      this.run(action, [this, current, this.process]);
	      return;
	    }
	    var args = node_evalMany(current.node, this.model, this.compo);
	    var $el = current.$;
	    var fn = assert_getFn(name);
	    if (fn) {
	      this.run(fn, [$el, name, args, current.node.attr]);
	      this.process();
	      return;
	    }
	    log_error('Uknown test function: ', name);
	    this.process();
	  },
	  run: function(fn, args, ctx) {
	    var error;
	    try {
	      fn.apply(ctx, args);
	    } catch (err) {
	      error = err;
	    }
	    this.report(error);
	    var next = args[args.length - 1];
	    if (error != null && typeof next === 'function') {
	      next(error);
	    }
	  },
	  report: function(error) {
	    error = this.prepairError_(error);
	    Reporter.report(error);
	  },
	  prepairError_: function(error) {
	    if (error == null)
	      return null;
	    var node = this.getCurrent().node,
	        tmpl = mask.stringify(node, 2),
	        lines = tmpl.split('\n');
	    if (lines.length > 7) {
	      tmpl = lines.splice(0, 6).join('\n');
	    }
	    var msg = error.generatedMessage ? tmpl : error.message + '\n' + tmpl;
	    Object.defineProperty(error, 'message', {
	      value: msg,
	      writable: true,
	      enumerable: true,
	      configurable: true
	    });
	    Object.defineProperty(error, 'stack', {
	      value: assert.prepairStack(this.backtrace),
	      writable: true,
	      enumerable: true,
	      configurable: true
	    });
	    error.generatedMessage = false;
	    return error;
	  },
	  resolved: null,
	  rejected: null,
	  _resolveCb: null,
	  _rejectCb: null,
	  _alwaysCb: null,
	  resolve: function() {
	    for (var args = [],
	        $__0 = 0; $__0 < arguments.length; $__0++)
	      args[$__0] = arguments[$__0];
	    this.resolved = args;
	    dfr_call(this._resolveCb, args);
	    dfr_call(this._alwaysCb);
	    dfr_clear(this);
	  },
	  reject: function() {
	    for (var args = [],
	        $__1 = 0; $__1 < arguments.length; $__1++)
	      args[$__1] = arguments[$__1];
	    this.rejected = args;
	    dfr_call(this._rejectCb, args);
	    dfr_call(this._alwaysCb);
	    dfr_clear(this);
	  },
	  done: function(cb) {
	    if (cb == null)
	      return this;
	    if (this.resolved) {
	      cb.apply(null, this.resolved);
	      return this;
	    }
	    if (this.rejected == null) {
	      dfr_bind(this, 'resolve', cb);
	    }
	    return this;
	  },
	  fail: function(cb) {
	    if (cb == null)
	      return this;
	    if (this.rejected) {
	      cb.apply(null, this.rejected);
	      return this;
	    }
	    if (this.resolved == null) {
	      dfr_bind(this, 'reject', cb);
	    }
	    return this;
	  },
	  always: function(cb) {
	    if (cb == null)
	      return this;
	    if (this.rejected || this.resolved) {
	      cb();
	      return this;
	    }
	    dfr_bind(this, 'always', cb);
	    return this;
	  },
	  then: function(ok, fail) {
	    return this.done(ok).fail(fail);
	  }
	};
	
	//# sourceMappingURL=exports.es6.map
	// end:source /src/exports.es6
	
	(function(){
		if ($.simulate && $.simulate.prototype.simulateKeyCombo) {
			return;
		}
		// source /bower_components/jquery-simulate-ext/libs/bililiteRange.js
		// Cross-broswer implementation of text ranges and selections
		// documentation: http://bililite.com/blog/2011/01/17/cross-browser-text-ranges-and-selections/
		// Version: 1.1
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
		
		bililiteRange = function(el, debug){
			var ret;
			if (debug){
				ret = new NothingRange(); // Easier to force it to use the no-selection type than to try to find an old browser
			}else if (document.selection){
				// Internet Explorer
				ret = new IERange();
			}else if (window.getSelection && el.setSelectionRange){
				// Standards. Element is an input or textarea 
				ret = new InputRange();
			}else if (window.getSelection){
				// Standards, with any other kind of element
				ret = new W3CRange();
			}else{
				// doesn't support selection
				ret = new NothingRange();
			}
			ret._el = el;
			ret._textProp = textProp(el);
			ret._bounds = [0, ret.length()];
			return ret;
		};
		
		function textProp(el){
			// returns the property that contains the text of the element
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
				if (s === 'all'){
					this._bounds = [0, this.length()];
				}else if (s === 'start'){
					this._bounds = [0, 0];
				}else if (s === 'end'){
					this._bounds = [this.length(), this.length()];
				}else if (s === 'selection'){
					this.bounds ('all'); // first select the whole thing for constraining
					this._bounds = this._nativeSelection();
				}else if (s){
					this._bounds = s; // don't error check now; the element may change at any moment, so constrain it when we need it.
				}else{
					var b = [
						Math.max(0, Math.min (this.length(), this._bounds[0])),
						Math.max(0, Math.min (this.length(), this._bounds[1]))
					];
					return b; // need to constrain it to fit
				}
				return this; // allow for chaining
			},
			select: function(){
				this._nativeSelect(this._nativeRange(this.bounds()));
				return this; // allow for chaining
			},
			text: function(text, select){
				if (arguments.length){
					this._nativeSetText(text, this._nativeRange(this.bounds()));
					if (select == 'start'){
						this.bounds ([this._bounds[0], this._bounds[0]]);
						this.select();
					}else if (select == 'end'){
						this.bounds ([this._bounds[0]+text.length, this._bounds[0]+text.length]);
						this.select();
					}else if (select == 'all'){
						this.bounds ([this._bounds[0], this._bounds[0]+text.length]);
						this.select();
					}
					return this; // allow for chaining
				}else{
					return this._nativeGetText(this._nativeRange(this.bounds()));
				}
			},
			insertEOL: function (){
				this._nativeEOL();
				this._bounds = [this._bounds[0]+1, this._bounds[0]+1]; // move past the EOL marker
				return this;
			}
		};
		
		
		function IERange(){}
		IERange.prototype = new Range();
		IERange.prototype._nativeRange = function (bounds){
			var rng;
			if (this._el.tagName == 'INPUT'){
				// IE 8 is very inconsistent; textareas have createTextRange but it doesn't work
				rng = this._el.createTextRange();
			}else{
				rng = document.body.createTextRange ();
				rng.moveToElementText(this._el);
			}
			if (bounds){
				if (bounds[1] < 0) bounds[1] = 0; // IE tends to run elements out of bounds
				if (bounds[0] > this.length()) bounds[0] = this.length();
				if (bounds[1] < rng.text.replace(/\r/g, '').length){ // correct for IE's CrLf wierdness
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
			if (document.selection.type != 'Text') return [len, len]; // append to the end
			var sel = document.selection.createRange();
			try{
				return [
					iestart(sel, rng),
					ieend (sel, rng)
				];
			}catch (e){
				// IE gets upset sometimes about comparing text to input elements, but the selections cannot overlap, so make a best guess
				return (sel.parentElement().sourceIndex < this._el.sourceIndex) ? [0,0] : [len, len];
			}
		};
		IERange.prototype._nativeGetText = function (rng){
			return rng.text.replace(/\r/g, ''); // correct for IE's CrLf weirdness
		};
		IERange.prototype._nativeSetText = function (text, rng){
			rng.text = text;
		};
		IERange.prototype._nativeEOL = function(){
			if (typeof this._el.value != 'undefined'){
				this.text('\n'); // for input and textarea, insert it straight
			}else{
				this._nativeRange(this.bounds()).pasteHTML('<br/>');
			}
		};
		// IE internals
		function iestart(rng, constraint){
			// returns the position (in character) of the start of rng within constraint. If it's not in constraint, returns 0 if it's before, length if it's after
			var len = constraint.text.replace(/\r/g, '').length; // correct for IE's CrLf wierdness
			if (rng.compareEndPoints ('StartToStart', constraint) <= 0) return 0; // at or before the beginning
			if (rng.compareEndPoints ('StartToEnd', constraint) >= 0) return len;
			for (var i = 0; rng.compareEndPoints ('StartToStart', constraint) > 0; ++i, rng.moveStart('character', -1));
			return i;
		}
		function ieend (rng, constraint){
			// returns the position (in character) of the end of rng within constraint. If it's not in constraint, returns 0 if it's before, length if it's after
			var len = constraint.text.replace(/\r/g, '').length; // correct for IE's CrLf wierdness
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
		
		function W3CRange(){}
		W3CRange.prototype = new Range();
		W3CRange.prototype._nativeRange = function (bounds){
			var rng = document.createRange();
			rng.selectNodeContents(this._el);
			if (bounds){
				w3cmoveBoundary (rng, bounds[0], true, this._el);
				rng.collapse (true);
				w3cmoveBoundary (rng, bounds[1]-bounds[0], false, this._el);
			}
			return rng;					
		};
		W3CRange.prototype._nativeSelect = function (rng){
			window.getSelection().removeAllRanges();
			window.getSelection().addRange (rng);
		};
		W3CRange.prototype._nativeSelection = function (){
				// returns [start, end] for the selection constrained to be in element
				var rng = this._nativeRange(); // range of the element to constrain to
				if (window.getSelection().rangeCount == 0) return [this.length(), this.length()]; // append to the end
				var sel = window.getSelection().getRangeAt(0);
				return [
					w3cstart(sel, rng),
					w3cend (sel, rng)
				];
			};
		W3CRange.prototype._nativeGetText = function (rng){
			return rng.toString();
		};
		W3CRange.prototype._nativeSetText = function (text, rng){
			rng.deleteContents();
			rng.insertNode (document.createTextNode(text));
			this._el.normalize(); // merge the text with the surrounding text
		};
		W3CRange.prototype._nativeEOL = function(){
			var rng = this._nativeRange(this.bounds());
			rng.deleteContents();
			var br = document.createElement('br');
			br.setAttribute ('_moz_dirty', ''); // for Firefox
			rng.insertNode (br);
			rng.insertNode (document.createTextNode('\n'));
			rng.collapse (false);
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
					if (n <= node.nodeValue.length){
						rng[bStart ? 'setStart' : 'setEnd'](node, n);
						// special case: if we end next to a <br>, include that node.
						if (n == node.nodeValue.length){
							// skip past zero-length text nodes
							for (var next = nextnode (node, el); next && next.nodeType==3 && next.nodeValue.length == 0; next = nextnode(next, el)){
								rng[bStart ? 'setStartAfter' : 'setEndAfter'](next);
							}
							if (next && next.nodeType == 1 && next.nodeName == "BR") rng[bStart ? 'setStartAfter' : 'setEndAfter'](next);
						}
						return;
					}else{
						rng[bStart ? 'setStartAfter' : 'setEndAfter'](node); // skip past this one
						n -= node.nodeValue.length; // and eat these characters
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
			return constraint.toString().length - rng.toString().length;
		}
		function w3cend (rng, constraint){
			if (rng.compareBoundaryPoints (END_TO_END, constraint) >= 0) return constraint.toString().length; // at or after the end
			if (rng.compareBoundaryPoints (START_TO_END, constraint) <= 0) return 0;
			rng = rng.cloneRange(); // don't change the original
			rng.setStart (constraint.startContainer, constraint.startOffset); // they now start at the same place
			return rng.toString().length;
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
		
		})();
		// end:source /bower_components/jquery-simulate-ext/libs/bililiteRange.js
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
		
	}());
	
	return TestDom;
}));