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

		return DomTest
			.use('cheerio')
			.process(mix, test, model)
			.then(function() {
				return new mask.class.Deferred().resolve(count);
			});
	}
};