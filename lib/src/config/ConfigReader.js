"use strict";
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var MicroserviceConfig_1 = require('./MicroserviceConfig');
var FileError_1 = require('../errors/FileError');
/**
 * Configuration reader capable of reading various formats:
 * JavaScript, JSON, YAML, XML, etc.
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-27
 */
var ConfigReader = (function () {
    function ConfigReader() {
    }
    /**
     * Reads configuration from a file.
     * The file type is automatically determined by its extension
     * @param filePath a path to configuration file.
     * @return MicroserviceConfig with file content
     * @throws MicroserviceError when reading fails.
     */
    ConfigReader.read = function (filePath) {
        // Check if config file is present
        if (!fs.existsSync(filePath)) {
            throw new FileError_1.FileError('FileNotFound', 'Config file was not found at ' + filePath);
        }
        var ext = path.extname(filePath).toLowerCase();
        if (ext == '.js')
            return ConfigReader.readJavascript(filePath);
        else if (ext == '.json')
            return ConfigReader.readJson(filePath);
        else if (ext == '.yaml')
            return ConfigReader.readYaml(filePath);
        // By default read as JSON
        return ConfigReader.readJson(filePath);
    };
    /**
     * Reads configuration from JSON file.
     * @param filePath a path to configuration file.
     * @return MicroserviceConfig with file content
     * @throws MicroserviceError when reading fails.
     */
    ConfigReader.readJson = function (filePath) {
        // Check if config file is present
        if (!fs.existsSync(filePath)) {
            throw new FileError_1.FileError('FileNotFound', 'Config file was not found at ' + filePath);
        }
        try {
            var text = fs.readFileSync(filePath, 'utf8');
            var content = JSON.parse(text);
            return MicroserviceConfig_1.MicroserviceConfig.fromValue(content);
        }
        catch (ex) {
            throw new FileError_1.FileError('ReadFailed', 'Failed reading configuration from ' + filePath + ': ' + ex)
                .withDetails(filePath)
                .wrap(ex);
        }
    };
    /**
     * Reads configuration from JavaScript file.
     * @param filePath a path to configuration file.
     * @return MicroserviceConfig with file content
     * @throws MicroserviceError when reading fails.
     */
    ConfigReader.readJavascript = function (filePath) {
        // Check if config file is present
        if (!fs.existsSync(filePath)) {
            throw new FileError_1.FileError('FileNotFound', 'Config file was not found at ' + filePath);
        }
        try {
            var content = require(filePath);
            return MicroserviceConfig_1.MicroserviceConfig.fromValue(content);
        }
        catch (ex) {
            throw new FileError_1.FileError('ReadFailed', 'Failed reading configuration from ' + filePath + ': ' + ex)
                .withDetails(filePath)
                .wrap(ex);
        }
    };
    /**
     * Reads configuration from YAML file.
     * @param filePath a path to configuration file.
     * @return MicroserviceConfig with file content
     * @throws MicroserviceError when reading fails.
     */
    ConfigReader.readYaml = function (filePath) {
        // Check if config file is present
        if (!fs.existsSync(filePath)) {
            throw new FileError_1.FileError('FileNotFound', 'Config file was not found at ' + filePath);
        }
        try {
            var text = fs.readFileSync(filePath, 'utf8');
            var content = yaml.load(text);
            return MicroserviceConfig_1.MicroserviceConfig.fromValue(content);
        }
        catch (ex) {
            throw new FileError_1.FileError('ReadFailed', 'Failed reading configuration from ' + filePath + ': ' + ex)
                .withDetails(filePath)
                .wrap(ex);
        }
    };
    return ConfigReader;
}());
exports.ConfigReader = ConfigReader;
