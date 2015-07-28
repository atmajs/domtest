(function(){
	Driver.prototype.Events.define('type', ($, str) => {
		var dfr = new class_Dfr;
		$.simulate('key-sequence', {
			sequence: str,
			delay: 10,
			callback: function(){
				$
					.removeData('simulate-keySequence.selection')
					.off('keyup.simulate-keySequence')
					.off('mouseup.simulate-keySequence')
					;
				dfr.resolve();
			}
		});
		return dfr;
	});
}());