module.exports = {
	suites: {
		domlib : {
			exec: 'dom',

			env: [
				'/lib/domtest.embed.js::TestDom',
				'/test/domlib/utils.js'
			],

			tests: 'test/domlib/**.test'
		},
		jmask : {
			exec: 'node',
			env: [
				'/lib/domtest.js::DomTest',
				'/test/jmask/utils.js::Utils'
			],

			tests: 'test/jmask/**.test'
		},
		cheerio : {
			exec: 'node',
			env: [
				'/lib/domtest.js::DomTest',
				'/test/cheerio/utils.js::Utils'
			],
			tests: 'test/cheerio/**.test'
		},
		selenium : {
			exec: 'node',
			env: [
				'/lib/domtest.js::DomTest',
				'/test/selenium/utils.js::Utils'
			],
			tests: 'test/selenium/**.test'
		}
	}
};