"use strict";
var assert = require('chai').assert;
var async = require('async');
var DynamicMap_1 = require('../../src/portability/DynamicMap');
var ComponentSet_1 = require('../../src/ComponentSet');
var ComponentConfig_1 = require('../../src/config/ComponentConfig');
var LifeCycleManager_1 = require('../../src/run/LifeCycleManager');
var NullLogger_1 = require('../../src/logs/NullLogger');
var NullCounters_1 = require('../../src/counters/NullCounters');
suite('LifeCycleManager', function () {
    var log = new NullLogger_1.NullLogger();
    log.configure(new ComponentConfig_1.ComponentConfig());
    var counters = new NullCounters_1.NullCounters();
    counters.configure(new ComponentConfig_1.ComponentConfig());
    var components = ComponentSet_1.ComponentSet.fromComponents(log, counters);
    var context = new DynamicMap_1.DynamicMap();
    test('Link', function (done) {
        LifeCycleManager_1.LifeCycleManager.link(context, components);
        done();
    });
    test('Link and Open', function (done) {
        LifeCycleManager_1.LifeCycleManager.linkAndOpen(context, components, function (err) {
            assert.isNull(err);
            done();
        });
    });
    test('Open', function (done) {
        LifeCycleManager_1.LifeCycleManager.link(context, components);
        LifeCycleManager_1.LifeCycleManager.open(components, function (err) {
            assert.isNull(err);
            done();
        });
    });
    test('Close', function (done) {
        LifeCycleManager_1.LifeCycleManager.linkAndOpen(context, components, function (err) {
            assert.isNull(err);
            LifeCycleManager_1.LifeCycleManager.close(components, function (err) {
                assert.isNull(err);
                done();
            });
        });
    });
    test('Force Close', function (done) {
        LifeCycleManager_1.LifeCycleManager.linkAndOpen(context, components, function (err) {
            assert.isNull(err);
            LifeCycleManager_1.LifeCycleManager.forceClose(components, function (err) {
                assert.isNull(err);
                done();
            });
        });
    });
});
