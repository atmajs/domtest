(function(){
	([
		"blur",
		"focus",
		"load",
		"resize",
		"scroll",
		"unload",
		"beforeunload",
		"click",
		"dblclick",
		"mousedown",
		"mouseup",
		"mousemove",
		"mouseover",
		"mouseout",
		"mouseenter",
		"mouseleave",
		"change",
		"submit",
		"keydown",
		"keypress",
		"keyup",
	])
	.forEach(event => {
		Driver.prototype.Events.define(event, triggerDelegate(event));
	});

	function triggerDelegate(event) {
		return function($, ...args){
			var fn = $.simulate || $.trigger;
			fn.call($, event, ...args);
		};
	}
}());