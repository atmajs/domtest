module.exports = {
	suites: {
		domlib : {
			exec: 'dom',

			env: [
				'/lib/domtest.embed.js::TestDom',
				'/test/domlib/utils.js'
			],

			tests: 'test/domlib/**.test'
		}
	}
};