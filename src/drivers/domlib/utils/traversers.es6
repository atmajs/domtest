var traverser_findNative;
(function(){
	traverser_findNative = function ($el, selector) {
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
	};
	
}());