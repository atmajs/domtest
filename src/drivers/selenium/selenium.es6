(function(){
	var _webdriver,
		_browser,
		SQuery;

	// import ./traverser.es6
	// import ./event.es6
	// import ./action.es6
	// import ./assertion.es6

	var Driver = Drivers['selenium'] = class_create(IDriver, {
		Traversers: new SeleniumTraversers,
		Events: new SeleniumEvents,
		Actions: new SeleniumActions,
		Assertions: new SeleniumAssertions,

		createRoot (str) {
			return class_Dfr.run((resolve, reject) => {
				if (str == null || /^(\w+:\/\/)|^(\/\w+)/.test(str) === false) {
					reject('URL is expected by selenium driver');
					return;
				}
				if (SQuery == null) {
					SQuery = require('selenium-query');
				}
				SQuery
					.load(str, this.options)
					.then($ => resolve($), err => reject(err));
			});
		},

		isOwnCtx (ctx) {
			if (ctx == null) {
				return false;
			}
			return typeof ctx.length === 'number';
		}
	});

	// import ./events/exports.es6
	// import ./actions/exports.es6
	// import ./assertions/exports.es6
	// import ./traversers/exports.es6

}());