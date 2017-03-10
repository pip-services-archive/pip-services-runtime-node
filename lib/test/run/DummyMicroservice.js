"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Microservice_1 = require('../../src/run/Microservice');
var DummyFactory_1 = require('../build/DummyFactory');
/**
 * Dummy microservice class.
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
var DummyMicroservice = (function (_super) {
    __extends(DummyMicroservice, _super);
    /**
     * Creates instance of dummy microservice.
     */
    function DummyMicroservice() {
        _super.call(this, "pip-services-dummies", DummyFactory_1.DummyFactory.Instance);
    }
    return DummyMicroservice;
}(Microservice_1.Microservice));
exports.DummyMicroservice = DummyMicroservice;
