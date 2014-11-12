DomTest
----

_using [MaskJS](https://github.com/atmajs/MaskJS) syntax_

```es6
/*
 * assume this markup:
 * <div class='foo baz'>Foo</div>
 * <input value='A' />
\*/
DomTest(document.body, `
	with (.foo)  {
		text('Foo');
		hasClass('baz', true);
		do click;
		
		// etc ...
	}
	with (input) {
		val('A');
		do press ('BACKSPACE');
		
		do type('Baz');
		val('Baz');
	}
`)
```

[![Build Status](https://travis-ci.org/atmajs/domtest.png?branch=master)](https://travis-ci.org/atmajs/domtest)
[![NPM version](https://badge.fury.io/js/domtest.svg)](http://badge.fury.io/js/domtest)
[![Bower version](https://badge.fury.io/bo/domtest.svg)](http://badge.fury.io/bo/domtest)


:copyright: MIT _The AtmaJS Project_