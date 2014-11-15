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
		var u = compo.findAll(':utest'),
			count = u.length,
			dfr = new Dfr;
		
		if (count === 0) {
			__assert(false, 'No `:utest` components found');
			return dfr.reject();
		}
		
		u.forEach((test) => {
			DomTest(test.$, test).done(() => {
				if (--count === 0) 
					dfr.resolve();
			});
		});
		return dfr;
	}
	
	mask.registerHandler(':utest', mask.Compo({
		render: function (model, ctx, container) {
			if (container.nodeType === Node.DOCUMENT_FRAGMENT_NODE) 
				container = container.childNodes;
			
			this.$ = $(container);
		}
	}));
}());
