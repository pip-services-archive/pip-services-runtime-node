"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var DynamicMap_1 = require('../portability/DynamicMap');
var FilterParams = (function (_super) {
    __extends(FilterParams, _super);
    function FilterParams(map) {
        _super.call(this);
        if (map != null)
            _.assignIn(this, map);
    }
    FilterParams.fromValue = function (value) {
        if (value instanceof FilterParams)
            return value;
        if (value instanceof DynamicMap_1.DynamicMap)
            return new FilterParams(value);
        return new FilterParams(DynamicMap_1.DynamicMap.fromValue(value));
    };
    FilterParams.fromTuples = function () {
        var tuples = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tuples[_i - 0] = arguments[_i];
        }
        var filter = new FilterParams();
        filter.setTuplesArray(tuples);
        return filter;
    };
    FilterParams.fromMap = function (map) {
        return new FilterParams(map);
    };
    return FilterParams;
}(DynamicMap_1.DynamicMap));
exports.FilterParams = FilterParams;
