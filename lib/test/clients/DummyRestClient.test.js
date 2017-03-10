"use strict";
var _ = require('lodash');
var ComponentSet_1 = require('../../src/ComponentSet');
var DynamicMap_1 = require('../../src/portability/DynamicMap');
var ComponentConfig_1 = require('../../src/config/ComponentConfig');
var LifeCycleManager_1 = require('../../src/run/LifeCycleManager');
var DummyMemoryPersistence_1 = require('../persistence/DummyMemoryPersistence');
var DummyController_1 = require('../logic/DummyController');
var DummyRestService_1 = require('../services/DummyRestService');
var DummyRestClient_1 = require('./DummyRestClient');
var DummyClientFixture_1 = require('./DummyClientFixture');
var restConfig = ComponentConfig_1.ComponentConfig.fromTuples('endpoint.protocol', 'http', 'endpoint.host', 'localhost', 'endpoint.port', 3000);
suite('DummyRestClient', function () {
    var seneca;
    var db = new DummyMemoryPersistence_1.DummyMemoryPersistence();
    db.configure(new ComponentConfig_1.ComponentConfig());
    var ctrl = new DummyController_1.DummyController();
    ctrl.configure(new ComponentConfig_1.ComponentConfig());
    var service = new DummyRestService_1.DummyRestService();
    service.configure(restConfig);
    var client = new DummyRestClient_1.DummyRestClient();
    client.configure(restConfig);
    var components = ComponentSet_1.ComponentSet.fromComponents(db, ctrl, client, service);
    var fixture = new DummyClientFixture_1.DummyClientFixture(client);
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
        fixture.testCrudOperations(done);
    });
});
