"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractBusinessLogic_1 = require('./AbstractBusinessLogic');
/**
 * Abstract implementation of business logic decorators.
 * Decorators are typically used to alter standard behavior
 * of microservice business logic by injecting custom logic
 * before or after execution.
 *
 * @author Sergey Seroukhov
 * @version 1.1
 * @since 2016-065-09
 */
var AbstractDecorator = (function (_super) {
    __extends(AbstractDecorator, _super);
    /**
     * Creates instance of abstract business logic decorator
     * @param descriptor the unique descriptor that is used to identify and locate the component.
     */
    function AbstractDecorator(descriptor) {
        _super.call(this, descriptor);
    }
    return AbstractDecorator;
}(AbstractBusinessLogic_1.AbstractBusinessLogic));
exports.AbstractDecorator = AbstractDecorator;
