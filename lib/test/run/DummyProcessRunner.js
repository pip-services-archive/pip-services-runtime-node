"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DummyMicroservice_1 = require('./DummyMicroservice');
var ProcessRunner_1 = require('../../src/run/ProcessRunner');
/**
 * Dummy process runner
 *
 * @author Sergey Seroukhov
 * @version 1.1
 * @since 2016-06-06
 */
var DummyProcessRunner = (function (_super) {
    __extends(DummyProcessRunner, _super);
    /**
     * Creates instance of dummy process runner
     */
    function DummyProcessRunner() {
        _super.call(this, new DummyMicroservice_1.DummyMicroservice());
    }
    return DummyProcessRunner;
}(ProcessRunner_1.ProcessRunner));
exports.DummyProcessRunner = DummyProcessRunner;
