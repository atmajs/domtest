DomTest.config({
	report () {

	}
});

var Utils = {
	countSuccess (mix, test, model) {
		var count = 0;
		DomTest.config({
			report (error) {
				assert.ifError(error);
				++count
			}
		});

		var dom = typeof mix === 'string' ? mask.render(mix) : mix;
		return DomTest(dom, test, model)
			.then(function() {
				return new mask.class.Deferred().resolve(count);
			});
	}
};