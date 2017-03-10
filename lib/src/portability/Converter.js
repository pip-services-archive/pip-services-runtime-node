"use strict";
var _ = require('lodash');
var DynamicMap_1 = require('./DynamicMap');
var Converter = (function () {
    function Converter() {
    }
    Converter.toNullableString = function (value) {
        if (value == null)
            return null;
        if (_.isString(value))
            return value;
        if (_.isDate(value))
            value.toISOString();
        return value.toString();
    };
    Converter.toString = function (value) {
        return Converter.toStringWithDefault(value, "");
    };
    Converter.toStringWithDefault = function (value, defaultValue) {
        return Converter.toNullableString(value) || defaultValue;
    };
    Converter.toNullableBoolean = function (value) {
        if (value == null)
            return null;
        if (_.isBoolean(value))
            return value;
        if (_.isNumber(value))
            return !!value;
        value = value.toString().toLowerCase();
        if (value == '1' || value == 'true' || value == 't'
            || value == 'yes' || value == 'y')
            return true;
        if (value == '0' || value == 'false' || value == 'f'
            || value == 'no' || value == 'n')
            return false;
        return null;
    };
    Converter.toBoolean = function (value) {
        return Converter.toBooleanWithDefault(value, false);
    };
    Converter.toBooleanWithDefault = function (value, defaultValue) {
        if (defaultValue === void 0) { defaultValue = false; }
        var result = Converter.toNullableBoolean(value);
        return result != null ? result : defaultValue;
    };
    Converter.toNullableInteger = function (value) {
        if (value == null)
            return null;
        if (_.isNumber(value))
            return Math.ceil(value);
        if (_.isDate(value))
            return value.getTime();
        if (_.isBoolean(value))
            return value ? 1 : 0;
        var result = parseInt(value);
        return isNaN(result) ? null : result;
    };
    Converter.toInteger = function (value) {
        return Converter.toIntegerWithDefault(value, 0);
    };
    Converter.toIntegerWithDefault = function (value, defaultValue) {
        if (defaultValue === void 0) { defaultValue = 0; }
        var result = Converter.toNullableInteger(value);
        return result != null ? result : defaultValue;
    };
    Converter.toNullableLong = function (value) {
        return Converter.toNullableInteger(value);
    };
    Converter.toLong = function (value) {
        return Converter.toInteger(value);
    };
    Converter.toLongWithDefault = function (value, defaultValue) {
        if (defaultValue === void 0) { defaultValue = 0; }
        return Converter.toIntegerWithDefault(value, defaultValue);
    };
    Converter.toNullableFloat = function (value) {
        if (value == null)
            return null;
        if (_.isNumber(value))
            return value;
        if (_.isDate(value))
            return value.getTime();
        if (_.isBoolean(value))
            return value ? 1 : 0;
        var result = parseFloat(value);
        return isNaN(result) ? null : result;
    };
    Converter.toFloat = function (value) {
        return Converter.toFloatWithDefault(value, 0);
    };
    Converter.toFloatWithDefault = function (value, defaultValue) {
        if (defaultValue === void 0) { defaultValue = 0; }
        var result = Converter.toNullableFloat(value);
        return result != null ? result : defaultValue;
    };
    Converter.toNullableDate = function (value) {
        if (value == null)
            return null;
        if (_.isDate(value))
            return value;
        if (_.isNumber(value))
            return new Date(value);
        var result = Date.parse(value);
        return isNaN(result) ? null : new Date(result);
    };
    Converter.toDate = function (value) {
        return Converter.toDateWithDefault(value, new Date());
    };
    Converter.toDateWithDefault = function (value, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        var result = Converter.toNullableDate(value);
        return result != null ? result : defaultValue;
    };
    Converter.toNullableArray = function (value) {
        // Return null when nothing found
        if (value == null) {
            return null;
        }
        else if (_.isArray(value)) {
            return value;
        }
        else {
            var array = [];
            array.push(value);
            return array;
        }
    };
    Converter.toArray = function (value) {
        var result = Converter.toNullableArray(value);
        return value || [];
    };
    Converter.toArrayWithDefault = function (value, defaultValue) {
        var result = Converter.toNullableArray(value);
        return value || defaultValue;
    };
    Converter.listToArray = function (value) {
        if (value == null)
            return [];
        if (_.isString(value))
            value = value.split(',');
        return _.isArray(value) ? value : [value];
    };
    Converter.fromMultiString = function (value, language) {
        if (language === void 0) { language = 'en'; }
        if (value == null || _.isString(value))
            return value;
        if (value[language] != null && value[language] != '')
            return '' + value[language];
        if (value.en != null && value.en != '')
            return '' + value.en;
        for (var prop in value) {
            if (value[prop] != null && value[prop] != '')
                return '' + value[prop];
        }
        return null;
    };
    Converter.toNullableMap = function (value) {
        if (value == null)
            return null;
        if (value instanceof DynamicMap_1.DynamicMap)
            return value;
        return new DynamicMap_1.DynamicMap(value);
    };
    Converter.toMap = function (value) {
        var map = Converter.toNullableMap(value);
        if (map == null)
            return new DynamicMap_1.DynamicMap();
        return map;
    };
    Converter.toMapWithDefault = function (value, defaultValue) {
        return Converter.toNullableMap(value) || defaultValue;
    };
    return Converter;
}());
exports.Converter = Converter;
