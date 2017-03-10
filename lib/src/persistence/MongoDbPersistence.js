"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var DynamicMap_1 = require('../portability/DynamicMap');
var State_1 = require('../State');
var ConfigError_1 = require('../errors/ConfigError');
var ConnectionError_1 = require('../errors/ConnectionError');
var AbstractPersistence_1 = require('./AbstractPersistence');
var PagingParams_1 = require('../data/PagingParams');
var DataPage_1 = require('../data/DataPage');
var MongoDbPersistence = (function (_super) {
    __extends(MongoDbPersistence, _super);
    function MongoDbPersistence(descriptor, model) {
        _super.call(this, descriptor);
        this._model = model;
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
    MongoDbPersistence.prototype.configure = function (config) {
        this.checkNewStateAllowed(State_1.State.Configured);
        config = config.withDefaults(MongoDbPersistence.DefaultConfig);
        var connection = config.getConnection();
        var options = config.getOptions();
        if (connection == null)
            throw new ConfigError_1.ConfigError(this, "NoConnection", "Database connection is not set");
        if (connection.getType() != "mongodb")
            throw new ConfigError_1.ConfigError(this, "WrongConnectionType", "MongoDb is the only supported connection type");
        if (connection.getHost() == null)
            throw new ConfigError_1.ConfigError(this, "NoConnectionHost", "Connection host is not set");
        if (connection.getPort() == null)
            throw new ConfigError_1.ConfigError(this, "NoConnectionPort", "Connection port is not set");
        if (connection.getDatabase() == null)
            throw new ConfigError_1.ConfigError(this, "NoConnectionDatabase", "Connection database is not set");
        _super.prototype.configure.call(this, config);
        this._maxPageSize = options.getInteger("max_page_size");
    };
    /**
     * Sets references to other microservice components to enable their
     * collaboration. It is recommended to locate necessary components
     * and cache their references to void performance hit during
     * normal operations.
     * Linking can only be performed once after configuration
     * and will cause an exception when it is called second time
     * or out of order.
     * @param context application context
     * @param components references to microservice components.
     * @throws MicroserviceError when requires components are not found.
     */
    MongoDbPersistence.prototype.link = function (context, components) {
        this.checkNewStateAllowed(State_1.State.Linked);
        this._connection = require('mongoose').createConnection();
        if (_.isString(this._model))
            this._model = require(this._model);
        if (_.isFunction(this._model))
            this._model = this._model(this._connection);
        this._converter = this.convertItem;
        this._listConverter = this.convertListItem;
        _super.prototype.link.call(this, context, components);
    };
    /**
     * Opens the component, performs initialization, opens connections
     * to external services and makes the component ready for operations.
     * Opening can be done multiple times: right after linking
     * or reopening after closure.
     * @param callback a callback to report success or error in opening
     */
    MongoDbPersistence.prototype.open = function (callback) {
        var _this = this;
        this.checkNewStateAllowed(State_1.State.Opened);
        var connection = this._config.getConnection();
        var uri = connection.getType() + '://' + connection.getHost()
            + ':' + connection.getPort() + '/' + connection.getDatabase();
        var options = this._config.getOptions();
        this.trace(null, 'Connecting to mongodb at ' + uri);
        this._connection.open(uri, options, function (err) {
            if (err) {
                err = new ConnectionError_1.ConnectionError(_this, 'ConnectFailed', 'Connection to mongodb failed: ' + err)
                    .wrap(err);
                callback(err);
            }
            else
                _super.prototype.open.call(_this, callback);
        });
    };
    /**
     * Closes the component and all open connections, performs deinitialization
     * steps. Closure can only be done from opened state. Attempts to close
     * already closed component or in wrong order will cause exception.
     * @param callback a callback to report success or error in closing
     */
    MongoDbPersistence.prototype.close = function (callback) {
        var _this = this;
        this.checkNewStateAllowed(State_1.State.Closed);
        this._connection.close(function (err) {
            if (err) {
                err = new ConnectionError_1.ConnectionError(_this, 'DisconnectFailed', 'Disconnect from mongodb failed: ' + err)
                    .wrap(err);
                callback(err);
            }
            else
                _super.prototype.close.call(_this, callback);
        });
    };
    MongoDbPersistence.prototype.clearTestData = function (callback) {
        this._connection.db.dropDatabase(callback);
    };
    MongoDbPersistence.prototype.getPage = function (correlationId, filter, paging, sort, select, callback) {
        var _this = this;
        // Adjust max item count based on configuration
        paging = paging || new PagingParams_1.PagingParams();
        var skip = paging.getSkip(-1);
        var take = paging.getTake(this._maxPageSize);
        var pagingEnabled = paging.total;
        // Configure statement
        var statement = this._model.find(filter);
        if (skip >= 0)
            statement.skip(skip);
        statement.limit(take);
        if (sort && !_.isEmpty(sort))
            statement.sort(sort);
        if (select && !_.isEmpty(select))
            statement.select(select);
        statement.exec(function (err, items) {
            if (err) {
                callback(err);
                return;
            }
            if (_this._listConverter)
                items = _.map(items, _this._listConverter);
            else
                items = _.map(items, _this.jsonToPublic);
            if (pagingEnabled) {
                _this._model.count(filter, function (err, count) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    var page = new DataPage_1.DataPage(items, count);
                    callback(null, page.toObject());
                });
            }
            else {
                var page = new DataPage_1.DataPage(items);
                callback(null, page.toObject());
            }
        });
    };
    MongoDbPersistence.prototype.getList = function (correlationId, filter, sort, select, callback) {
        var _this = this;
        // Configure statement
        var statement = this._model.find(filter);
        if (sort && !_.isEmpty(sort))
            statement.sort(sort);
        if (select && !_.isEmpty(select))
            statement.select(select);
        statement.exec(function (err, items) {
            if (err) {
                callback(err);
                return;
            }
            if (_this._listConverter)
                items = _.map(items, _this._listConverter);
            else
                items = _.map(items, _this.jsonToPublic);
            callback(null, items);
        });
    };
    MongoDbPersistence.prototype.getRandom = function (correlationId, filter, callback) {
        var _this = this;
        this._model.count(filter, function (err, count) {
            if (err) {
                callback(err);
                return;
            }
            var pos = _.random(0, count - 1);
            _this._model.find(filter)
                .skip(pos)
                .limit(1)
                .exec(function (err, items) {
                var item = (items != null && items.length > 0) ? items[0] : null;
                if (item) {
                    if (_this._converter)
                        item = _this._converter(item);
                    else
                        item = _this.jsonToPublic(item);
                }
                callback(err, item);
            });
        });
    };
    MongoDbPersistence.prototype.getById = function (correlationId, id, callback) {
        var _this = this;
        this._model.findById(id, function (err, item) {
            if (item) {
                if (_this._converter)
                    item = _this._converter(item);
                else
                    item = _this.jsonToPublic(item);
            }
            callback(err, item);
        });
    };
    MongoDbPersistence.prototype.create = function (correlationId, item, callback) {
        var _this = this;
        var newItem = _.omit(item, 'id');
        newItem._id = item.id || this.createUuid();
        this._model.create(newItem, function (err, item) {
            if (item) {
                if (_this._converter)
                    item = _this._converter(item);
                else
                    item = _this.jsonToPublic(item);
            }
            callback(err, item);
        });
    };
    MongoDbPersistence.prototype.update = function (correlationId, id, newItem, callback) {
        var _this = this;
        newItem = _.omit(newItem, '_id', 'id');
        this._model.findByIdAndUpdate(id, { $set: newItem }, { 'new': true }, function (err, item) {
            if (item) {
                if (_this._converter)
                    item = _this._converter(item);
                else
                    item = _this.jsonToPublic(item);
            }
            callback(err, item);
        });
    };
    // The method must return deleted value to be able to do clean up like removing references 
    MongoDbPersistence.prototype.delete = function (correlationId, id, callback) {
        var _this = this;
        this._model.findByIdAndRemove(id, function (err, item) {
            if (item) {
                if (_this._converter)
                    item = _this._converter(item);
                else
                    item = _this.jsonToPublic(item);
            }
            callback(err, item);
        });
    };
    // Convert object to JSON format
    MongoDbPersistence.prototype.jsonToPublic = function (value) {
        if (value && value.toJSON)
            value = value.toJSON();
        return value;
    };
    MongoDbPersistence.prototype.convertItem = function (value) {
        if (value && value.toJSON)
            value = value.toJSON();
        return value;
    };
    MongoDbPersistence.prototype.convertListItem = function (value) {
        if (value == null)
            return null;
        if (value.toJSON)
            value = value.toJSON();
        return _.omit(value, 'custom_dat');
    };
    MongoDbPersistence.DefaultConfig = DynamicMap_1.DynamicMap.fromTuples("connection.type", "mongodb", "connection.host", "localhost", "connection.port", 27017, "options.server.pollSize", 4, "options.server.socketOptions.keepAlive", 1, "options.server.socketOptions.connectTimeoutMS", 5000, "options.server.auto_reconnect", true, "options.max_page_size", 100, "options.debug", true);
    return MongoDbPersistence;
}(AbstractPersistence_1.AbstractPersistence));
exports.MongoDbPersistence = MongoDbPersistence;
