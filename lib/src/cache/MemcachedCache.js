"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var Category_1 = require('../config/Category');
var DynamicMap_1 = require('../portability/DynamicMap');
var ComponentDescriptor_1 = require('../config/ComponentDescriptor');
var State_1 = require('../State');
var ConfigError_1 = require('../errors/ConfigError');
var CallError_1 = require('../errors/CallError');
var AbstractCache_1 = require('./AbstractCache');
/**
 * Distributed cache that works through Memcached servers
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-19
 */
var MemcachedCache = (function (_super) {
    __extends(MemcachedCache, _super);
    /**
     * Creates instance of memcached cache component.
     */
    function MemcachedCache() {
        _super.call(this, MemcachedCache.Descriptor);
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
    MemcachedCache.prototype.configure = function (config) {
        this.checkNewStateAllowed(State_1.State.Configured);
        _super.prototype.configure.call(this, config.withDefaults(MemcachedCache.DefaultConfig));
        // Convert timeout to seconds
        this._timeout = config.getOptions().getLong("timeout") / 1000;
        // Check for endpoints
        var endpoints = this._config.getEndpoints();
        if (endpoints.length == 0)
            throw new ConfigError_1.ConfigError(this, 'NoEndpoints', 'Endpoints are not configured');
    };
    /**
     * Opens the component, performs initialization, opens connections
     * to external services and makes the component ready for operations.
     * Opening can be done multiple times: right after linking
     * or reopening after closure.
     * @param callback a callback to report success or error in opening
     */
    MemcachedCache.prototype.open = function (callback) {
        this.checkNewStateAllowed(State_1.State.Opened);
        var endpoints = this._config.getEndpoints();
        var uris = _.map(endpoints, function (e) {
            return e.getHost() + ':' + (e.getPort() || 11211);
        }).join(',');
        var options = this._config.getOptions();
        var memjs = require('memjs');
        this._client = memjs.Client.create(uris, options);
        _super.prototype.open.call(this, callback);
    };
    /**
     * Closes the component and all open connections, performs deinitialization
     * steps. Closure can only be done from opened state. Attempts to close
     * already closed component or in wrong order will cause exception.
     * @param callback a callback to report success or error in closing
     */
    MemcachedCache.prototype.close = function (callback) {
        this.checkNewStateAllowed(State_1.State.Closed);
        this._client = null;
        _super.prototype.close.call(this, callback);
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
    MemcachedCache.prototype.retrieve = function (key, callback) {
        var _this = this;
        this._client.get(key, function (err, value) {
            // Convert value from JSON
            value = value != null ? JSON.parse(value) : null;
            if (err)
                callback(new CallError_1.CallError(_this, 'RetrieveFailed', 'Failed to retrieve value from memcached', err), null);
            else
                callback(null, value);
        });
    };
    /**
     * Stores value identified by unique key in the cache.
     * Stale timeout is configured in the component options.
     * @param key a unique key to locate value in the cache.
     * @param value a value to store.
     * @param callback a callback function to be called with error
     * or stored value
     */
    MemcachedCache.prototype.store = function (key, value, callback) {
        var _this = this;
        if (value != null) {
            // Convert value to JSON
            var newValue = value != null ? JSON.stringify(value) : null;
            this._client.set(key, newValue, function (err, newValue) {
                if (err)
                    callback(new CallError_1.CallError(_this, 'StoreFailed', 'Failed to store value to memcached', err), null);
                else
                    callback(null, value);
            }, this._timeout);
        }
        else {
            this._client.delete(key, function (err, newValue) {
                if (err)
                    callback(new CallError_1.CallError(_this, 'DeleteFailed', 'Failed to delete value from memcached', err), null);
                else
                    callback(null, value);
            }, this._timeout);
        }
    };
    /**
     * Removes value stored in the cache.
     * @param key a unique key to locate value in the cache.
     * @param callback a callback function to be called
     * with error or success
     */
    MemcachedCache.prototype.remove = function (key, callback) {
        var _this = this;
        this._client.delete(key, function (err, value) {
            if (err)
                callback(new CallError_1.CallError(_this, 'DeleteFailed', 'Failed to delete value from memcached', err));
            else
                callback(null);
        });
    };
    /**
     * Unique descriptor for the Memcached Cache component
     */
    MemcachedCache.Descriptor = new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Cache, "pip-services-runtime-cache", "memcached", "*");
    /**
     * Default configuration for memcached
     */
    MemcachedCache.DefaultConfig = DynamicMap_1.DynamicMap.fromTuples("options.timeout", 60000, // timeout in milliseconds
    "options.retries", 2, "options.failover", false, "options.failover_time", 60);
    return MemcachedCache;
}(AbstractCache_1.AbstractCache));
exports.MemcachedCache = MemcachedCache;
