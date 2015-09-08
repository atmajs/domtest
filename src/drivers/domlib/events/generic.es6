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
			if ($.simulate) {
				var rkeyEvent = /^key/,
					rmouseEvent = /^(?:mouse|contextmenu)|click/;

				if (rkeyEvent.test(event) || rmouseEvent.test(event)) {
					$.simulate(event, ...args);
					return;
				}
			}
			$.trigger(event, ...args);
		};
	}
}());