var Reporter;
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
}());