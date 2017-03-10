"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var fs = require('fs');
var DynamicMap_1 = require('../portability/DynamicMap');
var State_1 = require('../State');
var ConfigError_1 = require('../errors/ConfigError');
var AbstractPersistence_1 = require('./AbstractPersistence');
var DataPage_1 = require('../data/DataPage');
var PagingParams_1 = require('../data/PagingParams');
var FilePersistence = (function (_super) {
    __extends(FilePersistence, _super);
    function FilePersistence(descriptor) {
        _super.call(this, descriptor);
        this._items = [];
        this._converter = this.convertItem;
        this._listConverter = this.convertListItem;
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
    FilePersistence.prototype.configure = function (config) {
        this.checkNewStateAllowed(State_1.State.Configured);
        config = config.withDefaults(FilePersistence.DefaultConfig);
        var options = config.getOptions();
        if (options.hasNot("path"))
            throw new ConfigError_1.ConfigError(this, "NoPath", "Data file path is not set");
        _super.prototype.configure.call(this, config);
        this._path = options.getString("path");
        this._maxPageSize = options.getInteger("max_page_size");
        this._initialData = options.get("data");
    };
    /**
     * Opens the component, performs initialization, opens connections
     * to external services and makes the component ready for operations.
     * Opening can be done multiple times: right after linking
     * or reopening after closure.
     * @param callback a callback to report success or error in opening
     */
    FilePersistence.prototype.open = function (callback) {
        var _this = this;
        if (_.isArray(this._initialData)) {
            // Fill with predefined data (for testing)
            this._items = _.cloneDeep(this._initialData);
            _super.prototype.open.call(this, callback);
        }
        else {
            this.load(function (err) {
                if (err)
                    callback(err);
                else
                    _super.prototype.open.call(_this, callback);
            });
        }
    };
    /**
     * Closes the component and all open connections, performs deinitialization
     * steps. Closure can only be done from opened state. Attempts to close
     * already closed component or in wrong order will cause exception.
     * @param callback a callback to report success or error in closing
     */
    FilePersistence.prototype.close = function (callback) {
        var _this = this;
        this.save(function (err) {
            if (err)
                callback(err);
            else
                _super.prototype.close.call(_this, callback);
        });
    };
    FilePersistence.prototype.load = function (callback) {
        var _this = this;
        this.trace(null, 'Loading data from file at ' + this._path);
        fs.readFile(this._path, function (err, data) {
            if (err) {
                // If doesn't exist then consider empty data
                if (err.code == 'ENOENT') {
                    err = null;
                    _this._items = [];
                }
                callback(err);
            }
            else {
                data = (data || '').toString();
                data = JSON.parse(data) || [];
                if (!_.isArray(data))
                    data = [data];
                _this._items = data;
                callback(null);
            }
        });
    };
    FilePersistence.prototype.save = function (callback) {
        this.trace(null, 'Saving data to file at ' + this._path);
        var data = JSON.stringify(this._items);
        fs.writeFile(this._path, data, callback);
    };
    FilePersistence.prototype.clearTestData = function (callback) {
        this._items = [];
        this.save(callback);
    };
    FilePersistence.prototype.getPage = function (correlationId, filter, paging, sort, select, callback) {
        var items = this._items;
        // Filter and sort
        if (filter)
            items = _.filter(items, filter);
        if (sort)
            items = _.sortBy(items, sort);
        // Prepare paging parameters        
        paging = paging || new PagingParams_1.PagingParams();
        var skip = paging.getSkip(-1);
        var take = paging.getTake(this._maxPageSize);
        // Get a page
        var pageItems = (skip > 0)
            ? _.slice(items, skip, skip + take)
            : _.take(items, take);
        // Convert values
        if (this._listConverter)
            pageItems = _.map(pageItems, this._listConverter);
        if (select)
            pageItems = _.map(pageItems, select);
        // Return a page
        var page = new DataPage_1.DataPage(pageItems, items.length);
        callback(null, page.toObject());
    };
    FilePersistence.prototype.getList = function (correlationId, filter, sort, select, callback) {
        var items = this._items;
        // Filter and sort        
        if (filter)
            items = _.filter(items, filter);
        if (sort)
            items = _.sortBy(items, sort);
        // Convert values      
        if (this._listConverter)
            items = _.map(items, this._listConverter);
        if (select)
            items = _.map(items, select);
        // Return a list
        callback(null, items);
    };
    FilePersistence.prototype.getRandom = function (correlationId, filter, callback) {
        var items = this._items;
        if (filter)
            items = _.filter(items, filter);
        var item = _.sample(items);
        if (item && this._converter)
            item = this._converter(item);
        callback(null, item);
    };
    FilePersistence.prototype.getById = function (correlationId, id, callback) {
        var item = _.find(this._items, function (item) { return item && item.id == id; });
        if (item && this._converter)
            item = this._converter(item);
        callback(null, item);
    };
    FilePersistence.prototype.create = function (correlationId, item, callback) {
        var _this = this;
        // Create the item
        item.id = item.id || this.createUuid();
        this._items.push(item);
        // Save the item collection
        this.save(function (err) {
            if (item && _this._converter)
                item = _this._converter(item);
            if (err)
                callback(err);
            else
                callback(null, item);
        });
    };
    FilePersistence.prototype.update = function (correlationId, id, newItem, callback) {
        var _this = this;
        // Get the item        
        var item = _.find(this._items, function (item) { return item && item.id == id; });
        if (item == null) {
            callback(null, null);
            return;
        }
        // Update the item
        newItem = _.omit(newItem, 'id');
        _.assign(item, newItem);
        // Save item collection
        this.save(function (err) {
            if (item && _this._converter)
                item = _this._converter(item);
            if (err)
                callback(err);
            else
                callback(null, item);
        });
    };
    // The method must return deleted value to be able to do clean up like removing references 
    FilePersistence.prototype.delete = function (correlationId, id, callback) {
        var _this = this;
        // Delete the item(s)
        var deletedItems = _.remove(this._items, function (item) { return item && item.id == id; });
        // Exit if nothing was deleted
        if (deletedItems == null && deletedItems.length == 0) {
            callback(null);
            return;
        }
        // Save item collection
        this.save(function (err) {
            if (err)
                callback(err);
            else {
                var item = deletedItems[0];
                if (item && _this._converter)
                    item = _this._converter(item);
                callback(null, item);
            }
        });
    };
    FilePersistence.prototype.convertItem = function (item) {
        return item;
    };
    FilePersistence.prototype.convertListItem = function (item) {
        if (item)
            return _.omit(item, 'custom_dat');
        else
            return null;
    };
    FilePersistence.DefaultConfig = DynamicMap_1.DynamicMap.fromTuples("options.max_page_size", 100);
    return FilePersistence;
}(AbstractPersistence_1.AbstractPersistence));
exports.FilePersistence = FilePersistence;
