"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var ErrorCategory_1 = require('./ErrorCategory');
/**
 * Base class for all errors thrown by microservice implementation
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
var MicroserviceError = (function (_super) {
    __extends(MicroserviceError, _super);
    function MicroserviceError(category, component, code, message) {
        if (category === void 0) { category = ErrorCategory_1.ErrorCategory.UnknownError; }
        if (component === void 0) { component = null; }
        if (code === void 0) { code = 'Undefined'; }
        if (message === void 0) { message = 'Unknown error'; }
        _super.call(this, message);
        this.code = 'Undefined';
        this.status = 500;
        this.category = category;
        this.component = component != null ? "" + component : null;
        this.code = code;
        // Hack to set message
        if (!this.message)
            this.message = message;
        this.name = this.code;
    }
    MicroserviceError.prototype.forComponent = function (component) {
        this.component = component != null ? "" + component : null;
        return this;
    };
    MicroserviceError.prototype.withCode = function (code) {
        this.code = code || 'Undefined';
        this.name = this.code;
        return this;
    };
    MicroserviceError.prototype.withCause = function (cause) {
        this.cause = cause;
        return this;
    };
    MicroserviceError.prototype.withStatus = function (status) {
        this.status = status || 500;
        return this;
    };
    MicroserviceError.prototype.withDetails = function () {
        var details = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            details[_i - 0] = arguments[_i];
        }
        this.details = this.details != null
            ? this.details.concat(details) : details;
        return this;
    };
    MicroserviceError.prototype.withCorrelationId = function (correlationId) {
        this.correlationId = correlationId;
        return this;
    };
    MicroserviceError.prototype.toObject = function () {
        var result = {
            category: this.category,
            code: this.code,
            message: this.message,
            status: this.status
        };
        if (this.component)
            result.component = this.component;
        if (this.cause)
            result.cause = this.cause;
        if (this.details || this.details.length > 0)
            result.details = this.details;
        if (this.correlationId)
            result.correlation_id = this.correlationId;
        return result;
    };
    MicroserviceError.prototype.toJSON = function () {
        return this.toObject();
    };
    MicroserviceError.prototype.wrap = function (cause) {
        cause = MicroserviceError.unwrap(cause);
        if (cause instanceof MicroserviceError)
            return cause;
        this.withCause(cause);
        return this;
    };
    MicroserviceError.wrap = function (error, cause) {
        cause = MicroserviceError.unwrap(cause);
        if (cause instanceof MicroserviceError)
            return cause;
        error.withCause(cause);
        return error;
    };
    MicroserviceError.unwrap = function (error) {
        if (error == null)
            return null;
        // Unwrapping Seneca exceptions
        if (error.code == 'act_execute' && error.orig) {
            error = error.orig;
            if (error.orig)
                error = error.orig;
        }
        // Unwrapping restify exceptions 
        if (error.body && !_.isEmpty(error.body))
            error = error.body;
        return error;
    };
    return MicroserviceError;
}(Error));
exports.MicroserviceError = MicroserviceError;
