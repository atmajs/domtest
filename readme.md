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
		DomTest(Element: Node, MaskTestSuite: String): IPromise<Runner>
		```
		
		Returns an object with `Promise` interface, and resolves when the test case is complete.
	
	- Component test
	
		If you use MaskJS for the application, it simplifies component and template testings
		
		```javascript
		DomTest.compo(template, ?model): IPromise;
		```
		_E.g._
		```javascript
		DomTest.compo(`
			section #content {
				:profile;
			}
			:utest {
				// binding test
				with (input.profile-name) > do type FooName;
				with (model) {
					eq name FooName;
				}
			}
		`);
		```
		
		
### Test Suite Syntax

_Refer to the MaskJS syntax spec._

Each node performs some action: test/manipulate/etc.

#### Traverse

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

#### jQuery Tests

_Refer to jQuery getter functions._

- `eq`, `notEq`, `deepEq`, `notDeepEq`, `has`, `hasNot`

	```sass
	testFn (jQueryKey, [...jquery_arguments], testValue)
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

	_Need more simple write-read?_
	
	You can also eliminate the parentheses and the quotation marks (_without whitespace_)
	```javascript
	attr('id', 'Baz');
	// >
	attr id Baz;
	
	eq('length', 2);
	// >
	eq length 2;
	// or (as `eq` is default)
	length 2;
	```
	
	

#### Simulation

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

// simulate press (_also combinations_)
do press('ctrl+c');

// simulate user type
do type('Hello');
```

##### Actions

- Dom events
	`mousemove`, `mousedown`, `mouseup`, `click`, `dblclick`, `mouseover`, `mouseout`, `mouseenter`, `mouseleave`, `contextmenu`

- Simulate

	| Action | Arguments | Description |
	|--------|-----------| ------------|
	|`press` | (Char/String)  | Press a key or combination. Letters are case sensitive |
	|`type`  | (String) | Simulate user typing |
	|`select`| (String) | Search for an option by text or attribute(`value`, `name`, `id`) and select this |
	

#### Debug
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

find (.foo)  {
	text Foo;
	hasClass baz;
	do click;
}

find (input) {
	val A;
	do press backspace;
	
	do type Baz ;
	val Baz;
}

```

:copyright: MIT _The AtmaJS Project_