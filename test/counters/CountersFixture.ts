let assert = require('chai').assert;

import { AbstractCounters } from '../../src/counters/AbstractCounters';
import { CounterType } from '../../src/counters/CounterType';

export class CountersFixture {
    private _counters: AbstractCounters;
    
    constructor(counters: AbstractCounters) {
        assert.isNotNull(counters);
        this._counters = counters;
    }
        
    testSimpleCounters() {
        this._counters.last('Test.LastValue', 123);
        this._counters.last('Test.LastValue', 123456);
        
        let counter = this._counters.get('Test.LastValue', CounterType.LastValue);
        assert.isNotNull(counter);
        assert.equal(counter.last, 123456);

        this._counters.incrementOne('Test.Increment');
        this._counters.increment('Test.Increment', 3);

        counter = this._counters.get('Test.Increment', CounterType.Increment);
        assert.isNotNull(counter);
        assert.equal(counter.count, 4);

        this._counters.timestampNow('Test.Timestamp');
        this._counters.timestampNow('Test.Timestamp');

        counter = this._counters.get('Test.Timestamp', CounterType.Timestamp);
        assert.isNotNull(counter);
        assert.isDefined(counter.time);

        this._counters.stats('Test.Statistics', 1);
        this._counters.stats('Test.Statistics', 2);
        this._counters.stats('Test.Statistics', 3);

        counter = this._counters.get('Test.Statistics', CounterType.Statistics);
        assert.isNotNull(counter);
        assert.equal(counter.avg, 2);
        
        this._counters.dump();
    }
    
    testElapsedTime(done) {
        var timing = this._counters.beginTiming('Test.Elapsed');

        setTimeout(() => {
            timing.endTiming();

            let counter = this._counters.get('Test.Elapsed', CounterType.Interval);
            assert.isNotNull(counter);
            assert.isTrue(counter.last > 100);
            assert.isTrue(counter.last < 5000);

            this._counters.dump();

            done();
        }, 1000);
    }
}
