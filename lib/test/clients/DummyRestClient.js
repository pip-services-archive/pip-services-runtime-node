"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var Category_1 = require('../../src/config/Category');
var ComponentDescriptor_1 = require('../../src/config/ComponentDescriptor');
var RestClient_1 = require('../../src/clients/RestClient');
var DummyRestClient = (function (_super) {
    __extends(DummyRestClient, _super);
    function DummyRestClient() {
        _super.call(this, DummyRestClient.Descriptor);
    }
    DummyRestClient.prototype.getDummies = function (correlationId, filter, paging, callback) {
        callback = this.instrument(correlationId, 'dummy.get_dummies', callback);
        var params = {};
        this.addFilterParams(params, filter);
        this.addPagingParams(params, paging);
        this.call('get', '/dummies', correlationId, params, callback);
    };
    DummyRestClient.prototype.getDummyById = function (correlationId, dummyId, callback) {
        callback = this.instrument(correlationId, 'dummy.get_dummy_by_id', callback);
        this.call('get', '/dummies/' + dummyId, correlationId, {}, callback);
    };
    DummyRestClient.prototype.createDummy = function (correlationId, dummy, callback) {
        callback = this.instrument(correlationId, 'dummy.create_dummy', callback);
        this.call('post', '/dummies', correlationId, {}, dummy, callback);
    };
    DummyRestClient.prototype.updateDummy = function (correlationId, dummyId, dummy, callback) {
        callback = this.instrument(correlationId, 'dummy.update_dummy', callback);
        this.call('put', '/dummies/' + dummyId, correlationId, {}, dummy, callback);
    };
    DummyRestClient.prototype.deleteDummy = function (correlationId, dummyId, callback) {
        callback = this.instrument(correlationId, 'dummy.delete_dummy', callback);
        this.call('delete', '/dummies/' + dummyId, correlationId, {}, callback);
    };
    /**
     * Unique descriptor for the DummyRestClient component
     */
    DummyRestClient.Descriptor = new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Clients, "pip-services-dummies", "rest", "1.0");
    return DummyRestClient;
}(RestClient_1.RestClient));
exports.DummyRestClient = DummyRestClient;
