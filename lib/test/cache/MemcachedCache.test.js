"use strict";
var async = require('async');
var assert = require('chai').assert;
var ComponentSet_1 = require('../../src/ComponentSet');
var DynamicMap_1 = require('../../src/portability/DynamicMap');
var ComponentConfig_1 = require('../../src/config/ComponentConfig');
var MemcachedCache_1 = require('../../src/cache/MemcachedCache');
var CacheFixture_1 = require('./CacheFixture');
suite.skip('MemcachedCache', function () {
    var cache = new MemcachedCache_1.MemcachedCache();
    cache.configure(ComponentConfig_1.ComponentConfig.fromTuples('endpoint.host', 'localhost', 'endpoint.port', 11211, 'options.timeout', 500));
    var fixture = new CacheFixture_1.CacheFixture(cache);
    suiteSetup(function (done) {
        cache.link(new DynamicMap_1.DynamicMap(), new ComponentSet_1.ComponentSet());
        cache.open(done);
    });
    suiteTeardown(function (done) {
        cache.close(done);
    });
    test('Basic Operations', function (done) {
        fixture.testBasicOperations(done);
    });
});
