var RunnerNodes = class_create(IRunner, {

	constructor: function Runner(driver, root, node, model, compo) {
		this.root = root;
		this.node = node;
		this.$ = null;
		this.stack = [];
	},

	createRoot () {
		return this
			.driver
			.createRoot(this.root)
			.done(($) => {
				this.$ = $;
				this.stack = [{
					$: $,
					node: this.node
				}];
			});
	},

	process: function assert_TestDom (error) {
		if (error == null && this.$ == null) {
			this
				.createRoot()
				.done(() => this.process())
				.fail(error => this.process(error));
			return this;
		}
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
