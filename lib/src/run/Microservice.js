"use strict";
var _ = require('lodash');
var fs = require('fs');
var DynamicMap_1 = require('../portability/DynamicMap');
var Category_1 = require('../config/Category');
var ConfigReader_1 = require('../config/ConfigReader');
var ComponentSet_1 = require('../ComponentSet');
var LifeCycleManager_1 = require('./LifeCycleManager');
var LogLevel_1 = require('../LogLevel');
var LogWriter_1 = require('./LogWriter');
var LogFormatter_1 = require('../logs/LogFormatter');
var Builder_1 = require('../build/Builder');
var Microservice = (function () {
    function Microservice(name, factory) {
        this._exitOnError = false;
        this._name = name;
        this._factory = factory;
        this._components = new ComponentSet_1.ComponentSet();
        this._context = new DynamicMap_1.DynamicMap();
    }
    Microservice.prototype.getName = function () {
        return this._name;
    };
    Microservice.prototype.enableExitOnError = function () {
        this._exitOnError = true;
    };
    Microservice.prototype.getConfig = function () {
        return this._config;
    };
    Microservice.prototype.setConfig = function (config) {
        this._config = config;
    };
    Microservice.prototype.loadConfig = function (configPath) {
        // Load config file
        this._config = ConfigReader_1.ConfigReader.read(configPath);
    };
    Microservice.prototype.getComponents = function () {
        return this._components;
    };
    Microservice.prototype.getContext = function () {
        return this._context;
    };
    Microservice.prototype.fatal = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i - 0] = arguments[_i];
        }
        LogWriter_1.LogWriter.fatal(this._components.getAllByCategory(Category_1.Category.Logs), LogFormatter_1.LogFormatter.format(LogLevel_1.LogLevel.Fatal, message));
    };
    Microservice.prototype.error = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i - 0] = arguments[_i];
        }
        LogWriter_1.LogWriter.error(this._components.getAllByCategory(Category_1.Category.Logs), LogFormatter_1.LogFormatter.format(LogLevel_1.LogLevel.Error, message));
    };
    Microservice.prototype.info = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i - 0] = arguments[_i];
        }
        LogWriter_1.LogWriter.info(this._components.getAllByCategory(Category_1.Category.Logs), LogFormatter_1.LogFormatter.format(LogLevel_1.LogLevel.Info, message));
    };
    Microservice.prototype.trace = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i - 0] = arguments[_i];
        }
        LogWriter_1.LogWriter.trace(this._components.getAllByCategory(Category_1.Category.Logs), LogFormatter_1.LogFormatter.format(LogLevel_1.LogLevel.Trace, message));
    };
    Microservice.prototype.build = function (callback) {
        var error = null;
        try {
            this._components = Builder_1.Builder.build(this._factory, this._config);
        }
        catch (err) {
            error = err;
        }
        callback(error);
    };
    Microservice.prototype.link = function (callback) {
        this.trace('Initializing ' + this._name + ' microservice');
        LifeCycleManager_1.LifeCycleManager.link(this._context, this._components, callback);
    };
    Microservice.prototype.open = function (callback) {
        var _this = this;
        this.trace('Opening ' + this._name + ' microservice');
        LifeCycleManager_1.LifeCycleManager.open(this._components, function (err) {
            if (err)
                callback(err);
            else {
                _this.info('Microservice ' + _this._name + ' started');
                callback(null);
            }
        });
    };
    Microservice.prototype.start = function (callback) {
        var _this = this;
        // Build and open the microservice
        this.build(function (err) {
            if (err)
                _this.exit(err, callback);
            else
                _this.link(function (err) {
                    if (err)
                        _this.exit(err, callback);
                    else
                        _this.open(function (err) {
                            if (err)
                                _this.exit(err, callback);
                            else if (callback)
                                callback(null);
                        });
                });
        });
    };
    Microservice.prototype.startWithConfig = function (config, callback) {
        this.setConfig(config);
        this.start(callback);
    };
    Microservice.prototype.startWithConfigFile = function (configPath, callback) {
        try {
            this.loadConfig(configPath);
            this.start(callback);
        }
        catch (err) {
            if (callback)
                callback(err);
            else
                throw err;
        }
    };
    Microservice.prototype.close = function (callback) {
        var _this = this;
        this.trace('Closing ' + this._name + ' microservice');
        LifeCycleManager_1.LifeCycleManager.forceClose(this._components, function (err) {
            if (err)
                _this.error(err);
            if (err)
                _this.info('Microservice ' + _this._name + ' stopped with error ' + err);
            else
                _this.info('Microservice ' + _this._name + ' stopped');
            if (callback)
                callback(err);
        });
    };
    Microservice.prototype.exit = function (err, callback) {
        var _this = this;
        if (err)
            this.fatal(err);
        this.close(function () {
            if (_this._exitOnError)
                process.exit(1);
            else if (callback)
                callback(err);
            else if (err)
                throw err;
        });
    };
    return Microservice;
}());
exports.Microservice = Microservice;
