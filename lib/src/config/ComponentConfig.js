"use strict";
var DynamicMap_1 = require('../portability/DynamicMap');
var Category_1 = require('./Category');
var ComponentDescriptor_1 = require('./ComponentDescriptor');
var Connection_1 = require('./Connection');
var Endpoint_1 = require('./Endpoint');
/**
 * Stores configuration for microservice component
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
var ComponentConfig = (function () {
    /**
     * Creates instance of component configuration with values retrieved from microservice configuration section.
     * @param category a component category
     * @param content configuration parameters
     */
    function ComponentConfig(category, content) {
        this._category = category || Category_1.Category.Undefined;
        this._content = content || new DynamicMap_1.DynamicMap();
    }
    /**
     * Gets the raw content of the configuration as dynamic map
     * @return dynamic map with all component configuration parameters.
     */
    ComponentConfig.prototype.getRawContent = function () {
        return this._content;
    };
    /**
     * Sets default values to the configuration
     * @param defaultContent default configuration
     * @return a reference to this configuration for chaining or passing through.
     */
    ComponentConfig.prototype.withDefaults = function (defaultContent) {
        this._content = this._content.merge(defaultContent, true);
        return this;
    };
    /**
     * Sets default tuples to the configuration
     * @param defaultsTuples default configuration represented by <key> + <value> tuples
     * @return a reference to this configuration for chaining or passing through.
     */
    ComponentConfig.prototype.withDefaultTuples = function () {
        var defaultTuples = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            defaultTuples[_i - 0] = arguments[_i];
        }
        var defaultContent = new DynamicMap_1.DynamicMap();
        defaultContent.setTuplesArray(defaultTuples);
        return this.withDefaults(defaultContent);
    };
    /**
     * Gets component descriptor. It is read from 'descriptor' object if it exists.
     * @return the component descriptor
     */
    ComponentConfig.prototype.getDescriptor = function () {
        var values = this._content.getMap("descriptor");
        return new ComponentDescriptor_1.ComponentDescriptor(this._category, values.getNullableString("group"), values.getNullableString("type"), values.getNullableString("version"));
    };
    /**
     * Gets connection parameters from 'connection' object
     * This method is usually used by persistence components to get connections to databases.
     * @return connection parameters
     */
    ComponentConfig.prototype.getConnection = function () {
        var values = this._content.getNullableMap("connection");
        return values != null ? new Connection_1.Connection(values) : null;
    };
    /**
     * Gets a list of database connections from 'connections' or 'connection' objects
     * This method is usually used by persistence components that may connect to one of few database servers.
     * @return a list with database connections
     */
    ComponentConfig.prototype.getConnections = function () {
        // Get configuration parameters for connections
        var values = this._content.getNullableArray("connections");
        values = values || this._content.getNullableArray("connection");
        // Convert configuration parameters to connections
        var connections = [];
        // Convert list of values
        if (values != null) {
            for (var i = 0; i < values.length; i++) {
                var value = values[i];
                connections.push(new Connection_1.Connection(DynamicMap_1.DynamicMap.fromValue(value)));
            }
        }
        // Return the result
        return connections;
    };
    /**
     * Gets a service endpoint from 'endpoint' object
     * This method is usually used by services that need to bind to a single endpoint.
     * @return a service endpoint or <b>null</b> if endpoint is not set
     */
    ComponentConfig.prototype.getEndpoint = function () {
        var values = this._content.getNullableMap("endpoint");
        return values != null ? new Endpoint_1.Endpoint(values) : null;
    };
    /**
     * Gets a list of service endpoint from 'endpoints' or 'endpoint' objects
     * This method is usually used by clients that may connect to one of few services.
     * @return a list with service endpoints
     */
    ComponentConfig.prototype.getEndpoints = function () {
        // Get configuration parameters for endpoints
        var values = this._content.getNullableArray("endpoints");
        values = values || this._content.getNullableArray("endpoint");
        // Convert configuration parameters to endpoints
        var endpoints = [];
        // Convert list of values
        if (values != null) {
            for (var i = 0; i < values.length; i++) {
                var value = values[i];
                endpoints.push(new Endpoint_1.Endpoint(DynamicMap_1.DynamicMap.fromValue(value)));
            }
        }
        // Return the result
        return endpoints;
    };
    /**
     * Gets component free-form configuration options.
     * The options are read from 'options', 'settings' or 'params' objects.
     * @return a map with free-form component options or <b>null</b> when options are not set.
     */
    ComponentConfig.prototype.getOptions = function () {
        return this._content.getNullableMap("options");
    };
    /**
     * Creates component configuration using free-form objects.
     * This method of configuration is usually used during testing.
     * The configuration is created with 'Undefined' category since it's not used to create a component.
     * @param value a free-form object
     * @return constructed component configuration
     */
    ComponentConfig.fromValue = function (value) {
        var content = DynamicMap_1.DynamicMap.fromValue(value);
        return new ComponentConfig(Category_1.Category.Undefined, content);
    };
    /**
     * Creates component configuration using hardcoded parameters.
     * This method of configuration is usually used during testing.
     * The configuration is created with 'Undefined' category since it's not used to create a component.
     * @param tuples configuration parameters as <key> + <value> tuples
     * @return constructed component configuration
     */
    ComponentConfig.fromTuples = function () {
        var tuples = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tuples[_i - 0] = arguments[_i];
        }
        var content = new DynamicMap_1.DynamicMap();
        content.setTuplesArray(tuples);
        return new ComponentConfig(Category_1.Category.Undefined, content);
    };
    return ComponentConfig;
}());
exports.ComponentConfig = ComponentConfig;
