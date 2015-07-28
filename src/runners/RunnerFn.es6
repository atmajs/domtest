var RunnerFn = class_create(IRunner, {

	constructor: function Runner(container, fn, model, compo) {
		this.container = container;
		this.model = model;
		this.fn = fn;
	},

	process: function assert_TestDom () {
		try {
			if (this.fn.length === 0) {
				this.fn();
			}
			else {
				this.fn(error => {
					if (error) {
						this.report_(error);
						this.reject(error);
						return;
					}
					this.resolve();
				});
			}
		} catch (error) {
			this.report_(error);
			this.reject(error);
		}
		return this;
	}
});
