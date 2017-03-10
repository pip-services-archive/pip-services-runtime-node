"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MicroserviceError_1 = require('./MicroserviceError');
var ErrorCategory_1 = require('./ErrorCategory');
/**
 * Errors caused by calls to unsupported
 * or not yet implemented functionality
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-17
 */
var UnsupportedError = (function (_super) {
    __extends(UnsupportedError, _super);
    function UnsupportedError() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        _super.call(this, ErrorCategory_1.ErrorCategory.Unsupported, args.length > 2 ? args[0] : null, args.length > 2 ? args[1] : args.length > 1 ? args[0] : null, args.length > 2 ? args[2] : args.length > 1 ? args[1] : args[0]);
        this.withStatus(501);
    }
    return UnsupportedError;
}(MicroserviceError_1.MicroserviceError));
exports.UnsupportedError = UnsupportedError;
