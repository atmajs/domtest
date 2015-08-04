var Drivers;

(function(){

	Drivers = {
		initialize (name, options = null) {
			var Ctor = Drivers[name] || require(name);
			return new Ctor(options);
		},
		/*...*/
	};

	// import ./abstract/exports.es6
	// import ./domlib/domlib.es6
	// import ./jmask/jmask.es6
	// import ./cheerio/cheerio.es6
	// import selenium/selenium.es6

}());