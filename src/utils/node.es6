var node_evalMany,
	node_eval,
	node_resolveFirstAttrKey,
	node_getAttrArgs;

(function(){
	node_evalMany = function(...args) {
		args.unshift(mask.Utils.Expression.evalStatements);
		return run.apply(null, args);
	};

	node_eval = function(...args){
		args.unshift(mask.Utils.Expression.evalStatements);
		return run.apply(null, args)[0];
	};
	node_resolveFirstAttrKey = function(node) {
		var x = null;
		for(x in node.attr) break;
		if (x == null) {
			return null;
		}

		delete node.attr[x];
		return x;
	};
	node_getAttrArgs = function(node){
		var args = [],
			attr = node.attr,
			obj = {},
			hasObject = false;
		for(var key in attr) {
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
			if (typeof args[0] === 'number') {
				var [num] = args.splice(0, 1);
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
		if (expr == null || expr === '') {
			return [];
		}
		return fn(expr, model, null, compo);
	}
}());