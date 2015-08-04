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

		if (mix.indexOf('<') > -1) {
			var path = '/test/selenium/html/temp.html';
			var html = ['<!doctype html>', '<html>', '<body>', mix, '</body>', '</html>'].join('\n');
			io.File.write(path, html);
			mix = path;
		}

		return DomTest
			.use('selenium')
			.process(mix, test, model)
			.then(function() {
				return new mask.class.Deferred().resolve(count);
			});
	}
};