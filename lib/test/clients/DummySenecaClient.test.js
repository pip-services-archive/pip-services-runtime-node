"use strict";
var _ = require('lodash');
var DummyMemoryPersistence_1 = require('../persistence/DummyMemoryPersistence');
var DummyController_1 = require('../logic/DummyController');
var DummySenecaService_1 = require('../services/DummySenecaService');
var DummySenecaClient_1 = require('./DummySenecaClient');
var ComponentSet_1 = require('../../src/ComponentSet');
var DynamicMap_1 = require('../../src/portability/DynamicMap');
var ComponentConfig_1 = require('../../src/config/ComponentConfig');
var LifeCycleManager_1 = require('../../src/run/LifeCycleManager');
var SenecaAddon_1 = require('../../src/addons/SenecaAddon');
var DummyClientFixture_1 = require('./DummyClientFixture');
suite('DummySenecaClient', function () {
    var db = new DummyMemoryPersistence_1.DummyMemoryPersistence();
    db.configure(new ComponentConfig_1.ComponentConfig());
    var ctrl = new DummyController_1.DummyController();
    ctrl.configure(new ComponentConfig_1.ComponentConfig());
    var service = new DummySenecaService_1.DummySenecaService();
    service.configure(new ComponentConfig_1.ComponentConfig());
    var client = new DummySenecaClient_1.DummySenecaClient();
    client.configure(new ComponentConfig_1.ComponentConfig());
    var seneca = new SenecaAddon_1.SenecaAddon();
    seneca.configure(new ComponentConfig_1.ComponentConfig());
    var components = ComponentSet_1.ComponentSet.fromComponents(db, ctrl, client, service, seneca);
    var fixture = new DummyClientFixture_1.DummyClientFixture(client);
    suiteSetup(function (done) {
        LifeCycleManager_1.LifeCycleManager.linkAndOpen(new DynamicMap_1.DynamicMap(), components, done);
    });
    suiteTeardown(function (done) {
        seneca.getSeneca().close(function () {
            LifeCycleManager_1.LifeCycleManager.close(components, done);
        });
    });
    setup(function (done) {
        db.clearTestData(done);
    });
    test('CRUD Operations', function (done) {
        fixture.testCrudOperations(done);
    });
});
