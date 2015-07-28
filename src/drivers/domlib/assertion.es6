var DomLibAssertions = class_create(IDriverAssertionCollection, {
	assert (runner, driver, $el, name, args, next) {
		var fn = assert_getFn(name);
		if (fn) {
			var err = runner.call(fn, $el, name, args);
			next(err);
			return;
		}
		next(`Uknown test function ${name}`);
	}
});