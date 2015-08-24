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

    /**
     * EventMachine
     * @param {Object} opts
     * @param {Object} objectToWrap
     * @constructor
     */
    var EventMachine = function (opts, objectToWrap) {

        var self = objectToWrap || this;

        self.eventRegistry = {};

        var defaultOptions = {
            debug: false,
            eventErrorHandler: function (e, eventName, args, eventHandler) {
                console.error('Event handler for "%s" resulted in error:', eventName, e, args, eventHandler);
            }
        };

        opts = opts || {};

        self.options = deepExtend({}, defaultOptions, opts);

        /**
         * Adds a listener to the end of the listeners array for the specified event.
         * @param event
         * @param {Function} callback
         */
        self.on = function (event, callback) {
            if (self.options.debug) {
                console.info('Attached handler to event "%s"', event, callback);
            }
            if ('undefined' === typeof self.eventRegistry[event]) {
                self.eventRegistry[event] = [];
            }
            self.eventRegistry[event].push(callback);
        };

        /**
         * Emmit event
         * @param {string} eventName
         * @param {...mixed} args
         */
        self.emmit = function () {
            var innerScope = this;
            if (innerScope instanceof EventMachine) {
                innerScope = null;
            }

            var args = (function (args) {
                var callableArgs = [];
                for (var i in args) {
                    callableArgs.push(args[i]);
                }
                return callableArgs;
            })(arguments);

            var event = args.shift();

            if ('undefined' === typeof self.eventRegistry[event]) {
                if (self.options.debug) {
                    console.info('No handlers registered for event "%s"', event);
                }
                return;
            }

            var eventCollection = self.listeners(event);

            (function (events, args) {
                for (var i in events) {

                    var eventCallable = (function (event, eventName, args, options) {
                        try {
                            event.apply(innerScope, args);
                        } catch (e) {
                            options.eventErrorHandler(e, eventName, args, event);
                        }
                    });

                    window.setTimeout(eventCallable.bind(innerScope, events[i], event, args, self.options), 0);
                }
            })(eventCollection, args);
        };

        /**
         * Remove a listener from the listener array for the specified event.
         * @param {string} event
         * @param {Function} listener
         * @returns {boolean}
         */
        self.removeListener = function (event, listener) {
            if ('undefined' === typeof self.eventRegistry[event]) {
                return false;
            }
            var i = self.eventRegistry[event].indexOf(listener);
            if (i < 0) {
                return false;
            }
            delete self.eventRegistry[event][i];
            return true;
        };

        /**
         * Remove all listeners from the listener array for the specified event.
         * @param {string} event
         */
        self.removeAllListeners = function (event) {
            if ('undefined' !== typeof self.eventRegistry[event]) {
                delete self.eventRegistry[event];
            }
        };

        /**
         * Returns an array of listeners for the specified event.
         * @param {string} event
         * @returns {Function[]}
         */
        self.listeners = function (event) {
            if ('undefined' !== typeof self.eventRegistry[event]) {
                return self.eventRegistry[event];
            }

            return [];
        };

        /**
         * Get a wrapper to forward given call to event handler.
         * @param {string} event
         * @returns {Function}
         */
        self.forward = function (event) {
            return function () {
                return self.emmit
                    .bind(this, event)
                    .apply(this, arguments)
                    ;
            };
        };

        /**
         * Wrap an object with EventMachine functionality
         * @param object
         * @param options
         */
        self.extend = function (object, options) {
            var emitterOptions = options ? deepExtend({}, self.options, options) : self.options;
            return new EventMachine(emitterOptions, object);
        };

        return self;
    };

    /**
     * Get a new Instance of EventMachine
     * @param {Object} opts
     * @returns {EventMachine}
     * @constructor
     */
    window.EventMachine = function (opts) {
        return new EventMachine(opts);
    };

})(window);