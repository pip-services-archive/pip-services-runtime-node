"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MicroserviceError_1 = require('./MicroserviceError');
var ErrorCategory_1 = require('./ErrorCategory');
/**
 * Errors in read/write file operations
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
var FileError = (function (_super) {
    __extends(FileError, _super);
    function FileError() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        _super.call(this, ErrorCategory_1.ErrorCategory.FileError, args.length > 2 ? args[0] : null, args.length > 2 ? args[1] : args.length > 1 ? args[0] : null, args.length > 2 ? args[2] : args.length > 1 ? args[1] : args[0]);
        this.withStatus(500);
    }
    return FileError;
}(MicroserviceError_1.MicroserviceError));
exports.FileError = FileError;
