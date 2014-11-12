var options = {
	report: null
};
(function(){
	
	assert_TestDom.config = function(mix){
		if (typeof mix === 'sttring') {
			return options[mix];
		}
		
		obj_extend(options, mix);
		return assert_TestDom;
	};
	
}());
