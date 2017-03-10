"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var Category_1 = require('../../src/config/Category');
var ComponentDescriptor_1 = require('../../src/config/ComponentDescriptor');
var SenecaClient_1 = require('../../src/clients/SenecaClient');
var DummySenecaClient = (function (_super) {
    __extends(DummySenecaClient, _super);
    function DummySenecaClient() {
        _super.call(this, DummySenecaClient.Descriptor);
    }
    DummySenecaClient.prototype.getDummies = function (correlationId, filter, paging, callback) {
        callback = this.instrument(correlationId, 'dummy.get_dummies', callback);
        this.call('dummy', 'get_dummies', correlationId, {
            filter: filter ? filter.toObject() : null,
            paging: paging ? paging.toObject() : null
        }, callback);
    };
    DummySenecaClient.prototype.getDummyById = function (correlationId, dummyId, callback) {
        callback = this.instrument(correlationId, 'dummy.get_dummy_by_id', callback);
        this.call('dummy', 'get_dummy_by_id', correlationId, {
            dummy_id: dummyId
        }, callback);
    };
    DummySenecaClient.prototype.createDummy = function (correlationId, dummy, callback) {
        callback = this.instrument(correlationId, 'dummy.create_dummy', callback);
        this.call('dummy', 'create_dummy', correlationId, {
            dummy: dummy
        }, callback);
    };
    DummySenecaClient.prototype.updateDummy = function (correlationId, dummyId, dummy, callback) {
        callback = this.instrument(correlationId, 'dummy.update_dummy', callback);
        this.call('dummy', 'update_dummy', correlationId, {
            dummy_id: dummyId,
            dummy: dummy
        }, callback);
    };
    DummySenecaClient.prototype.deleteDummy = function (correlationId, dummyId, callback) {
        callback = this.instrument(correlationId, 'dummy.delete_dummy', callback);
        this.call('dummy', 'delete_dummy', correlationId, {
            dummy_id: dummyId
        }, callback);
    };
    /**
     * Unique descriptor for the DummySenecaClient component
     */
    DummySenecaClient.Descriptor = new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Clients, "pip-services-dummies", "seneca", "1.0");
    return DummySenecaClient;
}(SenecaClient_1.SenecaClient));
exports.DummySenecaClient = DummySenecaClient;
