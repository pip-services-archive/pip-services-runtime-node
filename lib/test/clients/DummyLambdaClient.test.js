"use strict";
var _ = require('lodash');
var ComponentSet_1 = require('../../src/ComponentSet');
var ComponentConfig_1 = require('../../src/config/ComponentConfig');
var DynamicMap_1 = require('../../src/portability/DynamicMap');
var Category_1 = require('../../src/config/Category');
var ConfigReader_1 = require('../../src/config/ConfigReader');
var DummyLambdaClient_1 = require('./DummyLambdaClient');
var DummyClientFixture_1 = require('./DummyClientFixture');
var config = ConfigReader_1.ConfigReader.read('./config/config.yaml');
var clientConfigs = config.getSection(Category_1.Category.Clients) || [];
var lambdaConfig = _.find(clientConfigs, function (c) {
    return c.getDescriptor().getType() == 'lambda';
});
suite('DummyLambdaClient', function () {
    // Skip test if lambda is not configured
    if (lambdaConfig == null)
        return;
    var config = ComponentConfig_1.ComponentConfig.fromValue(lambdaConfig);
    var client = new DummyLambdaClient_1.DummyLambdaClient();
    client.configure(config);
    var fixture = new DummyClientFixture_1.DummyClientFixture(client);
    suiteSetup(function (done) {
        client.link(new DynamicMap_1.DynamicMap(), new ComponentSet_1.ComponentSet());
        client.open(done);
    });
    suiteTeardown(function (done) {
        client.close(done);
    });
    test('CRUD Operations', function (done) {
        fixture.testCrudOperations(done);
    });
});
