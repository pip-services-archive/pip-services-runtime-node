import { ComponentConfig } from '../../src/config/ComponentConfig';
import { NullLogger } from '../../src/logs/NullLogger';
import { LogFixture } from './LogFixture';

suite('NullLogger', ()=> {
    var log = new NullLogger();
    log.configure(new ComponentConfig());

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