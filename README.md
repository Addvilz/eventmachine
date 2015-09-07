EventMachine
================

EventMachine is a light-weight implementation of event emitter.

### Why another one?!

I needed a event emitter that:

1. works in a browser;
2. is not a resource hog (EventMachine is just 1.4kB minified);
3. has no external dependencies;
4. callbacks be executed in a fresh stack;
5. with a learning curve analogue to that of banana;

### Dependencies

None.

### Installation

Clone this repository, download the `dist/eventmachine.js` or use `bower install eventmachine`.

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


### License

Licensed under terms and conditions of Apache 2.0 license.
