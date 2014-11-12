var dfr_call,
	dfr_bind,
	dfr_clear;
(function(){
	
	dfr_call = function(cbs, args) {
		if (cbs == null) 
			return;
		
		for(var i = 0; i < cbs.length; i++) {
			cbs[i].apply(null, args || []);
		}
	};
	
	dfr_bind = function(dfr, type, cb){
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
		if (arr != null) arr.length = 0;
	}
}());