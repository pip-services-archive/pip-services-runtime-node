"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var State_1 = require('../State');
var AbstractLogger_1 = require('./AbstractLogger');
var LogEntry_1 = require('./LogEntry');
var DynamicMap_1 = require('../portability/DynamicMap');
var CachedLogger = (function (_super) {
    __extends(CachedLogger, _super);
    function CachedLogger(descriptor) {
        _super.call(this, descriptor);
        this.DefaultConfig1 = DynamicMap_1.DynamicMap.fromTuples("options.timeout", 1000 // timeout in milliseconds
        );
        this._cache = [];
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
    CachedLogger.prototype.configure = function (config) {
        this.checkNewStateAllowed(State_1.State.Configured);
        _super.prototype.configure.call(this, config.withDefaults(this.DefaultConfig1));
        // Define dump timeout 
        this._timeout = Math.max(1000, this._config.getOptions().getInteger("timeout"));
    };
    /**
     * Opens the component, performs initialization, opens connections
     * to external services and makes the component ready for operations.
     * Opening can be done multiple times: right after linking
     * or reopening after closure.
     * @param callback a callback to report success or error in opening
     */
    CachedLogger.prototype.open = function (callback) {
        var _this = this;
        this.checkNewStateAllowed(State_1.State.Opened);
        // Stop previously set timer 
        if (this._interval)
            clearInterval(this._interval);
        // Set a new timer
        this._interval = setInterval(function () { _this.onTimer(); }, this._timeout);
        _super.prototype.open.call(this, callback);
    };
    /**
     * Closes the component and all open connections, performs deinitialization
     * steps. Closure can only be done from opened state. Attempts to close
     * already closed component or in wrong order will cause exception.
     * @param callback a callback to report success or error in closing
     */
    CachedLogger.prototype.close = function (callback) {
        var _this = this;
        this.checkNewStateAllowed(State_1.State.Closed);
        // Stop previously set timer
        if (this._interval)
            clearInterval(this._interval);
        // Clear timer ID
        this._interval = null;
        if (this._cache.length > 0) {
            this.save(this._cache, function (err) {
                _this._cache = [];
                if (err)
                    callback(err);
                else
                    _super.prototype.close.call(_this, callback);
            });
        }
        else
            _super.prototype.close.call(this, callback);
    };
    /**
     * Writes a message to the log
     * @param level a log level - Fatal, Error, Warn, Info, Debug or Trace
     * @param component a component name
     * @param correlationId a correlationId
     * @param message a message objects
     */
    CachedLogger.prototype.log = function (level, component, correlationId, message) {
        if (this._level >= level) {
            this._cache.push(new LogEntry_1.LogEntry(level, component, new Date(), correlationId, message));
        }
    };
    CachedLogger.prototype.onTimer = function () {
        if (this._cache.length > 0) {
            var entries = this._cache;
            this._cache = [];
            this.save(entries, function (err) {
                if (err)
                    console.error(err);
            });
        }
    };
    return CachedLogger;
}(AbstractLogger_1.AbstractLogger));
exports.CachedLogger = CachedLogger;
