(function(){

	// import ./traverser.es6
	// import ./assertion.es6

	var Driver = Drivers['jmask'] = class_create(IDriver, {
		Traversers: new JMaskTraversers,
		Assertions: new JMaskAssertions,

		createRoot (node) {
			return mask.jmask(node);
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