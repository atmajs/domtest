var DefaultConfig;
(function(){

	DefaultConfig = {
		name: 'Chrome',
		args: ['no-sandbox'],
		binaryPath: null,

		applyOptions (builder, options) {
			var fn = `set${this.name}Options`;
			if (typeof builder[fn] !== 'function') {
				throw Error(`Default function not found, please override 'applyOptions(builder, options)' to set it yourself. Was looking for : ${fn}`);
			}
			builder[fn](options);
		},

		setOptions (builder, options) {

		},

		setArguments (options) {
			options.addArguments(this.args);
		},
		setBinaryPath (options) {
			var fn = `set${this.name}BinaryPath`;
			if (typeof options[fn] !== 'function') {
				throw Error(`Default function not found, please override 'setBinaryPath' to set it yourself. Was looking for: ${fn}`);
			}

			if (this.binaryPath) {
				options[fn](this.binaryPath);
			}
		},
		setLogging (options) {
			options.setLoggingPrefs({
				performance: 'ALL'
			});
			options.setPerfLoggingPrefs({
				'traceCategories': 'blink.console,disabled-by-default-devtools.timeline'
			});
		}
	};

	if (typeof process.env.BROWSER_PATH !== 'undefined') {
		DefaultConfig.browserPath = process.env.BROWSER_PATH;
	}

}());
