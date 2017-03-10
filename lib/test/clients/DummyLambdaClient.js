"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var Category_1 = require('../../src/config/Category');
var ComponentDescriptor_1 = require('../../src/config/ComponentDescriptor');
var LambdaClient_1 = require('../../src/clients/LambdaClient');
var DummyLambdaClient = (function (_super) {
    __extends(DummyLambdaClient, _super);
    function DummyLambdaClient() {
        _super.call(this, DummyLambdaClient.Descriptor);
    }
    DummyLambdaClient.prototype.getDummies = function (correlationId, filter, paging, callback) {
        callback = this.instrument(correlationId, 'dummy.get_dummies', callback);
        this.call('get_dummies', correlationId, {
            filter: filter ? filter.toObject() : null,
            paging: paging ? paging.toObject() : null
        }, callback);
    };
    DummyLambdaClient.prototype.getDummyById = function (correlationId, dummyId, callback) {
        callback = this.instrument(correlationId, 'dummy.get_dummy_by_id', callback);
        this.call('get_dummy_by_id', correlationId, {
            dummy_id: dummyId
        }, callback);
    };
    DummyLambdaClient.prototype.createDummy = function (correlationId, dummy, callback) {
        callback = this.instrument(correlationId, 'dummy.create_dummy', callback);
        this.call('create_dummy', correlationId, {
            dummy: dummy
        }, callback);
    };
    DummyLambdaClient.prototype.updateDummy = function (correlationId, dummyId, dummy, callback) {
        callback = this.instrument(correlationId, 'dummy.update_dummy', callback);
        this.call('update_dummy', correlationId, {
            dummy_id: dummyId,
            dummy: dummy
        }, callback);
    };
    DummyLambdaClient.prototype.deleteDummy = function (correlationId, dummyId, callback) {
        callback = this.instrument(correlationId, 'dummy.delete_dummy', callback);
        this.call('delete_dummy', correlationId, {
            dummy_id: dummyId
        }, callback);
    };
    /**
     * Unique descriptor for the DummyLambdaClient component
     */
    DummyLambdaClient.Descriptor = new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Clients, "pip-services-dummies", "lambda", "1.0");
    return DummyLambdaClient;
}(LambdaClient_1.LambdaClient));
exports.DummyLambdaClient = DummyLambdaClient;
