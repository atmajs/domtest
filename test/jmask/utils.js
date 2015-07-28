DomTest.config({
	report: function () {

	}
});

var Utils = {
	countSuccess: function (mix, test, model) {
		var count = 0;
		DomTest.config({
			report: function (error) {
				assert.ifError(error);
				++count;
			}
		});

		var dom = typeof mix === 'string' ? mask.parse(mix) : mix;
		return DomTest
			.use('jmask')
			.process(dom, test, model)
			.then(function() {
				return new mask.class.Deferred().resolve(count);
			});
	}
};