"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Category_1 = require('../config/Category');
var DynamicMap_1 = require('../portability/DynamicMap');
var State_1 = require('../State');
var ComponentDescriptor_1 = require('../config/ComponentDescriptor');
var AbstractCache_1 = require('./AbstractCache');
var CacheEntry_1 = require('./CacheEntry');
/**
 * Local in-memory cache that can be used in non-scaled deployments or for testing.
 *
 * Todo: Track access time for cached entries to optimize cache shrinking logic
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-05-01
 */
var MemoryCache = (function (_super) {
    __extends(MemoryCache, _super);
    /**
     * Creates instance of local in-memory cache component
     */
    function MemoryCache() {
        _super.call(this, MemoryCache.Descriptor);
        this._cache = {};
        this._count = 0;
    }
    /**
     * Sets component configuration parameters and switches component
     * to 'Configured' state. The configuration is only allowed once
     * right after creation. Attempts to perform reconfiguration will
     * cause an exception.
     * @param config the component configuration parameters.
     * @throws MicroserviceError when component is in illegal state
     * or configuration validation fails.
     */
    MemoryCache.prototype.configure = function (config) {
        this.checkNewStateAllowed(State_1.State.Configured);
        _super.prototype.configure.call(this, config.withDefaults(MemoryCache.DefaultConfig));
        this._timeout = config.getOptions().getLong("timeout");
        this._maxSize = config.getOptions().getInteger("max_size");
    };
    /**
     * Cleans up cache from obsolete values and shrinks the cache
     * to fit into allowed max size by dropping values that were not
     * accessed for a long time
     */
    MemoryCache.prototype.cleanup = function () {
        var oldest = null;
        var now = Date.now();
        this._count = 0;
        // Cleanup obsolete entries and find the oldest
        for (var prop in this._cache) {
            if (this._cache.hasOwnProperty(prop)) {
                var entry = this._cache[prop];
                // Remove obsolete entry
                if (this._timeout > 0 && (now - entry.getCreated()) > this._timeout) {
                    delete this._cache[prop];
                }
                else {
                    this._count++;
                    if (oldest == null || oldest.getCreated() > entry.getCreated())
                        oldest = entry;
                }
            }
        }
        // Remove the oldest if cache size exceeded maximum
        if (this._count > this._maxSize && oldest != null) {
            delete this._cache[oldest.getKey()];
            this._count--;
        }
    };
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
    MemoryCache.prototype.retrieve = function (key, callback) {
        // Get entry from the cache
        var entry = this._cache[key];
        // Cache has nothing
        if (entry == null) {
            callback(null, null);
            return;
        }
        // Remove entry if expiration set and entry is expired
        if (this._timeout > 0 && (Date.now() - entry.getCreated()) > this._timeout) {
            delete this._cache[key];
            this._count--;
            callback(null, null);
            return;
        }
        callback(null, entry.getValue());
    };
    /**
     * Stores value identified by unique key in the cache.
     * Stale timeout is configured in the component options.
     * @param key a unique key to locate value in the cache.
     * @param value a value to store.
     * @param callback a callback function to be called with error
     * or stored value
     */
    MemoryCache.prototype.store = function (key, value, callback) {
        // Get the entry
        var entry = this._cache[key];
        // Shortcut to remove entry from the cache
        if (value == null) {
            if (entry != null) {
                delete this._cache[key];
                this._count--;
            }
            if (callback)
                callback(null, value);
            return;
        }
        // Update the entry
        if (entry) {
            entry.setValue(value);
        }
        else {
            entry = new CacheEntry_1.CacheEntry(key, value);
            this._cache[key] = entry;
            this._count++;
        }
        // Clean up the cache
        if (this._maxSize > 0 && this._count > this._maxSize)
            this.cleanup();
        if (callback)
            callback(null, value);
    };
    /**
     * Removes value stored in the cache.
     * @param key a unique key to locate value in the cache.
     * @param callback a callback function to be called
     * with error or success
     */
    MemoryCache.prototype.remove = function (key, callback) {
        // Get the entry
        var entry = this._cache[key];
        // Remove entry from the cache
        if (entry != null) {
            delete this._cache[key];
            this._count--;
        }
        if (callback)
            callback(null);
    };
    /**
     * Unique descriptor for the Memory Cache component
     */
    MemoryCache.Descriptor = new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Cache, "pip-services-runtime-cache", "memory", "*");
    /**
     * Default configuration for memory cache component
     */
    MemoryCache.DefaultConfig = DynamicMap_1.DynamicMap.fromTuples("options.timeout", 60000, // timeout in milliseconds
    "options.max_size", 1000 // maximum number of elements in cache
    );
    return MemoryCache;
}(AbstractCache_1.AbstractCache));
exports.MemoryCache = MemoryCache;
