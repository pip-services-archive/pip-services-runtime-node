"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Category_1 = require('../../src/config/Category');
var ComponentDescriptor_1 = require('../../src/config/ComponentDescriptor');
var DummyMicroservice_1 = require('../run/DummyMicroservice');
var LambdaFunction_1 = require('../../src/run/LambdaFunction');
var DummyLambdaFunction = (function (_super) {
    __extends(DummyLambdaFunction, _super);
    function DummyLambdaFunction() {
        _super.call(this, new DummyMicroservice_1.DummyMicroservice());
    }
    DummyLambdaFunction.prototype.link = function (context, components) {
        this._logic = components.getOneOptional(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.BusinessLogic, "pip-services-dummies", "*", "*"));
        _super.prototype.link.call(this, context, components);
        this.registerCommands(this._logic.getCommands());
    };
    return DummyLambdaFunction;
}(LambdaFunction_1.LambdaFunction));
exports.DummyLambdaFunction = DummyLambdaFunction;
