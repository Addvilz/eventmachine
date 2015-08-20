EventMachine
================

EventMachine is a light-weight implementation of event emitter.

**Why another one?!**

I needed a event emitter that:

1. works in a browser;
2. is not a resource hog (EventMachine is just 1kB minified);
3. has no external dependencies;
4. callbacks be executed in a fresh stack;
5. with a learning curve analogue to that of banana;

**Dependencies**

None.

**Installation**

Clone this repository, download the `dist/eventmachine.js` or use `bower install eventmachine`.

**Sample usage**

```js
var options = {};
var eventMachine = EventMachine(options);

eventMachine.on('some:demo:event', function (arg1, arg2) {
    console.log(arg1, arg2);
});

eventMachine.emmit('some:demo:event', 'arg1 value', 'arg2 value');

```

**Options**

`debug : true/false`: print mostly useless debug messages

`eventErrorHandler: function (e, eventName, args, eventHandler)` do something when invoked event does boo-boo


**License**
Licensed under terms and conditions of Apache 2.0 license.
