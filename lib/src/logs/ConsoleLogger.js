"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Category_1 = require('../config/Category');
var ComponentDescriptor_1 = require('../config/ComponentDescriptor');
var AbstractLogger_1 = require('./AbstractLogger');
var LogLevel_1 = require('../LogLevel');
var LogFormatter_1 = require('./LogFormatter');
var ConsoleLogger = (function (_super) {
    __extends(ConsoleLogger, _super);
    function ConsoleLogger() {
        _super.call(this, ConsoleLogger.Descriptor);
    }
    /**
     * Writes a message to the log
     * @param level a log level - Fatal, Error, Warn, Info, Debug or Trace
     * @param component a component name
     * @param correlationId a correlationId
     * @param message a message objects
     */
    ConsoleLogger.prototype.log = function (level, component, correlationId, message) {
        if (this.getLevel() < level)
            return;
        var output = LogFormatter_1.LogFormatter.format(level, message);
        if (correlationId != null)
            output += ", correlated to " + correlationId;
        if (level >= LogLevel_1.LogLevel.Fatal && level <= LogLevel_1.LogLevel.Warn)
            console.error(output);
        else
            console.log(output);
    };
    /**
     * Unique descriptor for the ConsoleLogger component
     */
    ConsoleLogger.Descriptor = new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Logs, "pip-services-runtime-log", "console", "*");
    return ConsoleLogger;
}(AbstractLogger_1.AbstractLogger));
exports.ConsoleLogger = ConsoleLogger;
