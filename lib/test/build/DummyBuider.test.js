"use strict";
var assert = require('chai').assert;
var async = require('async');
var MicroserviceConfig_1 = require('../../src/config/MicroserviceConfig');
var ConfigReader_1 = require('../../src/config/ConfigReader');
var Builder_1 = require('../../src/build/Builder');
var DummyFactory_1 = require('./DummyFactory');
var buildConfig = MicroserviceConfig_1.MicroserviceConfig.fromTuples("logs.descriptor.type", "console", "counters.descriptor.type", "log", "cache.descriptor.type", "memory", "persistence.descriptor.type", "file", "persistence.options.path", "dummies.json", "persistence.options.data", [], "controllers.descriptor.type", "*", "services.descriptor.type", "rest", "services.descriptor.version", "1.0", "services.endpoint.port", 3000);
suite('Builder', function () {
    test('Build Defaults', function (done) {
        var config = new MicroserviceConfig_1.MicroserviceConfig();
        var components = Builder_1.Builder.build(DummyFactory_1.DummyFactory.Instance, config);
        assert.lengthOf(components.getAllOrdered(), 3);
        done();
    });
    test('Build with Config', function (done) {
        var config = buildConfig;
        var components = Builder_1.Builder.build(DummyFactory_1.DummyFactory.Instance, config);
        assert.lengthOf(components.getAllOrdered(), 6);
        done();
    });
    test('Build with File', function (done) {
        var config = ConfigReader_1.ConfigReader.read('./test/build/config.json');
        var components = Builder_1.Builder.build(DummyFactory_1.DummyFactory.Instance, config);
        assert.lengthOf(components.getAllOrdered(), 7);
        done();
    });
});
