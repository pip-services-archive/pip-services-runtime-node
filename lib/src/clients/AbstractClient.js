"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var MicroserviceError_1 = require('../errors/MicroserviceError');
var AbstractComponent_1 = require('../AbstractComponent');
/**
 * Abstract implementation for all microservice client components.
 *
 * @author Sergey Seroukhov
 * @version 1.1
 * @since 2016-06-09
 */
var AbstractClient = (function (_super) {
    __extends(AbstractClient, _super);
    /**
     * Creates and initializes instance of the microservice client component.
     * @param descriptor the unique descriptor that is used to identify and locate the component.
     */
    function AbstractClient(descriptor) {
        _super.call(this, descriptor);
    }
    /**
     * Does instrumentation of performed business method by counting elapsed time.
     *
     * The instrumentation wraps callback by a function that writes trace messages
     * and tracks elapsed time as a counter.
     *
     * @param correlationId a unique id to idenfity distributed transactions
     * @param name the name of called business method
     * @param callback a callback function to wrap client operation
     */
    AbstractClient.prototype.instrument = function (correlationId, name, callback) {
        this.trace(correlationId, 'Calling ' + name + ' method');
        var timing = this.beginTiming(name + '.call_time');
        return function (err, data) {
            timing.endTiming();
            // Unwrapping errors
            err = MicroserviceError_1.MicroserviceError.unwrap(err);
            // Handling restify issue when null is received as {}
            if (_.isObject(data) && _.isEmpty(data))
                data = null;
            if (callback)
                callback(err, data);
        };
    };
    return AbstractClient;
}(AbstractComponent_1.AbstractComponent));
exports.AbstractClient = AbstractClient;
