let async = require('async');
let assert = require('chai').assert;

import { ComponentSet } from '../../src/ComponentSet';
import { DynamicMap } from '../../src/portability/DynamicMap';
import { ComponentConfig } from '../../src/config/ComponentConfig';
import { MemoryCache } from '../../src/cache/MemoryCache';
import { CacheFixture } from './CacheFixture';

suite('MemoryCache', ()=> {
    var cache = new MemoryCache();
    cache.configure(ComponentConfig.fromTuples(
        'options.timeout', 500
    ));

    var fixture = new CacheFixture(cache);
        
    suiteSetup((done) => {
       cache.link(new DynamicMap(), new ComponentSet());
       cache.open(done); 
    });

    suiteTeardown((done) => {
       cache.close(done); 
    });
    
    test('Basic Operations', (done) => {
        fixture.testBasicOperations(done);
    });    
   
    test('Read After Timeout', (done) => {
        async.series([
            (callback) => {
                cache.store('test', 123, (err, value) => {
                    assert.isNull(err);
                    assert.equal(value, 123);

                    callback();
                });
            },
            (callback) => {
                cache.retrieve('test', (err, value) => {
                    assert.isNull(err);
                    assert.equal(value, 123);

                    callback();
                });
            },
            (callback) => {
                setTimeout(() => {
                    cache.retrieve('test', (err, value) => {
                        assert.isNull(err);
                        assert.isNull(value);

                        callback();
                    });
                }, 1000);
            }
        ], done);
    });
    
});