"use strict";
var ComponentSet_1 = require('../../src/ComponentSet');
var ComponentConfig_1 = require('../../src/config/ComponentConfig');
var ConsoleLogger_1 = require('../../src/logs/ConsoleLogger');
var LogCounters_1 = require('../../src/counters/LogCounters');
var DynamicMap_1 = require('../../src/portability/DynamicMap');
var CountersFixture_1 = require('./CountersFixture');
suite('LogCounters', function () {
    var log = new ConsoleLogger_1.ConsoleLogger();
    log.configure(ComponentConfig_1.ComponentConfig.fromTuples('options.level', 5));
    var counters = new LogCounters_1.LogCounters();
    counters.configure(ComponentConfig_1.ComponentConfig.fromTuples('options.timeout', 60000));
    var fixture = new CountersFixture_1.CountersFixture(counters);
    suiteSetup(function (done) {
        var components = ComponentSet_1.ComponentSet.fromComponents(log, counters);
        counters.link(new DynamicMap_1.DynamicMap(), components);
        counters.open(done);
    });
    suiteTeardown(function (done) {
        counters.close(done);
    });
    test('Simple Counters', function () {
        fixture.testSimpleCounters();
    });
    test('Measure Elapsed Time', function (done) {
        fixture.testElapsedTime(done);
    });
});
