let assert = require('chai').assert;

import { IdGenerator } from '../../src/data/IdGenerator';

suite('IdGenerator', ()=> {

    function testIds(generator, minSize) {
        let id1 = generator();
        assert.isString(id1);
        assert.isTrue(id1.length >= minSize);

        let id2 = generator();         
        assert.isString(id2);
        assert.isTrue(id2.length >= minSize);
        assert.notEqual(id1, id2);
    }
    
    test('Short Id', () => {
        testIds(IdGenerator.short, 8);
    });    

    test('Short Id 2', () => {
        testIds(IdGenerator.short2, 10);
    });    

    test('Long Id', () => {
        testIds(IdGenerator.uuid, 32);
    });    

    // test('Long Id 2', () => {
    //     testIds(IdGenerator.uuid2, 24);
    // });    

});