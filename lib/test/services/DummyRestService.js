"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var Category_1 = require('../../src/config/Category');
var ComponentDescriptor_1 = require('../../src/config/ComponentDescriptor');
var RestService_1 = require('../../src/services/RestService');
var FilterParams_1 = require('../../src/data/FilterParams');
var PagingParams_1 = require('../../src/data/PagingParams');
var DummyRestService = (function (_super) {
    __extends(DummyRestService, _super);
    function DummyRestService() {
        _super.call(this, DummyRestService.Descriptor);
    }
    DummyRestService.prototype.link = function (context, components) {
        this._logic = components.getOnePrior(this, new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.BusinessLogic, "pip-services-dummies", "*", "*"));
        _super.prototype.link.call(this, context, components);
    };
    DummyRestService.prototype.getDummies = function (req, res) {
        this._logic.getDummies(req.params.correlation_id, new FilterParams_1.FilterParams(req.params), new PagingParams_1.PagingParams(req.params), this.sendResult(req, res));
    };
    DummyRestService.prototype.getDummyById = function (req, res) {
        this._logic.getDummyById(req.params.correlation_id, req.params.dummyId, this.sendResult(req, res));
    };
    DummyRestService.prototype.createDummy = function (req, res) {
        this._logic.createDummy(req.params.correlation_id, req.body, this.sendCreatedResult(req, res));
    };
    DummyRestService.prototype.updateDummy = function (req, res) {
        this._logic.updateDummy(req.params.correlation_id, req.params.dummyId, req.body, this.sendResult(req, res));
    };
    DummyRestService.prototype.deleteDummy = function (req, res) {
        this._logic.deleteDummy(req.params.correlation_id, req.params.dummyId, this.sendDeletedResult(req, res));
    };
    DummyRestService.prototype.register = function () {
        this.registerRoute('get', '/dummies', this.getDummies);
        this.registerRoute('get', '/dummies/:dummyId', this.getDummyById);
        this.registerRoute('post', '/dummies', this.createDummy);
        this.registerRoute('put', '/dummies/:dummyId', this.updateDummy);
        this.registerRoute('delete', '/dummies/:dummyId', this.deleteDummy);
    };
    /**
     * Unique descriptor for the DummyRestService component
     */
    DummyRestService.Descriptor = new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Services, "pip-services-dummies", "rest", "1.0");
    return DummyRestService;
}(RestService_1.RestService));
exports.DummyRestService = DummyRestService;
