let assert = require('chai').assert;

import { PagingParams } from '../../src/data/PagingParams';

suite('PagingParams', ()=> {

    test('From Params', () => {
        let paging = new PagingParams(123, 234, true);

        assert.equal(123, paging.skip);
        assert.equal(234, paging.take);
        assert.isTrue(paging.total);
        
        let value = paging.toObject();
        assert.equal(123, value.skip);
        assert.equal(234, value.take);
        assert.isTrue(value.total);
        assert.isUndefined(value.toObject);
    });

    test('From Strings', () => {
        let paging = new PagingParams("123", "234", "yes");
        
        assert.equal(123, paging.skip);
        assert.equal(234, paging.take);
        assert.isTrue(paging.total);
        
        let value = paging.toObject();
        assert.equal(123, value.skip);
        assert.equal(234, value.take);
        assert.isTrue(value.total);
        assert.isUndefined(value.toObject);
    });


    test('From Object', () => {
        let paging = PagingParams.fromValue({ skip: 123, take: 234, paging: true });
        
        assert.equal(123, paging.skip);
        assert.equal(234, paging.take);
        assert.isTrue(paging.total);
        
        let value = paging.toObject();
        assert.equal(123, value.skip);
        assert.equal(234, value.take);
        assert.isTrue(value.total);
        assert.isUndefined(value.toObject);
    });

});