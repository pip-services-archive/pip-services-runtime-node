"use strict";
var DynamicMap_1 = require('../portability/DynamicMap');
var ComponentConfig_1 = require('./ComponentConfig');
/**
 * Configuration for the entire microservice.
 * It can be either stored in JSON file on disk,
 * kept in remote configuration registry or hardcoded within test.
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
var MicroserviceConfig = (function () {
    /**
     * Creates an empty instance of the microservice configuration.
     * It can be filled with data manually or loaded from the file.
     */
    function MicroserviceConfig(content) {
        this._content = content || new DynamicMap_1.DynamicMap();
    }
    /**
     * Gets the raw content of the configuration as dynamic map
     * @return dynamic map with all microservice configuration parameters.
     */
    MicroserviceConfig.prototype.getRawContent = function () {
        return this._content;
    };
    /**
     * Gets configurations of components for specific section.
     * @param category a category that defines a section within microservice configuration
     * @return an array with components configurations
     */
    MicroserviceConfig.prototype.getSection = function (category) {
        var configs = [];
        var values = this._content.getArray(category);
        for (var i = 0; i < values.length; i++) {
            var content = DynamicMap_1.DynamicMap.fromValue(values[i]);
            configs.push(new ComponentConfig_1.ComponentConfig(category, content));
        }
        return configs;
    };
    /**
     * Removes specified sections from the configuration.
     * This method can be used to suppress certain functionality in the microservice
     * like api services when microservice runs inside Lambda function.
     * @param categories a list of categories / section names to be removed.
     */
    MicroserviceConfig.prototype.removeSections = function () {
        var categories = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            categories[_i - 0] = arguments[_i];
        }
        for (var i = 0; i < categories.length; i++) {
            this._content.remove(categories[i]);
        }
    };
    /**
     * Creates microservice configuration using free-form objects.
     * @param value a free-form object
     * @return constructed microservice configuration
     */
    MicroserviceConfig.fromValue = function (value) {
        var content = DynamicMap_1.DynamicMap.fromValue(value);
        return new MicroserviceConfig(content);
    };
    /**
     * Creates instance of the microservice configuration and
     * initializes it with hardcoded parameters.
     * The parameters shall be specified with key/value tuples as:
     * 'key1', value1, 'key2', value2, ...
     * @param tuples list of parameters with key-value tuples
     * @return constructed microservice configuration
     */
    MicroserviceConfig.fromTuples = function () {
        var tuples = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tuples[_i - 0] = arguments[_i];
        }
        var content = new DynamicMap_1.DynamicMap();
        content.setTuplesArray(tuples);
        return new MicroserviceConfig(content);
    };
    return MicroserviceConfig;
}());
exports.MicroserviceConfig = MicroserviceConfig;
