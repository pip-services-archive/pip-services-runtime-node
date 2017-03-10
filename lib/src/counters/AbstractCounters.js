"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var DynamicMap_1 = require('../portability/DynamicMap');
var State_1 = require('../State');
var AbstractComponent_1 = require('../AbstractComponent');
var CounterType_1 = require('./CounterType');
var Counter_1 = require('./Counter');
var Timing_1 = require('./Timing');
var AbstractCounters = (function (_super) {
    __extends(AbstractCounters, _super);
    /**
     * Creates and initializes instance of the microservice performance counter
     * @param descriptor the unique descriptor that is used to identify and locate the component.
     */
    function AbstractCounters(descriptor) {
        _super.call(this, descriptor);
        this._cache = {};
        this._updated = false;
    }
    /**
     * Sets component configuration parameters and switches component
     * to 'Configured' state. The configuration is only allowed once
     * right after creation. Attempts to perform reconfiguration will
     * cause an exception.
     * @param config the component configuration parameters.
     * @throws MicroserviceError when component is in illegal state
     * or configuration validation fails.
     */
    AbstractCounters.prototype.configure = function (config) {
        this.checkNewStateAllowed(State_1.State.Configured);
        _super.prototype.configure.call(this, config.withDefaults(AbstractCounters.DefaultConfig));
        // Convert timeout to seconds
        this._timeout = Math.max(1000, this._config.getOptions().getInteger('timeout'));
    };
    /**
     * Opens the component, performs initialization, opens connections
     * to external services and makes the component ready for operations.
     * Opening can be done multiple times: right after linking
     * or reopening after closure.
     * @param callback a callback to report success or error in opening
     */
    AbstractCounters.prototype.open = function (callback) {
        var _this = this;
        this.checkNewStateAllowed(State_1.State.Opened);
        // Stop previously set timer 
        if (this._interval)
            clearInterval(this._interval);
        // Set a new timer
        this._interval = setInterval(function () { _this.dump(); }, this._timeout);
        _super.prototype.open.call(this, callback);
    };
    /**
     * Closes the component and all open connections, performs deinitialization
     * steps. Closure can only be done from opened state. Attempts to close
     * already closed component or in wrong order will cause exception.
     * @param callback a callback to report success or error in closing
     */
    AbstractCounters.prototype.close = function (callback) {
        var _this = this;
        this.checkNewStateAllowed(State_1.State.Closed);
        // Stop previously set timer
        if (this._interval)
            clearInterval(this._interval);
        // Clear timer ID
        this._interval = null;
        // Save and clear counters if any
        if (this._updated) {
            var counters = this.getAll();
            this.save(counters, function (err) {
                _this.resetAll();
                if (err)
                    callback(err);
                else
                    _super.prototype.close.call(_this, callback);
            });
        }
        else
            _super.prototype.close.call(this, callback);
    };
    AbstractCounters.prototype.reset = function (name) {
        delete this._cache[name];
    };
    AbstractCounters.prototype.resetAll = function () {
        this._cache = {};
        this._updated = false;
    };
    AbstractCounters.prototype.dump = function () {
        var _this = this;
        if (this._updated) {
            var counters = this.getAll();
            this.save(counters, function (err) {
                if (err)
                    _this.error(null, err, 'Error while saving counters');
                else
                    _this._updated = false;
            });
        }
    };
    AbstractCounters.prototype.getAll = function () {
        var result = [];
        for (var name in this._cache) {
            if (this._cache.hasOwnProperty(name))
                result.push(this._cache[name]);
        }
        return result;
    };
    ;
    AbstractCounters.prototype.get = function (name, type) {
        if (name == '')
            throw new Error('Counter name was not set');
        var counter = this._cache[name];
        if (counter == null || counter.type != type) {
            counter = new Counter_1.Counter(name, type);
            this._cache[name] = counter;
        }
        return counter;
    };
    AbstractCounters.prototype.calculateStats = function (counter, value) {
        if (counter == null)
            throw new Error('Missing counter');
        counter.last = value;
        counter.count = _.isUndefined(counter.count) ? 1 : counter.count + 1;
        counter.max = _.isUndefined(counter.max) ? value : Math.max(counter.max, value);
        counter.min = _.isUndefined(counter.min) ? value : Math.min(counter.min, value);
        counter.avg = _.isUndefined(counter.avg) || counter.count == 1
            ? value : ((counter.avg * (counter.count - 1)) + value) / counter.count;
        this._updated = true;
    };
    AbstractCounters.prototype.setTiming = function (name, elapsed) {
        var counter = this.get(name, CounterType_1.CounterType.Interval);
        this.calculateStats(counter, elapsed);
    };
    AbstractCounters.prototype.beginTiming = function (name) {
        return new Timing_1.Timing(this, name);
    };
    AbstractCounters.prototype.stats = function (name, value) {
        var counter = this.get(name, CounterType_1.CounterType.Statistics);
        this.calculateStats(counter, value);
        this._updated = true;
    };
    AbstractCounters.prototype.last = function (name, value) {
        var counter = this.get(name, CounterType_1.CounterType.LastValue);
        counter.last = value;
        this._updated = true;
    };
    AbstractCounters.prototype.timestampNow = function (name) {
        this.timestamp(name, new Date());
    };
    AbstractCounters.prototype.timestamp = function (name, value) {
        var counter = this.get(name, CounterType_1.CounterType.Timestamp);
        counter.time = value || new Date();
        this._updated = true;
    };
    AbstractCounters.prototype.incrementOne = function (name) {
        this.increment(name, 1);
    };
    AbstractCounters.prototype.increment = function (name, value) {
        value = _.isNumber(value) ? value : 1;
        var counter = this.get(name, CounterType_1.CounterType.Increment);
        counter.count = _.isUndefined(counter.count)
            ? value : counter.count + value;
        this._updated = true;
    };
    AbstractCounters.DefaultConfig = DynamicMap_1.DynamicMap.fromTuples("options.timeout", 60000);
    return AbstractCounters;
}(AbstractComponent_1.AbstractComponent));
exports.AbstractCounters = AbstractCounters;
