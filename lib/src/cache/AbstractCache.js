"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractComponent_1 = require('../AbstractComponent');
/**
 * Abstract implementation for transient cache.
 * It can be used to bypass persistence to increase overall system performance.
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-05-01
 */
var AbstractCache = (function (_super) {
    __extends(AbstractCache, _super);
    /**
     * Constructs and initializes cache instance.
     * @param descriptor the unique component descriptor to identify and locate the component
     */
    function AbstractCache(descriptor) {
        _super.call(this, descriptor);
    }
    return AbstractCache;
}(AbstractComponent_1.AbstractComponent));
exports.AbstractCache = AbstractCache;
