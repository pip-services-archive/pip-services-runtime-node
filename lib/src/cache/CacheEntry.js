"use strict";
/**
 * Holds cached value for in-memory cache.
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
var CacheEntry = (function () {
    /**
     * Creates instance of the cache entry.
     * @param key the unique key used to identify and locate the value.
     * @param value the cached value.
     */
    function CacheEntry(key, value) {
        this._created = Date.now();
        this._key = key;
        this._value = value;
    }
    /**
     * Gets the unique key to identify and locate the value.
     * @return the value key.
     */
    CacheEntry.prototype.getKey = function () {
        return this._key;
    };
    /**
     * Gets the cached value.
     * @return the currently cached value.
     */
    CacheEntry.prototype.getValue = function () {
        return this._value;
    };
    /**
     * Changes the cached value and updates creation time.
     * @param value the new cached value.
     */
    CacheEntry.prototype.setValue = function (value) {
        this._value = value;
        this._created = Date.now();
    };
    /**
     * Gets time when the cached value was stored.
     * @return the value creation time.
     */
    CacheEntry.prototype.getCreated = function () {
        return this._created;
    };
    return CacheEntry;
}());
exports.CacheEntry = CacheEntry;
