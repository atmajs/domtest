DomTest
---


[![Build Status](https://travis-ci.org/atmajs/domtest.png?branch=master)](https://travis-ci.org/atmajs/domtest)
[![NPM version](https://badge.fury.io/js/domtest.svg)](http://badge.fury.io/js/domtest)
[![Bower version](https://badge.fury.io/bo/domtest.svg)](http://badge.fury.io/bo/domtest)

_using [MaskJS](https://github.com/atmajs/MaskJS) syntax_

#### API

- Configuration
	- Reporter
	
		```javascript
		DomTest.config({
			report: Function<AssertionError> 
		});
		```
		When `report` option is defined, the `AssertionError` won't be thrown then.

- Run test cases
	- DomTest
	
		```javascript
		DomTest(Element, MaskTestSuite): IPromise<Runner>
		```
		
		Returns an object with `Promise` interface, and resolves when the test case is complete.
	
#### Test Suite Syntax

_Refer to the MaskJS syntax spec._

Each node performs some action: test/manipulate/etc.

##### Traverse

_Refer to jQuery traverse functions._

Creates new Elements scope and selects elements for the scope. Throws assertion error, when elements can not be found

```sass
traverseFunction (selector) {
	// ...
}
```

Example:
```sass
// nesting example
find (div > span) {
	data('id', 'Foo');
	find (em) {
		text('Foo');
	}
}
```

##### jQuery Tests

_Refer to jQuery getter functions._

- `eq`, `notEq`, `deepEq`, `notDeepEq`, `has`, `hasNot`

	```sass
	testFn (jQueryKey, [...jquery_arguments], value)
	```
	Example:
	```sass
	// by property, check if the jQuery set contains 10 element.
	eq ('length', 10);
	
	// by function
	has('data', 'lorem', 'ipsum');
	// is similar to: $elements.data('lorem').indexOf('ipsum') !== -1
	```

- Simplified equality check

	The `eq` test is the default test. Last argument is the value to compare the return value with
	
	```sass
	jQueryFunction ([...jquery_argument,]value)
	```
	Example:
	```sass
	attr('id', 'Baz');
	// calls attr('id') function on the elements in the scope and check if equal to 'Baz'
	```

##### Simulation

Credits to:
- [jQuery-Simulate](https://github.com/jquery/jquery-simulate)
- [jQuery-Simulate-Ext](https://github.com/j-ulrich/jquery-simulate-ext)

```sass
do ActionName (?argument);
```
Examples:
```
// simulate click
do click;

// simulate press (even combinations)
do press('ctrl+c');

// simulate user type
do type('Hello');
```


##### Debug
You may want to stop on some elements to inspect them in developer tools:
```
children (li) {
	debugger;
	// ...
}
```

##### Async
You may want to wait some time or to wait until some element appears in the dom.
For instance, when there is some async calls after button click action
```sass
await(selector);
await(number);
```

Example:
```
find ('button.show-about') > do click;

await('section.about') {
    has('html', 'Credits');
}
```


##### Sample

```sass
/*
 * assume this markup:
 * <div class='foo baz'>Foo</div>
 * <input value='A' />
 * Test Suite:
 */

with (.foo)  {
	text('Foo');
	hasClass('baz', true);
	do click;
}

with (input) {
	val('A');
	do press ('BACKSPACE');
	
	do type('Baz');
	val('Baz');
}

```

:copyright: MIT _The AtmaJS Project_