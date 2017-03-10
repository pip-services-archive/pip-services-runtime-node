let assert = require('chai').assert;

import { DataPage } from '../../src/data/DataPage';

suite('DataPage', ()=> {

    test('From Params', () => {
        let page = new DataPage([], 123);
        
        assert.isArray(page.data);
        assert.equal(123, page.total);
        
        let value = page.toObject();
        assert.isNotNull(value);
        assert.isArray(value.data);
        assert.equal(123, value.total);
        assert.isUndefined(value.toObject);
    });

    test('From Object', () => {
        let page = new DataPage({ data: [], total: 123});
        
        assert.isArray(page.data);
        assert.equal(123, page.total);
        
        let value = page.toObject();
        assert.isNotNull(value);
        assert.isArray(value.data);
        assert.equal(123, value.total);
        assert.isUndefined(value.toObject);
    });

});