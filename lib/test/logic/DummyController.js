"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Category_1 = require('../../src/config/Category');
var ComponentDescriptor_1 = require('../../src/config/ComponentDescriptor');
var AbstractController_1 = require('../../src/logic/AbstractController');
var DummyCommandSet_1 = require('./DummyCommandSet');
var DummyController = (function (_super) {
    __extends(DummyController, _super);
    function DummyController() {
        _super.call(this, DummyController.Descriptor);
    }
    DummyController.prototype.link = function (context, components) {
        // Locate reference to dummy persistence component
        this._db = components.getOneRequired(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Persistence, "pip-services-dummies", '*', '*'));
        _super.prototype.link.call(this, context, components);
        // Add commands
        var commands = new DummyCommandSet_1.DummyCommandSet(this);
        this.addCommandSet(commands);
    };
    DummyController.prototype.getDummies = function (correlationId, filter, paging, callback) {
        callback = this.instrument(correlationId, 'dummy.get_dummies', callback);
        this._db.getDummies(correlationId, filter, paging, callback);
    };
    DummyController.prototype.getDummyById = function (correlationId, dummyId, callback) {
        callback = this.instrument(correlationId, 'dummy.get_dummy_by_id', callback);
        this._db.getDummyById(correlationId, dummyId, callback);
    };
    DummyController.prototype.createDummy = function (correlationId, dummy, callback) {
        callback = this.instrument(correlationId, 'dummy.create_dummy', callback);
        this._db.createDummy(correlationId, dummy, callback);
    };
    DummyController.prototype.updateDummy = function (correlationId, dummyId, dummy, callback) {
        callback = this.instrument(correlationId, 'dummy.update_dummy', callback);
        this._db.updateDummy(correlationId, dummyId, dummy, callback);
    };
    DummyController.prototype.deleteDummy = function (correlationId, dummyId, callback) {
        callback = this.instrument(correlationId, 'dummy.delete_dummy', callback);
        this._db.deleteDummy(correlationId, dummyId, callback);
    };
    /**
     * Unique descriptor for the DummyController component
     */
    DummyController.Descriptor = new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Controllers, "pip-services-dummies", "*", "*");
    return DummyController;
}(AbstractController_1.AbstractController));
exports.DummyController = DummyController;
