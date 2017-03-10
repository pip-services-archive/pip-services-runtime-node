"use strict";
var assert = require('chai').assert;
var LogLevel_1 = require('../../src/LogLevel');
var LogFixture = (function () {
    function LogFixture(logger) {
        assert.isNotNull(logger);
        this._logger = logger;
    }
    LogFixture.prototype.testLogLevel = function () {
        assert.isDefined(this._logger.getLevel);
    };
    LogFixture.prototype.testTextOutput = function () {
        this._logger.log(LogLevel_1.LogLevel.Fatal, 'ABC', '12345678', ['Fatal error...']);
        this._logger.log(LogLevel_1.LogLevel.Error, 'ABC', '12345678', ['Recoverable error...']);
        this._logger.log(LogLevel_1.LogLevel.Warn, 'ABC', '12345678', ['Warning...']);
        this._logger.log(LogLevel_1.LogLevel.Info, 'ABC', '12345678', ['Information message...']);
        this._logger.log(LogLevel_1.LogLevel.Debug, 'ABC', '12345678', ['Debug message...']);
        this._logger.log(LogLevel_1.LogLevel.Trace, 'ABC', '12345678', ['Detail debug message...']);
    };
    LogFixture.prototype.testMixedOutput = function () {
        this._logger.log(LogLevel_1.LogLevel.Fatal, 'ABC', '12345678', [123, 'ABC', { abc: 'ABC' }]);
        this._logger.log(LogLevel_1.LogLevel.Error, 'ABC', '12345678', [123, 'ABC', { abc: 'ABC' }]);
        this._logger.log(LogLevel_1.LogLevel.Warn, 'ABC', '12345678', [123, 'ABC', { abc: 'ABC' }]);
        this._logger.log(LogLevel_1.LogLevel.Info, 'ABC', '12345678', [123, 'ABC', { abc: 'ABC' }]);
        this._logger.log(LogLevel_1.LogLevel.Debug, 'ABC', '12345678', [123, 'ABC', { abc: 'ABC' }]);
        this._logger.log(LogLevel_1.LogLevel.Trace, 'ABC', '12345678', [123, 'ABC', { abc: 'ABC' }]);
    };
    return LogFixture;
}());
exports.LogFixture = LogFixture;
