"use strict";
var LogLevel_1 = require('../LogLevel');
var LogFormatter = (function () {
    function LogFormatter() {
    }
    LogFormatter.formatLevel = function (level) {
        switch (level) {
            case LogLevel_1.LogLevel.Fatal: return "FATAL";
            case LogLevel_1.LogLevel.Error: return "ERROR";
            case LogLevel_1.LogLevel.Warn: return "WARN";
            case LogLevel_1.LogLevel.Info: return "INFO";
            case LogLevel_1.LogLevel.Debug: return "DEBUG";
            case LogLevel_1.LogLevel.Trace: return "TRACE";
            default: return "UNDEF";
        }
    };
    LogFormatter.formatMessage = function (message) {
        if (message == null || message.length == 0)
            return "";
        if (message.length == 1)
            return "" + message[0];
        var output = "" + message[0];
        for (var i = 1; i < message.length; i++)
            output += "," + message[i];
        return output;
    };
    LogFormatter.format = function (level, message) {
        return new Date().toISOString()
            + ' ' + this.formatLevel(level)
            + ' ' + this.formatMessage(message);
    };
    return LogFormatter;
}());
exports.LogFormatter = LogFormatter;
