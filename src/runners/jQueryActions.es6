// Additional jQuery sugar actions

obj_extend(Actions, {
	hasClass (compo, current, done) {
		var args = node_evalMany(current.node);
		var fn = assert_getFn('hasClass');
		
		if (args.length === 1) {
			args.push(true);
		}
		
		fn(current.$, 'hasClass', args, current.node.attr);
		done();
	}
});