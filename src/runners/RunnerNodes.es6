var RunnerNodes = class_create(IRunner, {

	constructor: function Runner(driver, container, node, model, compo) {

		this.$ = driver.createRoot(container);
		this.stack = [{
			$: this.$,
			node: node
		}];

		if (this.$.length === 0) {
			this.report_(Error('No elements to test <root>'));
		}
	},

	process: function assert_TestDom (error) {
		if (error && this.errors[this.errors.length - 1] !== error) {
			this.errors.push(error);
		}
		
		var current = this.getNext_(error == null);
		if (current == null) {
			this.emit('complete', this.errors);

			if (this.errors.length) {
				this.reject(this.errors);
			} else {
				this.resolve();
			}
			return;
		}

		this.driver.process(this, current, this.next_);
		return this;
	},
});
