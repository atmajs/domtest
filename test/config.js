module.exports = {
	suites: {
		examples : {
			exec: 'dom',
			
			env: [
				'/lib/domtest.embed.js::TestDom'
			],
			
			tests: 'test/**.test'
		}
	}
};