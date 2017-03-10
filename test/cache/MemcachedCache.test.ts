let async = require('async');
let assert = require('chai').assert;

import { ComponentSet } from '../../src/ComponentSet';
import { DynamicMap } from '../../src/portability/DynamicMap';
import { ComponentConfig } from '../../src/config/ComponentConfig';
import { MemcachedCache } from '../../src/cache/MemcachedCache';
import { CacheFixture } from './CacheFixture';

suite.skip('MemcachedCache', ()=> {
    let cache = new MemcachedCache();
    cache.configure(ComponentConfig.fromTuples(
        'endpoint.host', 'localhost',
        'endpoint.port', 11211,
        'options.timeout', 500 
    ));
    
    let fixture = new CacheFixture(cache);
        
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
       
});