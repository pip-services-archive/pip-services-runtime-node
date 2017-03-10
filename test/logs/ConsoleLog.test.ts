import { ComponentConfig } from '../../src/config/ComponentConfig';
import { ConsoleLogger } from '../../src/logs/ConsoleLogger';
import { LogFixture } from './LogFixture';
import { LogLevel } from '../../src/LogLevel';

suite('ConsoleLogger', ()=> {
    var log = new ConsoleLogger();
    log.configure(ComponentConfig.fromTuples(
        'options.level', LogLevel.Trace
    ));

    var fixture = new LogFixture(log);
    
    test('Log Level', () => {
        fixture.testLogLevel();
    });    

    test('Text Output', () => {
        fixture.testTextOutput();
    });

    test('Mixed Output', () => {
        fixture.testMixedOutput();
    });
});