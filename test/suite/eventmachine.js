var should = require('chai').should();

module.exports = function(title, instanceFactory){
    var currentInstance;

    describe(title, function () {

        beforeEach(function () {
            currentInstance = instanceFactory();
        });

        afterEach(function () {
            currentInstance = null;
        });

        it('handles simple event', function (done) {
            currentInstance.on('event', function (arg1, arg2) {
                arg1.should.equal('a');
                arg2.should.equal('b');
                done();
            });

            currentInstance.emit('event', 'a', 'b');
        });

        it('calls multiple event handlers', function (done) {
            var numberOfCalls = 0;

            currentInstance.on('event', function () {
                numberOfCalls++;
            });

            currentInstance.on('event', function () {
                numberOfCalls++;
            });

            currentInstance.on('event', function () {
                /**
                 * Event execution is ordered, because events are appended to stack and stack is a single queue.
                 * Hence, the third event to assert that 2 previous events has been called.
                 */

                numberOfCalls.should.equal(2);
                done();
            });

            currentInstance.emit('event');
        });

        it('returns a functional wrapper for forwarding', function (done) {
            currentInstance.on('event', function (arg1, arg2) {
                arg1.should.equal('a');
                arg2.should.equal('b');
                done();
            });

            var forwarder = currentInstance.forward('event');

            forwarder('a', 'b');
        });

        it('retrieves list for listeners', function () {
            var handler = function () {
                this.x = 111;
            };

            currentInstance.on('event', handler);
            currentInstance.listeners('event').should.have.length(1);

            currentInstance.listeners('event')[0].should.equal(handler);
        });

        it('removes listener by instance of handler', function (done) {
            var handler = function () {
                throw 'Should not be called!';
            };

            currentInstance.on('event', handler);
            currentInstance.on('event', done);

            currentInstance.listeners('event').should.have.length(2);

            currentInstance.removeListener('event', handler);

            currentInstance.listeners('event').should.have.length(1);

            currentInstance.emit('event');
        });

        it('removes all listeners', function () {
            currentInstance.on('event', function () {
            });
            currentInstance.on('event', function () {
            });

            currentInstance.on('other:event', function () {
            });

            currentInstance.removeAllListeners('event');

            currentInstance.listeners('event').should.have.length(0);
            currentInstance.listeners('other:event').should.have.length(1);
        });

        it('maintains scope if the scope given', function (done) {
            var expectedScope = {};

            currentInstance.on('event', function () {
                this.should.equal(expectedScope);
                done();
            });

            currentInstance.emit.call(expectedScope, 'event');
        });
    });
};