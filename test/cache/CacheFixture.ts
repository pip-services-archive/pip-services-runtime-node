let async = require('async');
let assert = require('chai').assert;

import { ICache } from '../../src/ICache';

export class CacheFixture {
    private _cache: ICache;
    
    constructor(cache: ICache) {
        assert.isNotNull(cache);
        this._cache = cache;
    }
        
    testBasicOperations(done) {
        async.series([
            // Set the first value
            (callback) => {
                this._cache.store('test', 123, (err, value) => {
                    assert.isNull(err);
                    assert.equal(123, value); 
                    
                    callback();
                });
            },
            // Get the first value
            (callback) => {
                this._cache.retrieve('test', (err, value) => {
                    assert.isNull(err);
                    assert.equal(123, value); 

                    callback();
                });
            },
            // Set null value
            (callback) => {
                this._cache.store('test', null, (err, value) => {
                    assert.isNull(err);
                    assert.isNull(value); 

                    callback();
                });
            },
            // Get null value
            (callback) => {
                this._cache.retrieve('test', (err, value) => {
                    assert.isNull(err);
                    assert.isNull(value); 

                    callback();
                });
            },
            // Set the second value
            (callback) => {
                this._cache.store('test', 'ABC', (err, value) => {
                    assert.isNull(err);
                    assert.equal('ABC', value); 

                    callback();
                });
            },
            // Get the second value
            (callback) => {
                this._cache.retrieve('test', (err, value) => {
                    assert.isNull(err);
                    assert.equal('ABC', value); 

                    callback();
                });
            },
            // Unset value
            (callback) => {
                this._cache.remove('test', (err) => {
                    assert.isNull(err);

                    callback();
                });
            },
            // Check unset value
            (callback) => {
                this._cache.retrieve('test', (err, value) => {
                    assert.isNull(err);
                    assert.isNull(value); 

                    callback();
                });
            }
        ], done)
    }    
}
