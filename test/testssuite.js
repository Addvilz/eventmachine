var EventMachine = require('../dist/eventmachine.js').EventMachine;
var EventMachineMin = require('../dist/eventmachine.min.js').EventMachine;

var testSuite = require('./suite/eventmachine.js');

testSuite('EventMachine - distribution version', function () {
    return EventMachine({});
});

testSuite('EventMachine - minified version', function () {
    return EventMachineMin({});
});

testSuite('EventMachine - extended object', function () {
    var app = function () {
    };
    return EventMachine.extend(app);
});