var simulate_ready;
(function(){
	simulate_ready = function (fn, count = 0) {
		if (count > 5) {
			return fn();
		}
		if ($.simulate.prototype.quirks.delayedSpacesInNonInputGlitchToEnd != null) {
			simulate_ready = function(fn){
				setTimeout(fn);
			};
			simulate_ready(fn);
			return;
		}
		
		setTimeout(() =>  simulate_ready(fn, ++count));
	};
}());