"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var Category_1 = require('../../src/config/Category');
var ComponentDescriptor_1 = require('../../src/config/ComponentDescriptor');
var MongoDbPersistence_1 = require('../../src/persistence/MongoDbPersistence');
var DummyMongoDbPersistence = (function (_super) {
    __extends(DummyMongoDbPersistence, _super);
    function DummyMongoDbPersistence() {
        _super.call(this, DummyMongoDbPersistence.Descriptor, require('./DummyModel'));
    }
    DummyMongoDbPersistence.prototype.getDummies = function (correlationId, filter, paging, callback) {
        var criteria = filter.pick('key');
        this.getPage(correlationId, criteria, paging, null, null, callback);
    };
    DummyMongoDbPersistence.prototype.getDummyById = function (correlationId, dummyId, callback) {
        this.getById(correlationId, dummyId, callback);
    };
    DummyMongoDbPersistence.prototype.createDummy = function (correlationId, dummy, callback) {
        this.create(correlationId, dummy, callback);
    };
    DummyMongoDbPersistence.prototype.updateDummy = function (correlationId, dummyId, dummy, callback) {
        this.update(correlationId, dummyId, dummy, callback);
    };
    DummyMongoDbPersistence.prototype.deleteDummy = function (correlationId, dummyId, callback) {
        this.delete(correlationId, dummyId, callback);
    };
    /**
     * Unique descriptor for the DummyMongoDbPersistence component
     */
    DummyMongoDbPersistence.Descriptor = new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Persistence, "pip-services-dummies", "mongodb", "*");
    return DummyMongoDbPersistence;
}(MongoDbPersistence_1.MongoDbPersistence));
exports.DummyMongoDbPersistence = DummyMongoDbPersistence;
