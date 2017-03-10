"use strict";
var DynamicMap_1 = require('../portability/DynamicMap');
/**
 * Service address as set in component configuration or
 * retrieved by discovery service. It contains service protocol,
 * host, port number, timeouts and additional configuration parameters.
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
var Endpoint = (function () {
    /**
     * Create an instance of service address with free-form configuration map.
     * @param content a map with the address configuration parameters.
     */
    function Endpoint(content) {
        this._content = content || new DynamicMap_1.DynamicMap();
    }
    /**
     * Gets endpoint as free-form configuration set.
     * @return a free-form map with address configuration.
     */
    Endpoint.prototype.getRawContent = function () {
        return this._content;
    };
    /**
     * Checks if discovery registration or resolution shall be performed.
     * The discovery is requested when 'discover' parameter contains
     * a non-empty string that represents the discovery name.
     * @return <b>true</b> if the address shall be handled by discovery
     * and <b>false</b> when all address parameters are defined statically.
     */
    Endpoint.prototype.useDiscovery = function () {
        return this._content.has("discover") || this._content.has("discovery");
    };
    /**
     * Gets a name under which the address shall be registered or resolved
     * by discovery service.
     * @return a name to register or resolve the address
     */
    Endpoint.prototype.getDiscoveryName = function () {
        var discover = this._content.getNullableString("discover");
        discover = discover || this._content.getNullableString("discovery");
        return discover;
    };
    /**
     * Gets the endpoint protocol
     * @return the endpoint protocol
     */
    Endpoint.prototype.getProtocol = function () {
        return this._content.getNullableString("protocol");
    };
    /**
     * Gets the service host name or ip address.
     * @return a string representing service host
     */
    Endpoint.prototype.getHost = function () {
        return this._content.getNullableString("host");
    };
    /**
     * Gets the service port number
     * @return integer representing the service port.
     */
    Endpoint.prototype.getPort = function () {
        return this._content.getNullableInteger("port");
    };
    /**
     * Gets the service user name.
     * @return the user name
     */
    Endpoint.prototype.getUsername = function () {
        return this._content.getNullableString("username");
    };
    /**
     * Gets the service user password.
     * @return the user password
     */
    Endpoint.prototype.getPassword = function () {
        return this._content.getNullableString("password");
    };
    /**
     * Gets the endpoint uri constracted from protocol, host and port
     * @return uri as <protocol>://<host | ip>:<port>
     */
    Endpoint.prototype.getUri = function () {
        return this.getProtocol() + "://" + this.getHost() + ":" + this.getPort();
    };
    return Endpoint;
}());
exports.Endpoint = Endpoint;
