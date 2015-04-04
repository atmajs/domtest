var Traverser = {};
(function(){
	[
		['find', 'filter', findNative],
		['filter'],
		['closest'],
		['children'],
		['siblings']
	].forEach( x => {
		var [name, fallback, customFn] = x;
		Traverser[name] = create(name, fallback, customFn);
	});
	
	obj_extend(Traverser, {
		'__eq__': create('eq')
	});
	
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
			assert.notEqual(
				x.length
				, 0
				, `Selector does not matched any elements: ${name}(${selector})`
			);
			current.$ = x;
		};
	}
	
	function findNative($el, selector){
		var set = $(),
			imax = $el.length,
			i = -1, arr, x;
		while( ++i < imax ){
			x = $el[i];
			if (x.querySelectorAll == null) continue;
			arr = x.querySelectorAll(selector);
			set = set.add(arr);
		}
		return set;
	}
}());