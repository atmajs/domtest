(function(){

	// import ./traverser.es6
	// import ./assertion.es6

	var Driver = Drivers['cheerio'] = class_create(IDriver, {
		Traversers: new CheerioTraversers,
		Assertions: new CheerioAssertions,

		cheerio: null,
		createRoot (mix) {
			return class_Dfr.run((resolve, reject) => {
				if (mix == null) {
					reject('Root context is undefined');
					return;
				}
				if (typeof mix !== 'string') {
					resolve(mix);
					return;
				}
				var str = mix.trim();
				if (str === '') {
					reject('Root context is empty');
					return;
				}
				var $ = this.cheerio = require('cheerio');
				if (/^\w+:\/\//.test(str)) {
					this
						.loadUrl(str)
						.done(resolve)
						.fail(reject);
					return;
				}
				var $root = $(str);
				if ($root.length === 0) {
					reject('Set is empty. No html to test');
					return;
				}
				return resolve($root);
			});
		},

		loadUrl (url) {
			var request = require('request');
			var dfr = new class_Dfr;
			request(url, (error, response, body) => {
				if (error) {
					dfr.reject(error);
					return;
				}
				dfr.resolve(this.cheerio(body));
			});
			return dfr;
		},

		isOwnCtx (ctx) {
			if (ctx == null) {
				return false;
			}
			return ctx.constructor === this.cheerio;
		}
	});

	// import ./assertions/exports.es6
	// import ./traversers/exports.es6

}());