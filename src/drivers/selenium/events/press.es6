(function(){
	Driver.prototype.Events.define('press', ($, str) => {
		return $.press(str);
	});
}());