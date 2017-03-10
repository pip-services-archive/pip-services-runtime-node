"use strict";
var async = require('async');
var assert = require('chai').assert;
var CacheFixture = (function () {
    function CacheFixture(cache) {
        assert.isNotNull(cache);
        this._cache = cache;
    }
    CacheFixture.prototype.testBasicOperations = function (done) {
        var _this = this;
        async.series([
            // Set the first value
            function (callback) {
                _this._cache.store('test', 123, function (err, value) {
                    assert.isNull(err);
                    assert.equal(123, value);
                    callback();
                });
            },
            // Get the first value
            function (callback) {
                _this._cache.retrieve('test', function (err, value) {
                    assert.isNull(err);
                    assert.equal(123, value);
                    callback();
                });
            },
            // Set null value
            function (callback) {
                _this._cache.store('test', null, function (err, value) {
                    assert.isNull(err);
                    assert.isNull(value);
                    callback();
                });
            },
            // Get null value
            function (callback) {
                _this._cache.retrieve('test', function (err, value) {
                    assert.isNull(err);
                    assert.isNull(value);
                    callback();
                });
            },
            // Set the second value
            function (callback) {
                _this._cache.store('test', 'ABC', function (err, value) {
                    assert.isNull(err);
                    assert.equal('ABC', value);
                    callback();
                });
            },
            // Get the second value
            function (callback) {
                _this._cache.retrieve('test', function (err, value) {
                    assert.isNull(err);
                    assert.equal('ABC', value);
                    callback();
                });
            },
            // Unset value
            function (callback) {
                _this._cache.remove('test', function (err) {
                    assert.isNull(err);
                    callback();
                });
            },
            // Check unset value
            function (callback) {
                _this._cache.retrieve('test', function (err, value) {
                    assert.isNull(err);
                    assert.isNull(value);
                    callback();
                });
            }
        ], done);
    };
    return CacheFixture;
}());
exports.CacheFixture = CacheFixture;
