"use strict";
var assert = require('chai').assert;
var CounterType_1 = require('../../src/counters/CounterType');
var CountersFixture = (function () {
    function CountersFixture(counters) {
        assert.isNotNull(counters);
        this._counters = counters;
    }
    CountersFixture.prototype.testSimpleCounters = function () {
        this._counters.last('Test.LastValue', 123);
        this._counters.last('Test.LastValue', 123456);
        var counter = this._counters.get('Test.LastValue', CounterType_1.CounterType.LastValue);
        assert.isNotNull(counter);
        assert.equal(counter.last, 123456);
        this._counters.incrementOne('Test.Increment');
        this._counters.increment('Test.Increment', 3);
        counter = this._counters.get('Test.Increment', CounterType_1.CounterType.Increment);
        assert.isNotNull(counter);
        assert.equal(counter.count, 4);
        this._counters.timestampNow('Test.Timestamp');
        this._counters.timestampNow('Test.Timestamp');
        counter = this._counters.get('Test.Timestamp', CounterType_1.CounterType.Timestamp);
        assert.isNotNull(counter);
        assert.isDefined(counter.time);
        this._counters.stats('Test.Statistics', 1);
        this._counters.stats('Test.Statistics', 2);
        this._counters.stats('Test.Statistics', 3);
        counter = this._counters.get('Test.Statistics', CounterType_1.CounterType.Statistics);
        assert.isNotNull(counter);
        assert.equal(counter.avg, 2);
        this._counters.dump();
    };
    CountersFixture.prototype.testElapsedTime = function (done) {
        var _this = this;
        var timing = this._counters.beginTiming('Test.Elapsed');
        setTimeout(function () {
            timing.endTiming();
            var counter = _this._counters.get('Test.Elapsed', CounterType_1.CounterType.Interval);
            assert.isNotNull(counter);
            assert.isTrue(counter.last > 100);
            assert.isTrue(counter.last < 5000);
            _this._counters.dump();
            done();
        }, 1000);
    };
    return CountersFixture;
}());
exports.CountersFixture = CountersFixture;
