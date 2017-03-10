"use strict";
var DynamicMap_1 = require('../../src/portability/DynamicMap');
var ComponentSet_1 = require('../../src/ComponentSet');
var ComponentConfig_1 = require('../../src/config/ComponentConfig');
var DummyFilePersistence_1 = require('./DummyFilePersistence');
var DummyPersistenceFixture_1 = require('./DummyPersistenceFixture');
var config = ComponentConfig_1.ComponentConfig.fromValue({
    options: {
        path: './data/dummies.json',
        data: []
    }
});
suite('DummyFilePersistence', function () {
    var db, fixture;
    suiteSetup(function (done) {
        db = new DummyFilePersistence_1.DummyFilePersistence();
        db.configure(config);
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
