"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CommandSet_1 = require('../../src/commands/CommandSet');
var Command_1 = require('../../src/commands/Command');
var Schema_1 = require('../../src/validation/Schema');
var FilterParams_1 = require('../../src/data/FilterParams');
var PagingParams_1 = require('../../src/data/PagingParams');
var DummyCommandSet = (function (_super) {
    __extends(DummyCommandSet, _super);
    function DummyCommandSet(logic) {
        _super.call(this);
        this._logic = logic;
        // Register commands to the database
        this.addCommand(this.makeGetDummiesCommand());
        this.addCommand(this.makeGetDummyByIdCommand());
        this.addCommand(this.makeCreateDummyCommand());
        this.addCommand(this.makeUpdateDummyCommand());
        this.addCommand(this.makeDeleteDummyCommand());
    }
    DummyCommandSet.prototype.makeGetDummiesCommand = function () {
        var _this = this;
        return new Command_1.Command(this._logic, "get_dummies", new Schema_1.Schema()
            .withOptionalProperty("filter", "FilterParams")
            .withOptionalProperty("paging", "PagingParams"), function (correlationId, args, callback) {
            var filter = FilterParams_1.FilterParams.fromValue(args.get("filter"));
            var paging = PagingParams_1.PagingParams.fromValue(args.get("paging"));
            _this._logic.getDummies(correlationId, filter, paging, callback);
        });
    };
    DummyCommandSet.prototype.makeGetDummyByIdCommand = function () {
        var _this = this;
        return new Command_1.Command(this._logic, "get_dummy_by_id", new Schema_1.Schema()
            .withProperty("dummy_id", "string"), function (correlationId, args, callback) {
            var dummyId = args.getNullableString("dummy_id");
            _this._logic.getDummyById(correlationId, dummyId, callback);
        });
    };
    DummyCommandSet.prototype.makeCreateDummyCommand = function () {
        var _this = this;
        return new Command_1.Command(this._logic, "create_dummy", new Schema_1.Schema()
            .withProperty("dummy", "Dummy"), function (correlationId, args, callback) {
            var dummy = args.get("dummy");
            _this._logic.createDummy(correlationId, dummy, callback);
        });
    };
    DummyCommandSet.prototype.makeUpdateDummyCommand = function () {
        var _this = this;
        return new Command_1.Command(this._logic, "update_dummy", new Schema_1.Schema()
            .withProperty("dummy_id", "string")
            .withProperty("dummy", "any"), function (correlationId, args, callback) {
            var dummyId = args.getNullableString("dummy_id");
            var dummy = args.get("dummy");
            _this._logic.updateDummy(correlationId, dummyId, dummy, callback);
        });
    };
    DummyCommandSet.prototype.makeDeleteDummyCommand = function () {
        var _this = this;
        return new Command_1.Command(this._logic, "delete_dummy", new Schema_1.Schema()
            .withProperty("dummy_id", "string"), function (correlationId, args, callback) {
            var dummyId = args.getNullableString("dummy_id");
            _this._logic.deleteDummy(correlationId, dummyId, callback);
        });
    };
    return DummyCommandSet;
}(CommandSet_1.CommandSet));
exports.DummyCommandSet = DummyCommandSet;
