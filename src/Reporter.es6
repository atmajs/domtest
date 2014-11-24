var Reporter,
	ProgressReporter_DOM;

(function(){
	Reporter = {
		report (error, runner) {
			if (options.report) {
				options.report(error);
				return;
			}
			
			if (__assert) {
				if (__assert.ifError) {
					__assert.ifError(error);
					return;
				}
				
				if (error != null && __assert.fail) {
					__assert.fail(error);
					return;
				}
			}
			
			if (error) {
				throw error;
			}
		}
	};
	
	ProgressReporter_DOM = function(el){
		var lines = [];
		var pre = mask.render(`
			pre > +each(.) > div {
				span style='color: ~[: errored ? "red" : "green"]' > '~[hint]'
				span > '~[text]'
			}
		`, lines);
		el.appendChild(pre);
		
		return function(runner, node, error){
			lines.push({
				text: runner.formatCurrentLine_(error),
				hint: error ? '✘ ' : '✓ ',
				errored: Boolean(error)
			});
			if (error) {
				lines.push({
					text: String(error),
					hint: ' '
				});
			}
		}
	};
}());