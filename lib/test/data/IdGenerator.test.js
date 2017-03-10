"use strict";
var assert = require('chai').assert;
var IdGenerator_1 = require('../../src/data/IdGenerator');
suite('IdGenerator', function () {
    function testIds(generator, minSize) {
        var id1 = generator();
        assert.isString(id1);
        assert.isTrue(id1.length >= minSize);
        var id2 = generator();
        assert.isString(id2);
        assert.isTrue(id2.length >= minSize);
        assert.notEqual(id1, id2);
    }
    test('Short Id', function () {
        testIds(IdGenerator_1.IdGenerator.short, 8);
    });
    test('Short Id 2', function () {
        testIds(IdGenerator_1.IdGenerator.short2, 10);
    });
    test('Long Id', function () {
        testIds(IdGenerator_1.IdGenerator.uuid, 32);
    });
    // test('Long Id 2', () => {
    //     testIds(IdGenerator.uuid2, 24);
    // });    
});
