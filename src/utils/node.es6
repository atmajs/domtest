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
			var attr = node.attr,
				arr  = [];
			
			for(var key in attr) {
				if (key === attr[key]) {
					arr.push(key);
				}
			}
			if (arr.length !== 0) 
				return arr;
			
			
			var obj = {}, count = 0;
			for(var key in attr) {
				obj[key] = attr[key];
				count++;
			}
			if (count > 0) 
				return [ obj ];
			
			
			log_error('Expression expected for', node.tagName);
			return null;
		}
		return fn(node.expression, model, null, compo);
	}
}());