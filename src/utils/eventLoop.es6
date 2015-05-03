var eventLoop_skip5;
(function(){
	eventLoop_skip5 = nTickDelegate(5);
	
	function nTickDelegate(ticks) {
		return function(fn){
			var count = ticks;
			function tickFn(){
				if (--count < 0) {
					return fn();
				}
				setTimeout(tickFn);
			};
			tickFn();
		};
	}
}());