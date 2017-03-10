import { ComponentSet } from '../../src/ComponentSet';
import { ComponentConfig } from '../../src/config/ComponentConfig';
import { DynamicMap } from '../../src/portability/DynamicMap';
import { ConsoleLogger } from '../../src/logs/ConsoleLogger';
import { NullCounters } from '../../src/counters/NullCounters';
import { CountersFixture } from './CountersFixture';

suite('NullCounters', ()=> {
    var log = new ConsoleLogger();
    log.configure(ComponentConfig.fromTuples(
        'options.level', 5
    ));

    var counters = new NullCounters();
    counters.configure(ComponentConfig.fromTuples(
        'options.timeout', 60000
    ));
    
    suiteSetup((done) => {
        let components = ComponentSet.fromComponents(log, counters);

        counters.link(new DynamicMap(), components);
        counters.open(done); 
    });

    suiteTeardown((done) => {
       counters.close(done); 
    });
    
    test('Simple Counters', () => {
        counters.last('Test.LastValue', 123);
        counters.increment('Test.Increment', 3);
        counters.stats('Test.Statistics', 123);
    });    
 
    test('Measure Elapsed Time', () => {
        let timer = counters.beginTiming('Test.Elapsed');
        timer.endTiming();
    });
    
});