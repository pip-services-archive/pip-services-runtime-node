"use strict";
var DynamicMap_1 = require('../portability/DynamicMap');
var Converter_1 = require('../portability/Converter');
var PagingParams = (function () {
    function PagingParams(skip, take, total) {
        this.skip = Converter_1.Converter.toNullableInteger(skip);
        this.take = Converter_1.Converter.toNullableInteger(take);
        this.total = Converter_1.Converter.toBooleanWithDefault(total, true);
    }
    PagingParams.prototype.getSkip = function (minSkip) {
        if (this.skip == null)
            return minSkip;
        if (this.skip < minSkip)
            return minSkip;
        return this.skip;
    };
    PagingParams.prototype.getTake = function (maxTake) {
        if (this.take == null)
            return maxTake;
        if (this.take < 0)
            return 0;
        if (this.take > maxTake)
            return maxTake;
        return this.take;
    };
    PagingParams.prototype.toObject = function () {
        return {
            skip: this.skip,
            take: this.take,
            total: this.total
        };
    };
    PagingParams.prototype.toJSON = function () {
        return this.toObject();
    };
    PagingParams.fromValue = function (value) {
        if (value instanceof PagingParams)
            return value;
        if (value instanceof DynamicMap_1.DynamicMap)
            return PagingParams.fromMap(value);
        var map = DynamicMap_1.DynamicMap.fromValue(value);
        return PagingParams.fromMap(map);
    };
    PagingParams.fromTuples = function () {
        var tuples = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tuples[_i - 0] = arguments[_i];
        }
        var map = new DynamicMap_1.DynamicMap();
        map.setTuplesArray(tuples);
        return PagingParams.fromMap(map);
    };
    PagingParams.fromMap = function (map) {
        var skip = map.getNullableInteger("skip");
        var take = map.getNullableInteger("take");
        var total = map.getNullableBoolean("total");
        return new PagingParams(skip, take, total);
    };
    return PagingParams;
}());
exports.PagingParams = PagingParams;
