(function(){
	Driver.prototype.Actions.define('selection', (runner, driver, current, done) => {
		var expression = current.node.expression;
		if (expression == null) {
			throw Error('`caret` node expect expression: position number');
		}
		var pos =  mask.Utils.Expression.evalStatements(expression);
		var start = pos[0],
			end = pos[1] || start;

		setSelectionRange(current.$.get(0), start, end);
		setTimeout(done, 16);
	});

	function setSelectionRange(input, selectionStart, selectionEnd) {
		if (input.setSelectionRange) {
			input.focus();
			input.setSelectionRange(selectionStart, selectionEnd);
		}
		else if (input.createTextRange) {
			var range = input.createTextRange();
			range.collapse(true);
			range.moveEnd('character', selectionEnd);
			range.moveStart('character', selectionStart);
			range.select();
		}
	}

	function setCaretToPos (input, pos) {
		setSelectionRange(input, pos, pos);
	}
}());