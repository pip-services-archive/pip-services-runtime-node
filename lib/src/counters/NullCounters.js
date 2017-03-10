"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractComponent_1 = require('../AbstractComponent');
var Category_1 = require('../config/Category');
var ComponentDescriptor_1 = require('../config/ComponentDescriptor');
/**
 * Performance counters component that doesn't calculate or do anything.
 * NullCounter can be used to disable performance monitoring for performance reasons.
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-05-01
 */
var NullCounters = (function (_super) {
    __extends(NullCounters, _super);
    /**
     * Creates instance of null counter that doesn't do anything.
     */
    function NullCounters() {
        _super.call(this, NullCounters.Descriptor);
    }
    /**
     * Suppresses time measurements and returns
     * ITiming interface with endTiming() method
     * that doesn't do another,
     * @param name the name of interval counter.
     * @return callback interface with empty endTiming() method.
     */
    NullCounters.prototype.beginTiming = function (name) {
        return { endTiming: function () { } };
    };
    /**
     * Suppresses calculation of statistics
     * @param name the name of statistics counter.
     * @param value the value to add to statistics calculations.
     */
    NullCounters.prototype.stats = function (name, value) { };
    /**
     * Suppresses recording of the last value.
     * @param name the name of last value counter
     * @param value the value to be stored as the last one
     */
    NullCounters.prototype.last = function (name, value) { };
    /**
     * Suppresses recording of the current time.
     * @param name the name of timing counter
     */
    NullCounters.prototype.timestampNow = function (name) { };
    /**
     * Suppresses recording of the specified time.
     * @param name the name of timing counter
     * @param value the specified time
     */
    NullCounters.prototype.timestamp = function (name, value) { };
    /**
     * Suppresses counter increment by 1.
     * @param name the name of the increment value.
     */
    NullCounters.prototype.incrementOne = function (name) { };
    /**
     * Suppresses counter increment.
     * @param name the name of the increment value.
     * @param value number to increase the counter.
     */
    NullCounters.prototype.increment = function (name, value) { };
    /**
     * Unique descriptor for the NullCounters component
     */
    NullCounters.Descriptor = new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Counters, "pip-services-runtime-lcounters", "null", "*");
    return NullCounters;
}(AbstractComponent_1.AbstractComponent));
exports.NullCounters = NullCounters;
