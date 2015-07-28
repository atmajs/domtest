(function(){
	Driver.prototype.Events.define('press', ($, str) => {
		$.simulate('key-combo', {
			combo: str
		});
	});
}());