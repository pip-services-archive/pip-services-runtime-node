"use strict";
var _ = require('lodash');
var async = require('async');
var restify = require('restify');
var assert = require('chai').assert;
var DynamicMap_1 = require('../../src/portability/DynamicMap');
var ComponentSet_1 = require('../../src/ComponentSet');
var ComponentConfig_1 = require('../../src/config/ComponentConfig');
var DummyMemoryPersistence_1 = require('../persistence/DummyMemoryPersistence');
var DummyController_1 = require('../logic/DummyController');
var DummyRestService_1 = require('./DummyRestService');
var LifeCycleManager_1 = require('../../src/run/LifeCycleManager');
var restConfig = ComponentConfig_1.ComponentConfig.fromTuples('endpoint.host', 'localhost', 'endpoint.port', 3000);
var DUMMY1 = {
    key: 'Key 1',
    content: 'Content 1'
};
var DUMMY2 = {
    key: 'Key 2',
    content: 'Content 2'
};
suite('DummyRestService', function () {
    var db = new DummyMemoryPersistence_1.DummyMemoryPersistence();
    db.configure(new ComponentConfig_1.ComponentConfig());
    var ctrl = new DummyController_1.DummyController();
    ctrl.configure(new ComponentConfig_1.ComponentConfig());
    var service = new DummyRestService_1.DummyRestService();
    service.configure(restConfig);
    var components = ComponentSet_1.ComponentSet.fromComponents(db, ctrl, service);
    var url = 'http://localhost:' + restConfig.getEndpoint().getPort();
    var rest = restify.createJsonClient({ url: url, version: '*' });
    suiteSetup(function (done) {
        LifeCycleManager_1.LifeCycleManager.linkAndOpen(new DynamicMap_1.DynamicMap(), components, done);
    });
    suiteTeardown(function (done) {
        LifeCycleManager_1.LifeCycleManager.close(components, done);
    });
    setup(function (done) {
        db.clearTestData(done);
    });
    test('CRUD Operations', function (done) {
        var dummy1, dummy2;
        async.series([
            // Create one dummy
            function (callback) {
                rest.post('/dummies', DUMMY1, function (err, req, res, dummy) {
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
                rest.post('/dummies', DUMMY2, function (err, req, res, dummy) {
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
                rest.get('/dummies', function (err, req, res, dummies) {
                    assert.isNull(err);
                    assert.isObject(dummies);
                    assert.lengthOf(dummies.data, 2);
                    callback();
                });
            },
            // Update the dummy
            function (callback) {
                rest.put('/dummies/' + dummy1.id, { content: 'Updated Content 1' }, function (err, req, res, dummy) {
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
                rest.del('/dummies/' + dummy1.id, function (err, req, res) {
                    assert.isNull(err);
                    callback();
                });
            },
            // Try to get delete dummy
            function (callback) {
                rest.get('/dummies/' + dummy1.id, function (err, req, res, dummy) {
                    assert.isNull(err);
                    // assert.isObject(dummy);
                    callback();
                });
            }
        ], done);
    });
});
