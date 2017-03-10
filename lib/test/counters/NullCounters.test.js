"use strict";
var ComponentSet_1 = require('../../src/ComponentSet');
var ComponentConfig_1 = require('../../src/config/ComponentConfig');
var DynamicMap_1 = require('../../src/portability/DynamicMap');
var ConsoleLogger_1 = require('../../src/logs/ConsoleLogger');
var NullCounters_1 = require('../../src/counters/NullCounters');
suite('NullCounters', function () {
    var log = new ConsoleLogger_1.ConsoleLogger();
    log.configure(ComponentConfig_1.ComponentConfig.fromTuples('options.level', 5));
    var counters = new NullCounters_1.NullCounters();
    counters.configure(ComponentConfig_1.ComponentConfig.fromTuples('options.timeout', 60000));
    suiteSetup(function (done) {
        var components = ComponentSet_1.ComponentSet.fromComponents(log, counters);
        counters.link(new DynamicMap_1.DynamicMap(), components);
        counters.open(done);
    });
    suiteTeardown(function (done) {
        counters.close(done);
    });
    test('Simple Counters', function () {
        counters.last('Test.LastValue', 123);
        counters.increment('Test.Increment', 3);
        counters.stats('Test.Statistics', 123);
    });
    test('Measure Elapsed Time', function () {
        var timer = counters.beginTiming('Test.Elapsed');
        timer.endTiming();
    });
});
