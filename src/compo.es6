var compo_domtest;

(function(){
	
	compo_domtest = function (compo) {
		
		var u = compo.findAll(':utest');
		__assert.notEqual(u.length, 0);
		
		u.forEach((test) => {
			
			DomTest(test.$, test.nodes);
		});
	};
	
	mask.registerHandler(':utest', mask.Compo({
		render: function (model, ctx, container) {
			this.$ = $(container);
		}
	}));
}());
