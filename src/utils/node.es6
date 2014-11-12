var node_evalMany,
	node_eval;

(function(){
	node_evalMany = function(...args) {
		args.unshift(mask.Utils.Expression.evalStatements);
		return run.apply(null, args);
	};
	
	node_eval = function(...args){
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