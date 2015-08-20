(function (window) {
    'use strict';

    var deepExtend = function (out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];

            if (!obj)
                continue;

            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object')
                        deepExtend(out[key], obj[key]);
                    else
                        out[key] = obj[key];
                }
            }
        }

        return out;
    };

    var EventMachine = function (opts) {
        var eventRegistry = {};

        var defaultOptions = {
            debug: true,
            eventErrorHandler: function (e, eventName, args, eventHandler) {
                console.error('Event handler for "%s" resulted in error:', eventName, e, args, eventHandler);
            }
        };

        opts = opts || {};
        var options = deepExtend({}, defaultOptions, opts);

        this.on = function (event, callback) {
            if (options.debug) {
                console.info('Attached handler to event "%s"', event, callback);
            }
            if ('undefined' === typeof eventRegistry[event]) {
                eventRegistry[event] = [];
            }
            eventRegistry[event].push(callback);
        };

        this.emmit = function () {

            var args = (function (args) {
                var callableArgs = [];
                for (var i in args) {
                    callableArgs.push(args[i]);
                }
                return callableArgs;
            })(arguments);

            var event = args.shift();

            if ('undefined' === typeof eventRegistry[event]) {
                if (options.debug) {
                    console.info('No handlers registered for event "%s"', event);
                }
                return;
            }

            var eventCollection = eventRegistry[event];

            (function (events, args) {
                for (var i in events) {

                    var eventCallable = (function (event, eventName, args, options) {
                        try {
                            event.apply(null, args);
                        } catch (e) {
                            options.eventErrorHandler(e, eventName, args, event);
                        }
                    });

                    window.setTimeout(eventCallable.bind(null, events[i], event, args, options), 0);
                }
            })(eventCollection, args);
        };
    };

    window.EventMachine = function (opts) {
        return new EventMachine(opts);
    }

})(window);