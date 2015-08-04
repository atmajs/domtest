(function(){
	Driver.prototype.Events.define('select', ($, ...args) => {
		return $.select(...args);
	});

}());