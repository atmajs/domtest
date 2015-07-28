DomTest.config({
	report: function () {

	}
});

window.Utils = {
	countSuccess: function (mix, test, model) {
		var count = 0;
		DomTest.config({
			report: function (error) {
				assert.ifError(error);
				++count;
			}
		});

		var dom = typeof mix === 'string' ? mask.render(mix) : mix;
		return DomTest(dom, test, model)
			.then(function() {
				return new mask.class.Deferred().resolve(count);
			});
	}
};