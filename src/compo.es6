var compo_domtest;

(function(){

	compo_domtest = function (mix, model) {

		if (typeof mix !== 'string') {
			return test(mix);
		}

		var compo = new Compo;
		mask.render(mix, model, null, null, compo);

		return test(compo);
	};

	function test (compo) {
		var compos = compo.findAll(':utest');

		if (compos.length === 0) {
			var msg = 'No `:utest` components found';
			__assert(false, msg);
			return (new class_Dfr).reject(msg);
		}

		var conductor = new DomTest.Conductor();

		compos.forEach(compo => {
			conductor.addRunner(compo.$, compo);
		});
		return conductor.process();
	}

	mask.registerHandler(':utest', mask.Compo({
		render: function (model, ctx, container) {
			if (container.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
				container = container.childNodes;

			this.$ = $(container);
		}
	}));
}());
