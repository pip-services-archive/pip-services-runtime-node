import { ComponentSet } from '../../src/ComponentSet';
import { ComponentConfig } from '../../src/config/ComponentConfig';
import { ConsoleLogger } from '../../src/logs/ConsoleLogger';
import { LogCounters } from '../../src/counters/LogCounters';
import { DynamicMap } from '../../src/portability/DynamicMap';
import { CountersFixture } from './CountersFixture';

suite('LogCounters', ()=> {
    var log = new ConsoleLogger();
    log.configure(ComponentConfig.fromTuples(
        'options.level', 5
    ));

    var counters = new LogCounters();
    counters.configure(ComponentConfig.fromTuples(
        'options.timeout', 60000
    ));

    var fixture = new CountersFixture(counters);
        
    suiteSetup((done) => {
        let components = ComponentSet.fromComponents(log, counters);

        counters.link(new DynamicMap(), components);
        counters.open(done); 
    });

    suiteTeardown((done) => {
       counters.close(done); 
    });
    
    test('Simple Counters', () => {
        fixture.testSimpleCounters();
    });    
   
    test('Measure Elapsed Time', (done) => {
        fixture.testElapsedTime(done);
    });
    
});