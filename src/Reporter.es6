var Reporter;
(function(){
	Reporter = {
		report (error, runner) {
			var fn = options.report;
			if (fn) {
				fn(error);
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
}());