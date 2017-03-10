let assert = require('chai').assert;

import { MicroserviceError } from '../../src/errors/MicroserviceError';

suite('MicroserviceError', ()=> {
    test('Create Error', () => {
        let error = new MicroserviceError('Undefined', 'TestComponent', 'TestError', 'Test error');
        assert.equal('TestComponent', error.component);
        assert.equal('TestError', error.code);
        assert.equal('Test error', error.message);
        
        error = new MicroserviceError().forComponent('TestComponent');
        assert.equal('Undefined', error.code);
        assert.equal('Unknown error', error.message);
    });    
});