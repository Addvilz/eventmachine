(function (scope) {
    'use strict';

    var executionTimeout = 0;

    if (typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        // Work around Firefox not deferring execution if timeout is less than 4ms.
        executionTimeout = 4;
    }

    var deepExtend = function (out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];
            if (!obj) {
                continue;
            }
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object') {
                        deepExtend(out[key], obj[key]);
                    } else {
                        out[key] = obj[key];
                    }
                }
            }
        }
        return out;
    };

    var eventCallable = function (event, eventName, args, eventErrorHandler) {
        try {
            event.apply(this, args);
        } catch (e) {
            eventErrorHandler(e, eventName, args, event);
        }
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
            disableDeferred: false,
            disableDeferredFor: {},
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
            return self;
        };

        /**
         * Emit event
         * @param event
         * @param a1
         * @param a2
         * @param a3
         * @param a4
         * @param a5
         */
        self.emit = function (event, a1, a2, a3, a4, a5) {
            var innerScope = this;

            if (innerScope instanceof EventMachine) {
                innerScope = null;
            }

            var argsLength = arguments.length;
            var args = new Array(argsLength);
            for (var i = 1; i < argsLength; ++i) {
                args[i - 1] = arguments[i];
            }

            if ('undefined' === typeof self.eventRegistry[event]) {
                if (self.options.debug) {
                    console.info('No handlers registered for event "%s"', event);
                }
                return;
            }

            var eventCollection = self.listeners(event);

            for (var ii = 0, len = eventCollection.length; ii < len; ii++) {
                var eventHandler = eventCollection[ii];

                if (
                    self.options.disableDeferred ||
                    typeof eventHandler.disableDeferred !== 'undefined' ||
                    self.options.disableDeferredFor
                ) {
                    eventCallable.call(
                        innerScope,
                        eventCollection[ii],
                        event,
                        args,
                        self.options.eventErrorHandler
                    );
                    continue;
                }

                setTimeout(
                    eventCallable.bind(
                        innerScope,
                        eventCollection[ii],
                        event,
                        args,
                        self.options.eventErrorHandler
                    ),
                    executionTimeout
                );
            }
            return self;
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

            self.eventRegistry[event].splice(i, 1);

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
            return self;
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
                return self.emit
                    .bind(this, event)
                    .apply(this, arguments)
                    ;
            };
        };

        /**
         * Turn deferred execution for handler on or off, for all current and future handlers of given event.
         * @param event
         * @param state
         */
        self.setDeferredFor = function (event, state) {
            self.options.disableDeferredFor[event] = state ? true : false;
            return self;
        };

        /**
         * Wrap an object with EventMachine functionality
         * @param object
         * @param options
         */

        return self;
    };

    /**
     * Get a new Instance of EventMachine
     * @param {Object} opts
     * @returns {EventMachine}
     * @constructor
     */
    scope.EventMachine = function (opts) {
        return new EventMachine(opts);
    };

    /**
     * Allows to extend the object with EventMachine functionality.
     * @param object
     * @param options
     * @returns {EventMachine}
     */
    scope.EventMachine.extend = function (object, options) {
        return new EventMachine(options, object);
    };

})(typeof module !== 'undefined' && typeof module.exports !== 'undefined' ? module.exports : window);