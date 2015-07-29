(function(){

	// import ./traverser.es6
	// import ./assertion.es6

	var Driver = Drivers['jmask'] = class_create(IDriver, {
		Traversers: new JMaskTraversers,
		Assertions: new JMaskAssertions,

		createRoot (node) {
			var $root = mask.jmask(node);
			var dfr = new class_Dfr;
			if ($root.length === 0) {
				return dfr.reject('Set is empty. No elements to test');
			}
			return dfr.resolve($root);
		},

		isOwnCtx (ctx) {
			if (ctx == null) {
				return false;
			}
			return ctx.constructor === mask.jmask;
		}
	});

	// import ./assertions/exports.es6
	// import ./traversers/exports.es6

}());