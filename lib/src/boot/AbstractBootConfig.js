"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractComponent_1 = require('../AbstractComponent');
/**
 * Abstract implementation for all bootstrap configuration reader components.
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-05-01
 */
var AbstractBootConfig = (function (_super) {
    __extends(AbstractBootConfig, _super);
    /**
     * Creates instance of abstract configuration reader component.
     * @param descriptor the unique descriptor that is used to identify and locate the component.
     */
    function AbstractBootConfig(descriptor) {
        _super.call(this, descriptor);
    }
    return AbstractBootConfig;
}(AbstractComponent_1.AbstractComponent));
exports.AbstractBootConfig = AbstractBootConfig;
