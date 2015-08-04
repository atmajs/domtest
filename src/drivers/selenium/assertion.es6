var SeleniumAssertions = class_create(IDriverAssertionCollection, {
	assert (runner, driver, $el, name, args = [], next) {


		runner
			.checkAsync($el, name, ...args)
			.done(() =>  next())
			.fail(err => next(err));
	}
});