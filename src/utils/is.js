var is_JQuery;
(function(){
	
	is_JQuery = function (x) {
		if (typeof x.jquery === 'string') 
			return true;
		
		return x.constructor === $.fn.constructor;
	};
}());
