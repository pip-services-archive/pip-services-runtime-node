"use strict";
var assert = require('chai').assert;
var PagingParams_1 = require('../../src/data/PagingParams');
suite('PagingParams', function () {
    test('From Params', function () {
        var paging = new PagingParams_1.PagingParams(123, 234, true);
        assert.equal(123, paging.skip);
        assert.equal(234, paging.take);
        assert.isTrue(paging.total);
        var value = paging.toObject();
        assert.equal(123, value.skip);
        assert.equal(234, value.take);
        assert.isTrue(value.total);
        assert.isUndefined(value.toObject);
    });
    test('From Strings', function () {
        var paging = new PagingParams_1.PagingParams("123", "234", "yes");
        assert.equal(123, paging.skip);
        assert.equal(234, paging.take);
        assert.isTrue(paging.total);
        var value = paging.toObject();
        assert.equal(123, value.skip);
        assert.equal(234, value.take);
        assert.isTrue(value.total);
        assert.isUndefined(value.toObject);
    });
    test('From Object', function () {
        var paging = PagingParams_1.PagingParams.fromValue({ skip: 123, take: 234, paging: true });
        assert.equal(123, paging.skip);
        assert.equal(234, paging.take);
        assert.isTrue(paging.total);
        var value = paging.toObject();
        assert.equal(123, value.skip);
        assert.equal(234, value.take);
        assert.isTrue(value.total);
        assert.isUndefined(value.toObject);
    });
});
