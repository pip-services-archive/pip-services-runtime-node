"use strict";
var _ = require('lodash');
var async = require('async');
var assert = require('chai').assert;
var DynamicMap_1 = require('../../src/portability/DynamicMap');
var ComponentSet_1 = require('../../src/ComponentSet');
var ComponentConfig_1 = require('../../src/config/ComponentConfig');
var SenecaAddon_1 = require('../../src/addons/SenecaAddon');
var DummyMemoryPersistence_1 = require('../persistence/DummyMemoryPersistence');
var DummyController_1 = require('../logic/DummyController');
var DummySenecaService_1 = require('./DummySenecaService');
var LifeCycleManager_1 = require('../../src/run/LifeCycleManager');
var DUMMY1 = {
    key: 'Key 1',
    content: 'Content 1'
};
var DUMMY2 = {
    key: 'Key 2',
    content: 'Content 2'
};
suite('DummySenecaService', function () {
    var db = new DummyMemoryPersistence_1.DummyMemoryPersistence();
    db.configure(new ComponentConfig_1.ComponentConfig());
    var ctrl = new DummyController_1.DummyController();
    ctrl.configure(new ComponentConfig_1.ComponentConfig());
    var service = new DummySenecaService_1.DummySenecaService();
    service.configure(new ComponentConfig_1.ComponentConfig());
    var seneca = new SenecaAddon_1.SenecaAddon();
    seneca.configure(new ComponentConfig_1.ComponentConfig());
    var components = ComponentSet_1.ComponentSet.fromComponents(db, ctrl, service, seneca);
    suiteSetup(function (done) {
        LifeCycleManager_1.LifeCycleManager.linkAndOpen(new DynamicMap_1.DynamicMap(), components, done);
    });
    suiteTeardown(function (done) {
        seneca.close(function () {
            LifeCycleManager_1.LifeCycleManager.close(components, done);
        });
    });
    setup(function (done) {
        db.clearTestData(done);
    });
    test('CRUD Operations', function (done) {
        var dummy1, dummy2;
        async.series([
            // Create one dummy
            function (callback) {
                seneca.getSeneca().act({
                    role: 'dummy',
                    cmd: 'create_dummy',
                    dummy: DUMMY1
                }, function (err, dummy) {
                    assert.isNull(err);
                    assert.isObject(dummy);
                    assert.equal(dummy.content, DUMMY1.content);
                    assert.equal(dummy.key, DUMMY1.key);
                    dummy1 = dummy;
                    callback();
                });
            },
            // Create another dummy
            function (callback) {
                seneca.getSeneca().act({
                    role: 'dummy',
                    cmd: 'create_dummy',
                    dummy: DUMMY2
                }, function (err, dummy) {
                    assert.isNull(err);
                    assert.isObject(dummy);
                    assert.equal(dummy.content, DUMMY2.content);
                    assert.equal(dummy.key, DUMMY2.key);
                    dummy2 = dummy;
                    callback();
                });
            },
            // Get all dummies
            function (callback) {
                seneca.getSeneca().act({
                    role: 'dummy',
                    cmd: 'get_dummies'
                }, function (err, dummies) {
                    assert.isNull(err);
                    assert.isObject(dummies);
                    assert.lengthOf(dummies.data, 2);
                    callback();
                });
            },
            // Update the dummy
            function (callback) {
                seneca.getSeneca().act({
                    role: 'dummy',
                    cmd: 'update_dummy',
                    dummy_id: dummy1.id,
                    dummy: { content: 'Updated Content 1' }
                }, function (err, dummy) {
                    assert.isNull(err);
                    assert.isObject(dummy);
                    assert.equal(dummy.content, 'Updated Content 1');
                    assert.equal(dummy.key, DUMMY1.key);
                    dummy1 = dummy;
                    callback();
                });
            },
            // Delete dummy
            function (callback) {
                seneca.getSeneca().act({
                    role: 'dummy',
                    cmd: 'delete_dummy',
                    dummy_id: dummy1.id
                }, function (err) {
                    assert.isNull(err);
                    callback();
                });
            },
            // Try to get delete dummy
            function (callback) {
                seneca.getSeneca().act({
                    role: 'dummy',
                    cmd: 'get_dummy_by_id',
                    dummy_id: dummy1.id
                }, function (err, dummy) {
                    assert.isNull(err);
                    assert.isNull(dummy || null);
                    callback();
                });
            }
        ], done);
    });
});
