"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var querystring = require('querystring');
var State_1 = require('../State');
var DynamicMap_1 = require('../portability/DynamicMap');
var IdGenerator_1 = require('../data/IdGenerator');
var UnknownError_1 = require('../errors/UnknownError');
var ConfigError_1 = require('../errors/ConfigError');
var AbstractClient_1 = require('./AbstractClient');
var RestClient = (function (_super) {
    __extends(RestClient, _super);
    function RestClient(descriptor) {
        _super.call(this, descriptor);
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
    RestClient.prototype.configure = function (config) {
        this.checkNewStateAllowed(State_1.State.Configured);
        config = config.withDefaults(RestClient.DefaultConfig);
        var endpoint = config.getEndpoint();
        // Check for type
        var protocol = endpoint.getProtocol();
        if (protocol != 'http')
            throw new ConfigError_1.ConfigError(this, 'UnsupportedProtocol', 'Protocol type is not supported by REST transport').withDetails(protocol);
        // Check for host
        if (endpoint.getHost() == null)
            throw new ConfigError_1.ConfigError(this, 'NoHost', 'No host is configured in REST transport');
        // Check for port
        if (endpoint.getPort() == 0)
            throw new ConfigError_1.ConfigError(this, 'NoPort', 'No port is configured in REST transport');
        _super.prototype.configure.call(this, config);
    };
    /**
     * Opens the component, performs initialization, opens connections
     * to external services and makes the component ready for operations.
     * Opening can be done multiple times: right after linking
     * or reopening after closure.
     * @param callback a callback to report success or error in opening
     */
    RestClient.prototype.open = function (callback) {
        this.checkNewStateAllowed(State_1.State.Opened);
        var options = this._config.getOptions() || {};
        var endpoint = this._config.getEndpoint();
        var type = endpoint.getProtocol();
        var host = endpoint.getHost();
        var port = endpoint.getPort();
        options.url = type + '://' + host + ':' + port;
        var restify = require('restify');
        this._client = restify.createJsonClient(options);
        _super.prototype.open.call(this, callback);
    };
    /**
     * Closes the component and all open connections, performs deinitialization
     * steps. Closure can only be done from opened state. Attempts to close
     * already closed component or in wrong order will cause exception.
     * @param callback a callback to report success or error in closing
     */
    RestClient.prototype.close = function (callback) {
        this.checkNewStateAllowed(State_1.State.Closed);
        this._client = null;
        _super.prototype.close.call(this, callback);
    };
    RestClient.prototype.addCorrelationId = function (params, correlationId) {
        // Automatically generate short ids for now
        if (correlationId == null)
            correlationId = IdGenerator_1.IdGenerator.short();
        params = params || {};
        params.correlation_id = correlationId;
        return params;
    };
    RestClient.prototype.addFilterParams = function (params, filter) {
        params = params || {};
        if (filter) {
            for (var prop in filter) {
                if (filter.hasOwnProperty(prop))
                    params[prop] = filter[prop];
            }
        }
        return params;
    };
    RestClient.prototype.addPagingParams = function (params, paging) {
        params = params || {};
        if (paging) {
            if (paging.total)
                params.total = paging.total;
            if (paging.skip)
                params.skip = paging.skip;
            if (paging.take)
                params.take = paging.take;
        }
        return params;
    };
    RestClient.prototype.call = function (method, route, correlationId, params, data, callback) {
        if (params === void 0) { params = {}; }
        this.checkCurrentState(State_1.State.Opened);
        method = method.toLowerCase();
        if (_.isFunction(data)) {
            callback = data;
            data = {};
        }
        params = this.addCorrelationId(params, correlationId);
        if (!_.isEmpty(params))
            route += '?' + querystring.stringify(params);
        var self = this;
        var action = null;
        if (callback) {
            action = function (err, req, res, data) {
                // Handling 204 codes
                if (res.statusCode == 204)
                    callback.call(self, null, null);
                else
                    callback.call(self, err, data);
            };
        }
        if (method == 'get')
            this._client.get(route, action);
        else if (method == 'head')
            this._client.head(route, action);
        else if (method == 'post')
            this._client.post(route, data, action);
        else if (method == 'put')
            this._client.put(route, data, action);
        else if (method == 'delete')
            this._client.del(route, action);
        else {
            var error = new UnknownError_1.UnknownError(this, 'UnsupportedMethod', 'Method is not supported by REST client').withDetails(method);
            if (callback)
                callback(error, null);
            else
                throw error;
        }
    };
    RestClient.DefaultConfig = DynamicMap_1.DynamicMap.fromTuples('endpoint.protocol', 'http');
    return RestClient;
}(AbstractClient_1.AbstractClient));
exports.RestClient = RestClient;
