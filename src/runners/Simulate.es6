var Simulate = {
	'press' (runner, current, done) {
		var str = node_eval(current.node);
		
		current.$.simulate('key-combo', {
			combo: str
		});
		setTimeout(done);
	},
	'type' (runner, current, done) {
		var str = node_eval(current.node);
		
		current.$.simulate('key-sequence', {
			sequence: str
		});
		setTimeout(done);
	}
};