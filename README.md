EventMachine
================

[![Build Status](https://travis-ci.org/Addvilz/eventmachine.svg?branch=master)](https://travis-ci.org/Addvilz/eventmachine)

EventMachine is a light-weight implementation of event emitter.

### Why another one?!

I needed a event emitter that:

1. works in a browser;
2. is not a resource hog (EventMachine is just 1.4kB minified);
3. has no external dependencies;
4. callbacks be executed in a fresh stack;
5. with a learning curve analogue to that of banana;

### What's the difference between EventMachine and X?

EventMachine is pretty similar to a lot of other event emmiters out there, with the only major difference being that all event handler calls are wrapped inside a JavaScript `setTimeout` function call with a timeout value `0`.

This forces the event handlers to be placed and executed at the end of the execution stack by 'pausing' JavaScript execution providing time for the rendering threads in the browser to catch up.

I found this to be a major issue while using other event emmiter implementations, for example, the one from backbone.

You can look at the demo on how this affects UI rendering in [this JSFiddle](https://jsfiddle.net/atnwp3nc/1/).

You can read more about the effect this has in [this StackOverflow question](http://stackoverflow.com/questions/779379/why-is-settimeoutfn-0-sometimes-useful), especially [this answer](http://stackoverflow.com/a/4575011/1653859).

### Dependencies

None.

### Installation

- clone this repository; or
- download the `dist/eventmachine.js`; or
- `bower install eventmachine`; or
- `npm install eventmachine`.

### Sample usage

```js
var options = {};
var eventMachine = EventMachine(options);

eventMachine.on('some:demo:event', function (arg1, arg2) {
    console.log(arg1, arg2);
});

eventMachine.emmit('some:demo:event', 'arg1 value', 'arg2 value');
```

### Instance API

These methods are available for a instantiated EventMachine, e.g. for instance after `EventMachine(opts)` constructor is called.

#### on(event,callback)

Adds a listener to the end of the listeners array for the specified event.

#### emmit(event, ...args)

Emmit an event with given name and optional arguments.

#### forward(event)

Get a wrapper to forward given call to event handler. This function is pretty neat, as it allows you to do this -

```js
document.getElementById('button')
    .addEventListener('click', eventMachine.forward('some:event'));
```

or this

```js
$('#button').click(eventMachine.forward('some:event'));
```

#### removeListener(event, listener)

Remove a listener from the listener array for the specified event.

#### removeAllListeners(event)

Remove all listeners from the listener array for the specified event.

#### listeners(event)

Returns an array of listeners for the specified event.

### Static API

These methods are directly available via `EventMachine.{method}`.

#### EventMachine.extend(object, options)

Extend an object with EventMachine functionality. Wrap works similarly as `EventMachine()` factory, but instead of giving a new instance
of the EventMachine, this method returns the given instance of already existing object with all the functionality of the EventMachine.


```js
var foo = new function () {};

EventMachine.extend(foo);

foo.on('bar', function (arg) {
    console.log(arg);
});

foo.emmit('bar', 'value'); // value

```

### Options


`debug: true/false`: print mostly useless debug messages

`eventErrorHandler: function (e, eventName, args, eventHandler)` do something when invoked event does boo-boo


### Running tests

Running tests require that you install mocha and chai dev dependencies (see package.json). You can then run the tests using the command `npm test`.

### License

Licensed under terms and conditions of Apache 2.0 license.
