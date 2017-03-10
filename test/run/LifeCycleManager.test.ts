let assert = require('chai').assert;
let async = require('async');

import { DynamicMap } from '../../src/portability/DynamicMap';
import { ComponentSet } from '../../src/ComponentSet';
import { ComponentConfig } from '../../src/config/ComponentConfig';
import { LifeCycleManager } from '../../src/run/LifeCycleManager';
import { NullLogger } from '../../src/logs/NullLogger';
import { NullCounters } from '../../src/counters/NullCounters';

suite('LifeCycleManager', ()=> {
    let log = new NullLogger();
    log.configure(new ComponentConfig());

    let counters = new NullCounters();
    counters.configure(new ComponentConfig());

    let components = ComponentSet.fromComponents(log, counters);
    let context = new DynamicMap();
    
    test('Link', (done) => {
        LifeCycleManager.link(context, components);
        done();
    });

    test('Link and Open', (done) => {
        LifeCycleManager.linkAndOpen(context, components, (err) => {
            assert.isNull(err);
            done(); 
        });        
    });

    test('Open', (done) => {
        LifeCycleManager.link(context, components);

        LifeCycleManager.open(components, (err) => {
            assert.isNull(err);
            done(); 
        });
    });

    test('Close', (done) => {
        LifeCycleManager.linkAndOpen(context, components, (err) => {
            assert.isNull(err);

            LifeCycleManager.close(components, (err) => {
                assert.isNull(err);
                done(); 
            });
        });        
    });

    test('Force Close', (done) => {        
        LifeCycleManager.linkAndOpen(context, components, (err) => {
            assert.isNull(err);

            LifeCycleManager.forceClose(components, (err) => {
                assert.isNull(err);
                done(); 
            });
        });        
    });
    
});