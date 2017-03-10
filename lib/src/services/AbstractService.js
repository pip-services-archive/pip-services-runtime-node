"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractComponent_1 = require('../AbstractComponent');
/**
 * Abstract implementation for all API service components
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-05-01
 */
var AbstractService = (function (_super) {
    __extends(AbstractService, _super);
    /**
     * Creates and initializes instance of the APIs service
     * @param descriptor the unique descriptor that is used to identify and locate the component.
     */
    function AbstractService(descriptor) {
        _super.call(this, descriptor);
    }
    return AbstractService;
}(AbstractComponent_1.AbstractComponent));
exports.AbstractService = AbstractService;
