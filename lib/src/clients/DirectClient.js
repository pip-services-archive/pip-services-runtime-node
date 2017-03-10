"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractClient_1 = require('./AbstractClient');
/**
 * Direct client implementation that allows to call another microservice from the same container.
 *
 * It can be very useful for deployments of microservices as monolythic systems.
 * Although it may seem strange some situation may require deployment simplicity
 * over scalability and other behefits of microservices. The good news, you have flexibility to
 * adapt the end product without sacrifacing the system architecture.
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
var DirectClient = (function (_super) {
    __extends(DirectClient, _super);
    /**
     * Creates and initializes instance of the microservice client component.
     * @param descriptor the unique descriptor that is used to identify and locate the component.
     */
    function DirectClient(descriptor) {
        _super.call(this, descriptor);
    }
    return DirectClient;
}(AbstractClient_1.AbstractClient));
exports.DirectClient = DirectClient;
