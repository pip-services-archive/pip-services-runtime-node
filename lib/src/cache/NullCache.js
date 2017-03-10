"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Category_1 = require('../config/Category');
var ComponentDescriptor_1 = require('../config/ComponentDescriptor');
var AbstractCache_1 = require('./AbstractCache');
/**
 * Null cache component that doesn't do caching at all.
 * It's mainly used in testing. However, it can be temporary
 * used to disable cache to troubleshoot problems or study
 * effect of caching on overall system performance.
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-05-01
 */
var NullCache = (function (_super) {
    __extends(NullCache, _super);
    /**
     * Creates instance of null cache component.
     */
    function NullCache() {
        _super.call(this, NullCache.Descriptor);
    }
    /**
     * Retrieves a value from the cache by unique key.
     * It is recommended to use either string GUIDs like '123456789abc'
     * or unique natural keys prefixed with the functional group
     * like 'pip-services-storage:block-123'.
     * @param key a unique key to locate value in the cache
     * @param callback a callback function to be called
     * with error or retrieved value. It returns <b>null</b>
     * when value was not found
     */
    NullCache.prototype.retrieve = function (key, callback) {
        callback(null, null);
    };
    /**
     * Stores value identified by unique key in the cache.
     * Stale timeout is configured in the component options.
     * @param key a unique key to locate value in the cache.
     * @param value a value to store.
     * @param callback a callback function to be called with error
     * or stored value
     */
    NullCache.prototype.store = function (key, value, callback) {
        if (callback)
            callback(null, value);
    };
    /**
     * Removes value stored in the cache.
     * @param key a unique key to locate value in the cache.
     * @param callback a callback function to be called
     * with error or success
     */
    NullCache.prototype.remove = function (key, callback) {
        if (callback)
            callback(null);
    };
    /**
     * Unique descriptor for the Memory Cache component
     */
    NullCache.Descriptor = new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Cache, "pip-services-runtime-cache", "null", "*");
    return NullCache;
}(AbstractCache_1.AbstractCache));
exports.NullCache = NullCache;
