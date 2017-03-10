"use strict";
var assert = require('chai').assert;
var FilterParams_1 = require('../../src/data/FilterParams');
suite('FilterParams', function () {
    test('From Object', function () {
        var filter = FilterParams_1.FilterParams.fromValue({
            ids: [1, 2, 3, 4],
            search: 'ABC',
            or: {
                value1: 123,
                value2: 234
            }
        });
        assert.isTrue(filter.has('ids'));
        assert.equal(1, filter.ids[0]);
        assert.equal(1, filter.get('ids')[0]);
        assert.isTrue(filter.has('search'));
        assert.equal('ABC', filter.search);
        assert.equal('ABC', filter.getString('search'));
        assert.isTrue(filter.has('or.value1'));
        assert.equal(123, filter.or.value1);
        assert.equal(123, filter.getInteger('or.value1'));
        assert.isFalse(filter.has('or.value3'));
        assert.isFalse(filter.has('x.value1'));
        var value = filter.toObject();
        assert.equal(1, value.ids[0]);
        assert.equal('ABC', value.search);
        assert.equal(123, value.or.value1);
    });
    test('From Other Filter Params', function () {
        var otherFilter = FilterParams_1.FilterParams.fromValue({
            ids: [1, 2, 3, 4],
            search: 'ABC',
            or: {
                value1: 123,
                value2: 234
            }
        });
        var filter = new FilterParams_1.FilterParams(otherFilter);
        assert.isTrue(filter.has('ids'));
        assert.equal(1, filter.ids[0]);
        assert.equal(1, filter.get('ids')[0]);
        assert.isTrue(filter.has('search'));
        assert.equal('ABC', filter.search);
        assert.equal('ABC', filter.getString('search'));
        assert.isTrue(filter.has('or.value1'));
        assert.equal(123, filter.or.value1);
        assert.equal(123, filter.getInteger('or.value1'));
        assert.isFalse(filter.has('or.value3'));
        assert.isFalse(filter.has('x.value1'));
        var value = filter.toObject();
        assert.equal(1, value.ids[0]);
        assert.equal('ABC', value.search);
        assert.equal(123, value.or.value1);
    });
});
