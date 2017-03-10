"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractBusinessLogic_1 = require('./AbstractBusinessLogic');
/**
 * Abstract implementation for business logic controller.
 *
 * @author Sergey Seroukhov
 * @version 1.1
 * @since 2016-06-09
 */
var AbstractController = (function (_super) {
    __extends(AbstractController, _super);
    /**
     * Creates instance of abstract controller
     * @param descriptor the unique descriptor that is used to identify and locate the component.
     */
    function AbstractController(descriptor) {
        _super.call(this, descriptor);
    }
    /**
     * Sets references to other microservice components to enable their
     * collaboration. It is recommended to locate necessary components
     * and cache their references to void performance hit during
     * normal operations.
     * Linking can only be performed once after configuration
     * and will cause an exception when it is called second time
     * or out of order.
     * @param context application context
     * @param components references to microservice components.
     * @throws MicroserviceError when requires components are not found.
     */
    AbstractController.prototype.link = function (context, components) {
        _super.prototype.link.call(this, context, components);
        // Commented until we decide to use command pattern as everywhere
        // Until now the main method is to implement specific methods with instrumentation
        // this.addIntercepter(new TracingIntercepter(this._loggers, 'Executing'));
        // this.addIntercepter(new TimingIntercepter(this._counters, 'exec_time'));
    };
    /**
     * Does instrumentation of performed business method by counting elapsed time.
     * @param correlationId a unique id to idenfity distributed transactions
     * @param name the name of called business method
     * @param callback a callback function to wrap client operation
     */
    AbstractController.prototype.instrument = function (correlationId, name, callback) {
        this.trace(correlationId, 'Executing ' + name + ' method');
        var timing = this.beginTiming(name + '.exec_time');
        return function (err, data) {
            timing.endTiming();
            if (callback)
                callback(err, data);
        };
    };
    return AbstractController;
}(AbstractBusinessLogic_1.AbstractBusinessLogic));
exports.AbstractController = AbstractController;
