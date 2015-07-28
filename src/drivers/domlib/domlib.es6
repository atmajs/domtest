(function(){

	// import ./utils/assert.es6
	// import ./utils/traversers.es6
	// import ./utils/runner.es6

	// import ./traverser.es6
	// import ./event.es6
	// import ./action.es6
	// import ./assertion.es6

	var Driver = Drivers['domlib'] = Drivers.Default = class_create(IDriver, {
		Traversers: new DomLibTraversers,
		Events: new DomLibEvents,
		Actions: new DomLibActions,
		Assertions: new DomLibAssertions,

		domLib: null,

		createRoot (container) {
			var el = container;
			if (el.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
				el = el.childNodes;
			}
			if (el.nodeType === Node.DOCUMENT_NODE) {
				el = el.body;
			}
			this.domLib = this.getDomLibrary_(el)
			return this.domLib(el);
		},

		beforeEvent (runner) {
			runner_ensureInDOM(runner);
		},

		getDomLibrary_ (mix) {
			var el = mix != null && (typeof mix.length === 'number' ? mix[0] : mix);
			if (el == null) {
				return global.$;
			}

			var win = el.ownerDocument.defaultView;
			var $ = win.$
				|| win.jQuery
				|| window.$
				|| window.jQuery
				|| mask.Compo.config.getDOMLibrary();

			$.fn.simulate = global.$.fn.simulate;
			return $;
		},

		isOwnCtx (ctx) {
			if (ctx == null) {
				return false;
			}
			if (ctx.constructor.fn == null) {
				return false;
			}
			return ctx.constructor === this.domLib.fn.constructor;
		}
	});

	// import ./events/exports.es6
	// import ./actions/exports.es6
	// import ./assertions/exports.es6
	// import ./traversers/exports.es6

}());