"use strict";
var _ = require('lodash');
var DataPage = (function () {
    function DataPage(data, total) {
        // It it's set as an object
        if (data && !_.isArray(data)) {
            this.data = data.data;
            this.total = data.total;
        }
        else {
            this.data = data;
            this.total = total;
        }
    }
    DataPage.prototype.toObject = function () {
        return {
            data: this.data,
            total: this.total
        };
    };
    DataPage.prototype.toJSON = function () {
        return this.toObject();
    };
    return DataPage;
}());
exports.DataPage = DataPage;
