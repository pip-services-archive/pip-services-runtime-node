"use strict";
/**
 * Implementation of ITiming interface that
 * provides callback to end measuring execution
 * time interface and update interval counter.
 *
 * @author Sergey Seroukhov
 * @version 1.1
 * @since 2016-06-09
 */
var Timing = (function () {
    /**
     * Creates instance of timing object that calculates elapsed time
     * and stores it to specified performance counters component under specified name.
     * @param counters a performance counters component to store calculated value.
     * @param name a name of the counter to record elapsed time interval.
     */
    function Timing(counters, name) {
        this._counters = counters;
        this._name = name;
        this._start = Date.now();
    }
    /**
     * Completes measuring time interval and updates counter.
     */
    Timing.prototype.endTiming = function () {
        var elapsed = Date.now() - this._start;
        this._counters.setTiming(this._name, elapsed);
    };
    return Timing;
}());
exports.Timing = Timing;
