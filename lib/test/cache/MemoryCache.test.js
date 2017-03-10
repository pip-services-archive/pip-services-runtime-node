"use strict";
var async = require('async');
var assert = require('chai').assert;
var ComponentSet_1 = require('../../src/ComponentSet');
var DynamicMap_1 = require('../../src/portability/DynamicMap');
var ComponentConfig_1 = require('../../src/config/ComponentConfig');
var MemoryCache_1 = require('../../src/cache/MemoryCache');
var CacheFixture_1 = require('./CacheFixture');
suite('MemoryCache', function () {
    var cache = new MemoryCache_1.MemoryCache();
    cache.configure(ComponentConfig_1.ComponentConfig.fromTuples('options.timeout', 500));
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
    test('Read After Timeout', function (done) {
        async.series([
            function (callback) {
                cache.store('test', 123, function (err, value) {
                    assert.isNull(err);
                    assert.equal(value, 123);
                    callback();
                });
            },
            function (callback) {
                cache.retrieve('test', function (err, value) {
                    assert.isNull(err);
                    assert.equal(value, 123);
                    callback();
                });
            },
            function (callback) {
                setTimeout(function () {
                    cache.retrieve('test', function (err, value) {
                        assert.isNull(err);
                        assert.isNull(value);
                        callback();
                    });
                }, 1000);
            }
        ], done);
    });
});
