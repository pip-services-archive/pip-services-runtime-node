"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var Category_1 = require('../config/Category');
var ComponentDescriptor_1 = require('../config/ComponentDescriptor');
var AbstractCounters_1 = require('./AbstractCounters');
/**
 * Performance counters component that periodically dumps counters
 * to log as message: 'Counter <name> {"type": <type>, "last": <last>, ...}
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-05-01
 */
var LogCounters = (function (_super) {
    __extends(LogCounters, _super);
    /**
     * Creates instance of log counters component.
     */
    function LogCounters() {
        _super.call(this, LogCounters.Descriptor);
    }
    /**
     * Formats counter string representation.
     * @param counter a counter object to generate a string for.
     * @return a formatted string representation of the counter.
     */
    LogCounters.prototype.counterToString = function (counter) {
        return 'Counter ' + counter.name
            + ' ' + JSON.stringify(_.omit(counter, 'name'));
    };
    /**
     * Outputs a list of counter values to log.
     * @param counter a list of counters to be dump to log.
     */
    LogCounters.prototype.save = function (counters, callback) {
        var _this = this;
        if (_.isEmpty(counters)) {
            callback(null);
            return;
        }
        counters = _.sortBy(counters, function (counter) { return counter.name; });
        _.each(counters, function (counter) {
            _this.debug(null, _this.counterToString(counter));
        });
        callback(null);
    };
    /**
     * Unique descriptor for the LogCounters component
     */
    LogCounters.Descriptor = new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Counters, "pip-services-runtime-counters", "log", "*");
    return LogCounters;
}(AbstractCounters_1.AbstractCounters));
exports.LogCounters = LogCounters;
