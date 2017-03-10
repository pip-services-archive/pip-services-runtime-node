"use strict";
var async = require('async');
var assert = require('chai').assert;
var FilterParams_1 = require('../../src/data/FilterParams');
var PagingParams_1 = require('../../src/data/PagingParams');
var DUMMY1 = {
    key: 'Key 1',
    content: 'Content 1'
};
var DUMMY2 = {
    key: 'Key 2',
    content: 'Content 2'
};
var DummyPersistenceFixture = (function () {
    function DummyPersistenceFixture(db) {
        assert.isNotNull(db);
        this._db = db;
    }
    DummyPersistenceFixture.prototype.testCrudOperations = function (done) {
        var _this = this;
        var dummy1, dummy2;
        async.series([
            // Create one dummy
            function (callback) {
                _this._db.createDummy(null, DUMMY1, function (err, dummy) {
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
                _this._db.createDummy(null, DUMMY2, function (err, dummy) {
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
                _this._db.getDummies(null, new FilterParams_1.FilterParams(), new PagingParams_1.PagingParams(), function (err, dummies) {
                    assert.isNull(err);
                    assert.isObject(dummies);
                    assert.lengthOf(dummies.data, 2);
                    callback();
                });
            },
            // Update the dummy
            function (callback) {
                _this._db.updateDummy(null, dummy1.id, { content: 'Updated Content 1' }, function (err, dummy) {
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
                _this._db.deleteDummy(null, dummy1.id, function (err) {
                    assert.isNull(err);
                    callback();
                });
            },
            // Try to get deleted dummy
            function (callback) {
                _this._db.getDummyById(null, dummy1.id, function (err, dummy) {
                    assert.isNull(err);
                    assert.isNull(dummy || null);
                    callback();
                });
            }
        ], done);
    };
    return DummyPersistenceFixture;
}());
exports.DummyPersistenceFixture = DummyPersistenceFixture;
