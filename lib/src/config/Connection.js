"use strict";
var DynamicMap_1 = require('../portability/DynamicMap');
/**
 * Database connection configuration as set in the component config.
 * It usually contains a complete uri or separate host, port, user, password, etc.
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-19
 */
var Connection = (function () {
    /**
     * Create an instance of database connection with free-form configuration map.
     * @param content a map with the database connection parameters.
     */
    function Connection(content) {
        this._content = content || new DynamicMap_1.DynamicMap();
    }
    /**
     * Gets connection as free-form configuration set.
     * @return a free-form map with connection configuration.
     */
    Connection.prototype.getRawContent = function () {
        return this._content;
    };
    /**
     * Gets the connection type
     * @return the connection type
     */
    Connection.prototype.getType = function () {
        return this._content.getNullableString("type");
    };
    /**
     * Gets the connection host name or ip address.
     * @return a string representing service host
     */
    Connection.prototype.getHost = function () {
        return this._content.getNullableString("host");
    };
    /**
     * Gets the connection port number
     * @return integer representing the service port.
     */
    Connection.prototype.getPort = function () {
        return this._content.getInteger("port");
    };
    /**
     * Gets the database name
     * @return the database name
     */
    Connection.prototype.getDatabase = function () {
        return this._content.getNullableString("database");
    };
    /**
     * Gets the connection user name.
     * @return the user name
     */
    Connection.prototype.getUsername = function () {
        return this._content.getNullableString("username");
    };
    /**
     * Gets the connection user password.
     * @return the user password
     */
    Connection.prototype.getPassword = function () {
        return this._content.getNullableString("password");
    };
    /**
     * Gets the endpoint uri constracted from type, host and port
     * @return uri as <type>://<host | ip>:<port>
     */
    Connection.prototype.getUri = function () {
        return this.getType() + "://" + this.getHost() + ":" + this.getPort();
    };
    return Connection;
}());
exports.Connection = Connection;
