"use strict";
/**
 * Logging levels to determine details of logged messages
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-05-01
 */
(function (LogLevel) {
    /**
     * Nothing to be logged
     */
    LogLevel[LogLevel["None"] = 0] = "None";
    /**
     * Logs only fatal errors that cause microservice to fail
     */
    LogLevel[LogLevel["Fatal"] = 1] = "Fatal";
    /**
     * Logs all errors - fatal or recoverable
     */
    LogLevel[LogLevel["Error"] = 2] = "Error";
    /**
     * Logs errors and warnings
     */
    LogLevel[LogLevel["Warn"] = 3] = "Warn";
    /**
     * Logs errors and important information messages
     */
    LogLevel[LogLevel["Info"] = 4] = "Info";
    /**
     * Logs everything up to high-level debugging information
     */
    LogLevel[LogLevel["Debug"] = 5] = "Debug";
    /**
     * Logs everything down to fine-granular debugging messages
     */
    LogLevel[LogLevel["Trace"] = 6] = "Trace";
})(exports.LogLevel || (exports.LogLevel = {}));
var LogLevel = exports.LogLevel;
