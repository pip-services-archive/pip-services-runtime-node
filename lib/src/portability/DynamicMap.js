"use strict";
var _ = require('lodash');
var Converter_1 = require('./Converter');
var DynamicMap = (function () {
    function DynamicMap(map) {
        if (map != null)
            _.assignIn(this, map);
    }
    /********* Getters *********/
    DynamicMap.prototype.get = function (propName) {
        return _.get(this, propName);
    };
    DynamicMap.prototype.has = function (propName) {
        return _.has(this, propName);
    };
    DynamicMap.prototype.hasNot = function (propName) {
        return !_.has(this, propName);
    };
    DynamicMap.prototype.getNullableMap = function (propName) {
        var value = this.get(propName);
        return Converter_1.Converter.toNullableMap(value);
    };
    DynamicMap.prototype.getMap = function (propName) {
        var value = this.get(propName);
        return Converter_1.Converter.toMap(value);
    };
    DynamicMap.prototype.getMapWithDefault = function (propName, defaultValue) {
        var value = this.get(propName);
        return Converter_1.Converter.toMapWithDefault(value, defaultValue);
    };
    DynamicMap.prototype.getNullableArray = function (path) {
        var value = this.get(path);
        return Converter_1.Converter.toNullableArray(value);
    };
    DynamicMap.prototype.getArray = function (path) {
        var value = this.getNullableArray(path);
        return value != null ? value : [];
    };
    DynamicMap.prototype.getArrayWithDefault = function (path, defaultValue) {
        var value = this.getNullableArray(path);
        return value != null ? value : defaultValue;
    };
    DynamicMap.prototype.getNullableString = function (propName) {
        var value = this.get(propName);
        return Converter_1.Converter.toNullableString(value);
    };
    DynamicMap.prototype.getString = function (propName) {
        return this.getStringWithDefault(propName, "");
    };
    DynamicMap.prototype.getStringWithDefault = function (propName, defaultValue) {
        var value = this.get(propName);
        return Converter_1.Converter.toStringWithDefault(value, defaultValue);
    };
    DynamicMap.prototype.getNullableBoolean = function (propName) {
        var value = this.get(propName);
        return Converter_1.Converter.toNullableBoolean(value);
    };
    DynamicMap.prototype.getBoolean = function (propName) {
        return this.getBooleanWithDefault(propName, false);
    };
    DynamicMap.prototype.getBooleanWithDefault = function (propName, defaultValue) {
        var value = this.get(propName);
        return Converter_1.Converter.toBooleanWithDefault(value, defaultValue);
    };
    DynamicMap.prototype.getNullableInteger = function (propName) {
        var value = this.get(propName);
        return Converter_1.Converter.toNullableInteger(value);
    };
    DynamicMap.prototype.getInteger = function (propName) {
        return this.getIntegerWithDefault(propName, 0);
    };
    DynamicMap.prototype.getIntegerWithDefault = function (propName, defaultValue) {
        var value = this.get(propName);
        return Converter_1.Converter.toIntegerWithDefault(value, defaultValue);
    };
    DynamicMap.prototype.getNullableLong = function (propName) {
        var value = this.get(propName);
        return Converter_1.Converter.toNullableLong(value);
    };
    DynamicMap.prototype.getLong = function (propName) {
        return this.getLongWithDefault(propName, 0);
    };
    DynamicMap.prototype.getLongWithDefault = function (propName, defaultValue) {
        var value = this.get(propName);
        return Converter_1.Converter.toLongWithDefault(value, defaultValue);
    };
    DynamicMap.prototype.getNullableFloat = function (propName) {
        var value = this.get(propName);
        return Converter_1.Converter.toNullableFloat(value);
    };
    DynamicMap.prototype.getFloat = function (propName) {
        return this.getIntegerWithDefault(propName, 0);
    };
    DynamicMap.prototype.getFloatWithDefault = function (propName, defaultValue) {
        var value = this.get(propName);
        return Converter_1.Converter.toFloatWithDefault(value, defaultValue);
    };
    DynamicMap.prototype.getNullableDate = function (propName) {
        var value = this.get(propName);
        return Converter_1.Converter.toNullableDate(value);
    };
    DynamicMap.prototype.getDate = function (propName) {
        return this.getDateWithDefault(propName, new Date());
    };
    DynamicMap.prototype.getDateWithDefault = function (propName, defaultValue) {
        var value = this.get(propName);
        return Converter_1.Converter.toDateWithDefault(value, defaultValue);
    };
    /************ Setters ************/
    DynamicMap.prototype.set = function (propName, value) {
        _.set(this, propName, value);
    };
    DynamicMap.prototype.setTuplesArray = function (values) {
        for (var i = 0; i < values.length; i += 2) {
            if (i + 1 >= values.length)
                break;
            var propName = Converter_1.Converter.toString(values[i]);
            var propValue = values[i + 1];
            _.set(this, propName, propValue);
        }
    };
    DynamicMap.prototype.setTuples = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i - 0] = arguments[_i];
        }
        this.setTuplesArray(values);
    };
    DynamicMap.prototype.remove = function (propName) {
        _.unset(this, propName);
    };
    DynamicMap.prototype.removeAll = function () {
        var _this = this;
        var propNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            propNames[_i - 0] = arguments[_i];
        }
        _.each(propNames, function (propName) { _.unset(_this, propName); });
    };
    /********** Merging **********/
    DynamicMap.merge = function (dest, source, deep) {
        if (dest == null)
            dest = new DynamicMap();
        if (source == null)
            return dest;
        if (deep)
            _.defaultsDeep(dest, source);
        else
            _.defaults(dest, source);
        return dest;
    };
    DynamicMap.setDefaults = function (dest, source) {
        return DynamicMap.merge(dest, source, true);
    };
    DynamicMap.prototype.merge = function (source, deep) {
        var dest = new DynamicMap(this);
        return DynamicMap.merge(dest, source, deep);
    };
    DynamicMap.prototype.mergeDeep = function (source) {
        return this.merge(source, true);
    };
    DynamicMap.prototype.setDefaults = function (defaults) {
        return this.merge(defaults, true);
    };
    /*********** Other Utilities ***********/
    DynamicMap.prototype.assignTo = function (value) {
        _.assign(value, this);
    };
    DynamicMap.prototype.pick = function () {
        var propNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            propNames[_i - 0] = arguments[_i];
        }
        var values = _.pick(this, propNames);
        return new DynamicMap(values);
    };
    DynamicMap.prototype.omit = function () {
        var propNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            propNames[_i - 0] = arguments[_i];
        }
        var values = _.omit(this, propNames);
        return new DynamicMap(values);
    };
    DynamicMap.prototype.toObject = function () {
        return _.assign({}, this);
    };
    DynamicMap.prototype.toJSON = function () {
        return this.toObject();
    };
    /********* Class constructors ********/
    /**
     * Creates a dynamic map from free-form object
     * by converting it into the map.
     * @param value a free-form object
     * @return a constructed dynamic map
     */
    DynamicMap.fromValue = function (value) {
        var result = new DynamicMap();
        // Copy over
        _.assignIn(result, value);
        return result;
    };
    /**
     * Creates a dynamic map from list of
     * <path> + <value> tuples
     * @param values types that contain property path
     * following with property value
     * @return a constructed dynamic map
     */
    DynamicMap.fromTuples = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i - 0] = arguments[_i];
        }
        var map = new DynamicMap();
        map.setTuplesArray(values);
        return map;
    };
    return DynamicMap;
}());
exports.DynamicMap = DynamicMap;
