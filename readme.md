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


## [Assertions](https://github.com/atmajs/assertion)

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

## API


- `DomTest()`

	```javascript
	DomTest(Element: Node, MaskTestSuite | Array<MaskTestSuite>): Runner
	```

	Create default `DomLibRunner` and immediately start the test.

- `DomTest.use(driver:string, settings:object): Runner`

	Create the Test Runner. Available runners:

	- `'domlib'`
	- `'jmask'`
	- `'cheerio'`
	- `'selenium'`

	> :exclamation: Note, that `cheerio` and `selenium` can be evaluated in Node.JS only, and `domlib` in browser only, `jmask` can be used in browser and Node.js

### Runner

`Runner implements IEventEmitter, IPromise`

- `Runner::process(root:any, suite: MaskTestSuite | Array<MaskTestSuite>)`

	- `root` is the root object, which runner uses for test. Refer to the particular Runner to find out the required root-type.
	- `suite(s)` is/are the tests to be run for the root object

##### Events
	- `.on(event, handler)`

	| Event | Data | Description |
	|--------|-----------| ------------|
	| `fail`  | `error: AssertionError` | Failed assertion |
	| `success`| - | Successful assertion |
	| `progress` | `runner:Runner, node: MaskNode, error:AssertionError` | On each step. `error` is null, when assertion is ok |
	| `complete` | `errors:Array<AssertionError>` | Runner has finished all tests |

	- `.off(event, handler)`

### `MaskTestSuite:string|MaskAST|function`

- `string|MaskAST`: Mask template with the components. See the [Test Suite](#testsuites) for supported components
- `function`: Custom function


## Runners

##### Domlib

Uses jQuery-like dom library to test HtmlElements in browser. (`@default`)

```javascript
DomTest(document.body, `
	find ('button') {
		click;
		text ('Foo');
	}
`);
```

##### jMask

Uses jMask library to test MaskAST in browser or Node.js

```javascript
var template = 'section > input placeholder="Foo";'
DomTest
	.use('jmask')
	.process(template, `
		find('input') {
			attr placeholder Foo;
		}
	`);
```

##### Cheerio

Uses cheerio module to test HTML in Node.js.

> :exclamation: No actions are available here, _as no listeners can be attached to plain HTML_.

```javascript
var template = '<section><input placeholder="Foo"></section>';
DomTest
	.use('cheerio')
	.process(template, `
		find('input') {
			attr placeholder Foo;
		}
	`);

DomTest
	.use('cheerio')
	.process('http://google.com', `
		find('input') {

		}
	`);
```

##### Selenium

Uses `selenium-webdriver` module to test the Web Pages

```javascript
DomTest
	.use('selenium', Options)
	.process('https://developer.mozilla.org/en/', `
		find('input[name=q]') {
			type XmlHttpRequest;
			trigger submit;
		}
		await ('.result-list') {
			prop tag ul;
			children {
				notEq length 0;
				eq (1) {
					has text XmlHttpRequest;
				}
			}
		}
	`);
```

**Options default**

```javascript
{
	name: 'Chrome',
	args: ['no-sandbox'],
	binaryPath: null,
}
```

For more information, please refer to sources: [config.es6](/src/drivers/selenium/config.es6)

> :exclamation: you can override functions to set any webdriver option you need.


----

:copyright: MIT _The AtmaJS Project_