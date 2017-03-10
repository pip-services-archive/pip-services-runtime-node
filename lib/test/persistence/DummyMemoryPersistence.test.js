"use strict";
var DynamicMap_1 = require('../../src/portability/DynamicMap');
var ComponentSet_1 = require('../../src/ComponentSet');
var ComponentConfig_1 = require('../../src/config/ComponentConfig');
var DummyMemoryPersistence_1 = require('./DummyMemoryPersistence');
var DummyPersistenceFixture_1 = require('./DummyPersistenceFixture');
suite('DummyMemoryPersistence', function () {
    var db, fixture;
    suiteSetup(function (done) {
        db = new DummyMemoryPersistence_1.DummyMemoryPersistence();
        db.configure(new ComponentConfig_1.ComponentConfig());
        fixture = new DummyPersistenceFixture_1.DummyPersistenceFixture(db);
        db.link(new DynamicMap_1.DynamicMap(), new ComponentSet_1.ComponentSet());
        db.open(done);
    });
    suiteTeardown(function (done) {
        db.close(done);
    });
    setup(function (done) {
        db.clearTestData(done);
    });
    test('CRUD Operations', function (done) {
        fixture.testCrudOperations(done);
    });
});
