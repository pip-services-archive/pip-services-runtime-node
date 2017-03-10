"use strict";
var LogEntry = (function () {
    function LogEntry(level, component, time, correlationId, message) {
        this.level = level;
        this.component = component;
        this.time = time || new Date();
        this.correlation_id = correlationId;
        this.message = message;
    }
    return LogEntry;
}());
exports.LogEntry = LogEntry;
