(function(){
	Driver.prototype.Actions.define('select', (runner, driver, current, done) => {
		var expression = current.node.expression;
		if (expression == null) {
			throw Error('`caret` node expect expression: position number');
		}
		var args =  mask.Utils.Expression.evalStatements(expression);


		current.$.select(...args).done(() => done());
	});

}());