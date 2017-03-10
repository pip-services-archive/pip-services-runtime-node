"use strict";
var assert = require('chai').assert;
var DataPage_1 = require('../../src/data/DataPage');
suite('DataPage', function () {
    test('From Params', function () {
        var page = new DataPage_1.DataPage([], 123);
        assert.isArray(page.data);
        assert.equal(123, page.total);
        var value = page.toObject();
        assert.isNotNull(value);
        assert.isArray(value.data);
        assert.equal(123, value.total);
        assert.isUndefined(value.toObject);
    });
    test('From Object', function () {
        var page = new DataPage_1.DataPage({ data: [], total: 123 });
        assert.isArray(page.data);
        assert.equal(123, page.total);
        var value = page.toObject();
        assert.isNotNull(value);
        assert.isArray(value.data);
        assert.equal(123, value.total);
        assert.isUndefined(value.toObject);
    });
});
