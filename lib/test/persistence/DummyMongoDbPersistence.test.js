"use strict";
var ComponentSet_1 = require('../../src/ComponentSet');
var Category_1 = require('../../src/config/Category');
var ConfigReader_1 = require('../../src/config/ConfigReader');
var DynamicMap_1 = require('../../src/portability/DynamicMap');
var DummyMongoDbPersistence_1 = require('./DummyMongoDbPersistence');
var DummyPersistenceFixture_1 = require('./DummyPersistenceFixture');
var config = ConfigReader_1.ConfigReader.read('./config/config.yaml');
var dbConfigs = config.getSection(Category_1.Category.Persistence) || [];
var dbConfig = dbConfigs.length == 1 ? dbConfigs[0] : null;
suite('DummyMongoDbPersistence', function () {
    // Skip test if mongodb is not configured
    if (dbConfig == null || dbConfig.getDescriptor().getType() != 'mongodb')
        return;
    var db = new DummyMongoDbPersistence_1.DummyMongoDbPersistence();
    db.configure(dbConfig);
    var fixture = new DummyPersistenceFixture_1.DummyPersistenceFixture(db);
    suiteSetup(function (done) {
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
