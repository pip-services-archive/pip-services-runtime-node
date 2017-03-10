"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fs = require('fs');
var Category_1 = require('../config/Category');
var ComponentDescriptor_1 = require('../config/ComponentDescriptor');
var State_1 = require('../State');
var AbstractBootConfig_1 = require('./AbstractBootConfig');
var ConfigError_1 = require('../errors/ConfigError');
var FileError_1 = require('../errors/FileError');
var ConfigReader_1 = require('../config/ConfigReader');
/**
 * Boot configuration reader that gets microservice configuration from
 * JSON file on local disk.
 *
 * This is the simplest possible configuration.
 * However, in large scale deployments it may be unpractical.
 * The distrubuting configurations from a centralized configuration
 * repository may be a better option. Check other types of readers
 * to support those scenarios.
 *
 * @author Sergey Seroukhov
 * @version 1.1
 * @since 2016-06-19
 */
var FileBootConfig = (function (_super) {
    __extends(FileBootConfig, _super);
    /**
     * Creates an instance of file configuration reader component.
     */
    function FileBootConfig() {
        _super.call(this, FileBootConfig.Descriptor);
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
    FileBootConfig.prototype.configure = function (config) {
        this.checkNewStateAllowed(State_1.State.Configured);
        var options = config.getOptions();
        if (options == null || options.hasNot("path"))
            throw new ConfigError_1.ConfigError(this, "NoPath", "Missing config file path");
        _super.prototype.configure.call(this, config);
        this._path = options.getString("path");
    };
    /**
     * Opens the component, performs initialization, opens connections
     * to external services and makes the component ready for operations.
     * Opening can be done multiple times: right after linking
     * or reopening after closure.
     * @param callback a callback to report success or error in opening
     */
    FileBootConfig.prototype.open = function (callback) {
        var _this = this;
        this.checkNewStateAllowed(State_1.State.Opened);
        fs.exists(this._path, function (exists) {
            if (!exists) {
                callback(new FileError_1.FileError(_this, 'FileNotFound', 'Config file was not found at ' + _this._path).withDetails(_this._path));
            }
            else
                _super.prototype.open.call(_this, callback);
        });
    };
    /**
     * Reads microservice configuration from the source
     * @param callback a callback to be called with error
     * or retrieved microservice configuration
     */
    FileBootConfig.prototype.readConfig = function (callback) {
        var config = ConfigReader_1.ConfigReader.read(this._path);
        callback(null, config);
    };
    /**
     * Unique descriptor for the FileBootConfig component
     */
    FileBootConfig.Descriptor = new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Boot, "pip-services-runtime-boot", "file", "*");
    return FileBootConfig;
}(AbstractBootConfig_1.AbstractBootConfig));
exports.FileBootConfig = FileBootConfig;
