"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractComponent_1 = require('../AbstractComponent');
/**
 * Abstract implementation for all discovery components.
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-12
 */
var AbstractDiscovery = (function (_super) {
    __extends(AbstractDiscovery, _super);
    /**
     * Creates and initializes instance of discovery component
     * @param descriptor the unique component descriptor
     */
    function AbstractDiscovery(descriptor) {
        _super.call(this, descriptor);
    }
    return AbstractDiscovery;
}(AbstractComponent_1.AbstractComponent));
exports.AbstractDiscovery = AbstractDiscovery;
