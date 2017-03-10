"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var Category_1 = require('../../src/config/Category');
var ComponentDescriptor_1 = require('../../src/config/ComponentDescriptor');
var SenecaService_1 = require('../../src/services/SenecaService');
var DummySenecaService = (function (_super) {
    __extends(DummySenecaService, _super);
    function DummySenecaService() {
        _super.call(this, DummySenecaService.Descriptor);
    }
    DummySenecaService.prototype.link = function (context, components) {
        this._logic = components.getOnePrior(this, new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.BusinessLogic, "pip-services-dummies", "*", "*"));
        _super.prototype.link.call(this, context, components);
        this.registerCommands('dummy', this._logic.getCommands());
    };
    /**
     * Unique descriptor for the DummySenecaService component
     */
    DummySenecaService.Descriptor = new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Services, "pip-services-dummies", "seneca", "1.0");
    return DummySenecaService;
}(SenecaService_1.SenecaService));
exports.DummySenecaService = DummySenecaService;
