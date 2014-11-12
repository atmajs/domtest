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
