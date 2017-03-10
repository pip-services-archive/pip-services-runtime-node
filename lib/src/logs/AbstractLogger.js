"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var AbstractComponent_1 = require('../AbstractComponent');
var State_1 = require('../State');
var LogLevel_1 = require('../LogLevel');
var DynamicMap_1 = require('../portability/DynamicMap');
var AbstractLogger = (function (_super) {
    __extends(AbstractLogger, _super);
    function AbstractLogger(descriptor) {
        _super.call(this, descriptor);
        this.DefaultConfig = DynamicMap_1.DynamicMap.fromTuples("options.level", LogLevel_1.LogLevel.Info);
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
    AbstractLogger.prototype.configure = function (config) {
        this.checkNewStateAllowed(State_1.State.Configured);
        _super.prototype.configure.call(this, config.withDefaults(this.DefaultConfig));
        this._level = this.parseLevel(this._config.getOptions().get("level"));
    };
    /**
     * Parses log level from configuration file
     * @param level log level value
     * @return parsed log level
     */
    AbstractLogger.prototype.parseLevel = function (level) {
        if (level == null)
            return LogLevel_1.LogLevel.Info;
        level = level.toString().toUpperCase();
        if (level == "0" || level == "NOTHING" || level == "NONE")
            return LogLevel_1.LogLevel.None;
        else if (level == "1" || level == "FATAL")
            return LogLevel_1.LogLevel.Fatal;
        else if (level == "2" || level == "ERROR")
            return LogLevel_1.LogLevel.Error;
        else if (level == "3" || level == "WARN" || level == "WARNING")
            return LogLevel_1.LogLevel.Warn;
        else if (level == "4" || level == "INFO")
            return LogLevel_1.LogLevel.Info;
        else if (level == "5" || level == "DEBUG")
            return LogLevel_1.LogLevel.Debug;
        else if (level == "6" || level == "TRACE")
            return LogLevel_1.LogLevel.Trace;
        else
            return LogLevel_1.LogLevel.Info;
    };
    /**
     * Get the current level of details
     * @see LogLevel
     * @return returns the current log level
     */
    AbstractLogger.prototype.getLevel = function () {
        return this._level;
    };
    return AbstractLogger;
}(AbstractComponent_1.AbstractComponent));
exports.AbstractLogger = AbstractLogger;
