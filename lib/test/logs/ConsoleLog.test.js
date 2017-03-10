"use strict";
var ComponentConfig_1 = require('../../src/config/ComponentConfig');
var ConsoleLogger_1 = require('../../src/logs/ConsoleLogger');
var LogFixture_1 = require('./LogFixture');
var LogLevel_1 = require('../../src/LogLevel');
suite('ConsoleLogger', function () {
    var log = new ConsoleLogger_1.ConsoleLogger();
    log.configure(ComponentConfig_1.ComponentConfig.fromTuples('options.level', LogLevel_1.LogLevel.Trace));
    var fixture = new LogFixture_1.LogFixture(log);
    test('Log Level', function () {
        fixture.testLogLevel();
    });
    test('Text Output', function () {
        fixture.testTextOutput();
    });
    test('Mixed Output', function () {
        fixture.testMixedOutput();
    });
});
