"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Category_1 = require('../config/Category');
var ComponentDescriptor_1 = require('../config/ComponentDescriptor');
var AbstractLogger_1 = require('./AbstractLogger');
var NullLogger = (function (_super) {
    __extends(NullLogger, _super);
    function NullLogger() {
        _super.call(this, NullLogger.Descriptor);
    }
    /**
     * Writes a message to the log
     * @param level a log level - Fatal, Error, Warn, Info, Debug or Trace
     * @param component a component name
     * @param correlationId a correlationId
     * @param message a message objects
     */
    NullLogger.prototype.log = function (level, component, correlationId, message) { };
    /**
     * Unique descriptor for the NullLogger component
     */
    NullLogger.Descriptor = new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Logs, "pip-services-runtime-log", "null", "*");
    return NullLogger;
}(AbstractLogger_1.AbstractLogger));
exports.NullLogger = NullLogger;
