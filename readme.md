## DomTest

[![Build Status](https://travis-ci.org/atmajs/domtest.png?branch=master)](https://travis-ci.org/atmajs/domtest)
[![NPM version](https://badge.fury.io/js/domtest.svg)](http://badge.fury.io/js/domtest)
[![Bower version](https://badge.fury.io/bo/domtest.svg)](http://badge.fury.io/bo/domtest)

#### Describe DOM Tests with ease: less code, less words.

- `MaskJS` syntax
- `jQuery` API
- Works in browser and Node.js
- Supports different drivers (_runners_):
	- jQuery or similar
	- [Cheerio](https://github.com/cheeriojs/cheerio) (_jQuery-alike `html` library_)
	- [Selenium-Query](https://github.com/tenbits/selenium-query) (_jQuery-alike `webdriver` library_)
- Fully async


## Test Suites

All statements are of the 4 types: **traversers**, **events**, **actions** and **assertions**.

### Traversers

A traverser component creates elements scope (`context`) for nested components. The `context` is the jQuery-alike instance.

> :star: Components also perform assertions after query to ensure the elements are found

- `find (selector)`

	> :exclamation: If no elements are found, the `filter` method is then called.

- `filter (selector)`
- `children (selector)`
- `parent (selector)`
- `closest (selector)`

```mask
find ('.foo') {
	// do assertions in this elements scope
	// e.g: check that that 2 elements are in the context
	eq length 2;
}
```

:tada: When selector has no whitespace `''` are optional
```mask
find (section) {
	// ...
}
```

### Events

An event component triggers native or custom events on current scope

`trigger eventName (...args);`

:star: Known event names don't need `trigger` keyword.

> `blur`, `focus`, `resize`, `scroll`, `click`, `dblclick`, `mousedown`, `mouseup`, `mousemove`, `mouseover`, `mouseout`, `mouseenter`, `mouseleave`, `change`, `submit`, `keydown`, `keypress`, `keyup`.

:tada: When statement has no arguments `()` are optional.

```mask
find (button) {
	click;
}
```

> :exclamation: `Cheerio` driver supports no events, as it tests only html AST in Node.js environment

### Actions

An action component performs some action, calls javascript functions, mutates the dom, or runs a group of actions.

#### Keyboard

- `type (text)`

	Text can contain meta key definitions in `{}`, e.g.:
	```mask
	find ('input.foo') {
		type ('Hello friends!{enter}');
	}
	```

- `press (keyCombination)`

	Key combination (hotkey): `ctrl+f`, `alt+c+b`, `a+d` e.g.
	```mask
	find ('input.foo') {
		press ('alt+f');
	}
	```

#### Functions

A function component simply call the jQuery function.

`call functionName (...args)`

#### Select

`select` component selects a text range or an option, depends on a current context

```mask
find ('input.foo') {
	// selects everything
	select;
	// selects range
	select (0, 5);
	// finds text and selects it
	select ('foo');
}
find ('select.city') {
	// select an option by `value`, or `name` or `textContent`
	select ('London');
}
```


## Assertions

An assertion component reads current `context`s property or calls a function to compare the value with expected value.

> :eyeglasses: Assertion components with aliases: `equal` ~ `eq`, `notEqual` ~ `notEq`, `lessThan` ~ `lt`, `lessThanOrEqaul` ~ `lte`, `greaterThan` ~ `gt`, `greaterThanOrEqual` ~ `gte`, `deepEqual` ~ `deepEq`, `notDeepEqual` ~ `notDeepEq`, `has`, `hasNot`

- `eq propertyName (expectedValue)`
- `eq functionName (...args, expectedValue)`

:tada: As the accent in this library is made for assertions, so when no event, action, traverser, etc is found, then we assume it is the `eqaul` component, so you can skip the `equal` keyword.

```mask
find ('button') {
	// should find one element
	eq length (1);
	// same
	eq length 1;
	// same
	length 1;
}
find ('.baz') {
	eq attr (name, 'Baz');
	// same
	eq attr name Baz;
	// same
	attr name Baz;

	// check class name
	eq hasClass ('baz', true);
	// same
	hasClass ('baz', true);
	// same
	hasClass baz;
}

```


##### Sample
Assume this DOM
```html
<div class='foo baz' onclick="this.style.display = 'none'">Foo</div>
<input value='A' />
```
Test suite sample:
```mask
// finds all `.foo` elements and sets them for assertion scope
find ('.foo')  {
	// check text property
	text Foo;
	hasClass baz;
	// perform action
	click;
	// check visibility
	css display none;
	// or
	is hidden;
	// check bg color
	css ('background-color', 'red');
}
find ('input') {
	val A;
	press backspace;

	type Baz;
	val Baz;
}
```


## Install

```bash
$ bower install domtest
# or
$ npm install domtest
```

### API

- DomTest

	```javascript
	DomTest(Element: Node, MaskTestSuite: String): IEventEmitter<Runner>
	```

	#### Runner
	- `.on(event, handler)`

		| Event | Data | Description |
		|--------|-----------| ------------|
		| `fail`  | `error: AssertionError` | Failed assertion |
		| `success`| - | Successful assertion |
		| `progress` | `runner:Runner, node: MaskNode, error:AssertionError` | After each step. `error` is null, when assertion is ok |
		| `complete` | `errors:Array<AssertionError>` | Runner has finished all tests |

	- `.off(event, handler)`


- Component test _(For [MaskJS](https://github.com/atmajs/maskjs) users)_

	If you use MaskJS for the application, it simplifies component and template testings

	```javascript
	DomTest.compo(template, ?model): IEventEmitter<Runner>
	```
	_E.g._
	```javascript
	DomTest.compo(`
		section #content {
			:profile;
		}
		:utest {
			// binding test
			with (input.profile-name) >
				type FooName;
			with (model) {
				name FooName;
			}
		}
	`);
	```



### Syntax

_Refer to the MaskJS syntax spec._

Each node performs some action: `assertion`, `manipulation`, etc.

### Assertions

jQuery property of the current set is used, and in case if the property is the function, than the functions result is used for the assertion.

| assertionFunction      | Description |
|------------------------|-------------|
| `eq`, `notEq`          | Equal(Not Equal) check |
| `deepEq`, `notDeepEq`  | Objects and Arrays comparison |
| `has`, `hasNot`        | Check for a substring, check children by selector, check sub object existance |
| `lt`, `lte`			 | Less-Than, Less-Than-Or-Equal |
| `gt`, `gte`			 | Greater-Than, Greater-Than-Or-Equal |


```mask
assertionFunction (jqueryAccessor, [...arguments], testValue);

eq('text', 'Bar');
//js counterpart: assert.equal($set.text(), 'Bar');

eq('length', 1);
//js counterpart: assert.equal($set.length, 1);

eq('attr', 'id', 'Foo');
//js counterpart: assert.equal($set.attr('id'), 'Bar');
```

Simplified syntax:
```mask
assertionFunction jqueryAccessor [...arguments] testValue;

eq text Bar;
eq length 1;
eq attr id Foo;
```

`eq` is the default assertion and can be omitted
```mask
jqueryAccessor [...arguments] testValue

text Bar;
length 1;
attr id Foo;
```



### Traverse

_Refer to jQuery traverse functions._

- `find` (_alias_ `with`), `children`, `closest`, `siblings`, `parent`, `eq`, `filter`, `first`, `last`, `next`, `nextAll`, `nextUntil`, `prev`, `prevAll`, `prevUntil`

All assertions, like all other actions, are called in a current jQuery context. From the start on this is equal to the root element(s) (_see the `DomTest` function_).
With the traverse functions you select new elements for the current context. They will throw also an error if no elements can't be found.

```mask
traverseFunction (selector) {
	// ... assertoions, etc
}
```
Example:
```mask
find (div > span) {
	data id Foo;

	// nesting example
	find (em) {
		text Foo;
	}
}
```



### Simulation


Triggers an event or simulates user interaction

```mask
do ActionName (...arguments);
```

> All DOM and Simulations could be triggered without the keyword `do`

Examples:
```
do customFooEvent;
do click; // or just
click;
// simulate press (_also combinations_)
press ('ctrl+c');
// simulate user type
do type ('Hello World');
```

- Dom events
	`mousemove`, `mousedown`, `mouseup`, `click`, `dblclick`, `mouseover`, `mouseout`, `mouseenter`, `mouseleave`, `contextmenu`

- Simulate

	| Action | Arguments | Description |
	|--------|-----------| ------------|
	|`press` | (Char/String)  | Press a key or combination. Letters are case sensitive |
	|`type`  | (String) | Simulate user typing |
	|`select`| (String) <br/> (start, end) | `SELECT NODE`: Search for an option by text or attribute(`value`, `name`, `id`) and select this <br /> `INPUT/TEXTAREA NODE`: Selects the text/range|


### Debugging
`debugger`: stop on some element(s) to inspect them in developer tools:
```mask
children (li) {
	debugger;
}
```


### Async
`async`: wait some time or wait until some element appears in the dom.
For instance, when there is some async calls after button click action
```mask
await (selector);
await (number);
```

Example:
```
find ('button.show-about') > click;
await('section.about') {
    has html Credits;
}
```

### Manipulation
`call`: call a jQuery function to modify current elemens
> _rarely used_, as usually all dom modifications are performed within some handlers

```mask
call text('Foo'); // or simpler(no whitespace in the text)
call text Foo
// This sets textContent to 'Foo' (not the assertion)
```

### Javascript
`slot`: is an embedded javascript block to execute. _Can cover any need_
```javascript
// sync version
slot name ($ctx, assert) { /*...*/ }

// async version
slot name ($ctx, assert, done) {/*...*/}

find (input) {
	slot checkFoo ($input, assert) {
		// just a simple js demo
		var foo = someFooFunction($input);
		assert.equal(foo, 3)
	}
}
```

### Examples
[/examples](./examples)

```bash
# install dependencies
bower install

# run local static server
npm install -g atma
atma server

# navigate to e.g. `http://localhost:5777/examples/standalone.html`
```


### Contribute
#### Build
```bash
$ npm install
$ bower install
$ git submodule update --recursive
$ npm build
```

#### Test
```bash
npm test
```

----

Credits to:
- [jQuery-Simulate](https://github.com/jquery/jquery-simulate)
- [jQuery-Simulate-Ext](https://github.com/j-ulrich/jquery-simulate-ext)

----

:copyright: MIT _The AtmaJS Project_