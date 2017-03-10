"use strict";
var Category_1 = require('../config/Category');
var LogLevel_1 = require('../LogLevel');
var LogFormatter_1 = require('../logs/LogFormatter');
/**
 * Utility logger to write messages to configured logs
 * or to console when no logs are found.
 * This logger is used in the microservice build/run process
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
var LogWriter = (function () {
    function LogWriter() {
    }
    /**
     * Writes a message to the all logs
     * @param components a list of microservice components to choose logs from
     * @param level a log level - Fatal, Error, Warn, Info, Debug or Trace
     * @param component a component name
     * @param correlationId a correlationId
     * @param message a message objects
     */
    LogWriter.log = function (components, level, component, correlationId, message) {
        var logged = false;
        // Output to all loggers
        if (components != null && components.length > 0) {
            for (var i = 0; i < components.length; i++) {
                var cref = components[i];
                if (Category_1.Category.Logs == cref.getDescriptor().getCategory()) {
                    var logger = cref;
                    logger.log(level, component, correlationId, message);
                    logged = true;
                }
            }
        }
        // If nothing was logged then write to console
        if (logged == false) {
            var output = LogFormatter_1.LogFormatter.format(level, message);
            if (correlationId != null)
                output += ", correlated to " + correlationId;
            if (level >= LogLevel_1.LogLevel.Fatal && level <= LogLevel_1.LogLevel.Warn)
                console.error(output);
            else
                console.log(output);
        }
    };
    LogWriter.fatal = function (components) {
        var message = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            message[_i - 1] = arguments[_i];
        }
        this.log(components, LogLevel_1.LogLevel.Fatal, null, null, message);
    };
    LogWriter.error = function (components) {
        var message = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            message[_i - 1] = arguments[_i];
        }
        this.log(components, LogLevel_1.LogLevel.Error, null, null, message);
    };
    LogWriter.warn = function (components) {
        var message = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            message[_i - 1] = arguments[_i];
        }
        this.log(components, LogLevel_1.LogLevel.Warn, null, null, message);
    };
    LogWriter.info = function (components) {
        var message = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            message[_i - 1] = arguments[_i];
        }
        this.log(components, LogLevel_1.LogLevel.Info, null, null, message);
    };
    LogWriter.debug = function (components) {
        var message = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            message[_i - 1] = arguments[_i];
        }
        this.log(components, LogLevel_1.LogLevel.Debug, null, null, message);
    };
    LogWriter.trace = function (components) {
        var message = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            message[_i - 1] = arguments[_i];
        }
        this.log(components, LogLevel_1.LogLevel.Trace, null, null, message);
    };
    return LogWriter;
}());
exports.LogWriter = LogWriter;
