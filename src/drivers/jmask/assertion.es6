var JMaskAssertions = class_create(IDriverAssertionCollection, {
	assert (runner, driver, $el, name, args = [], next) {

		var err = runner.check($el, name, ...args);
		next(err);
	}
});