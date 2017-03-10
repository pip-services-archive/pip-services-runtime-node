"use strict";
var ComponentConfig_1 = require('../../src/config/ComponentConfig');
var NullLogger_1 = require('../../src/logs/NullLogger');
var LogFixture_1 = require('./LogFixture');
suite('NullLogger', function () {
    var log = new NullLogger_1.NullLogger();
    log.configure(new ComponentConfig_1.ComponentConfig());
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
