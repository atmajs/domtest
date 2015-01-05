var Traverser = {};
(function(){
	[
		['find', 'filter'],
		['filter'],
		['closest'],
		['children'],
		['siblings']
	].forEach( x => {
		var [name, fallback] = x;
		Traverser[name] = create(name, fallback);
	});
	
	function create(name, fallback) {
		return function assert_Traverse(current) {
			var selector = current.node.expression;
			
			if (/^\s*('|")/.test(selector)) {
				selector = node_eval(current.node);
			}
			
			var x = current.$[name](selector);
			if (fallback && x.length === 0) {
				x = current.$[fallback](selector);
			}
			assert.notEqual(
				x.length
				, 0
				, `Selector does not matched any elements: ${name}(${selector})`
			);
			current.$ = x;
		};
	}
}());