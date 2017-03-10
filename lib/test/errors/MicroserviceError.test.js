"use strict";
var assert = require('chai').assert;
var MicroserviceError_1 = require('../../src/errors/MicroserviceError');
suite('MicroserviceError', function () {
    test('Create Error', function () {
        var error = new MicroserviceError_1.MicroserviceError('Undefined', 'TestComponent', 'TestError', 'Test error');
        assert.equal('TestComponent', error.component);
        assert.equal('TestError', error.code);
        assert.equal('Test error', error.message);
        error = new MicroserviceError_1.MicroserviceError().forComponent('TestComponent');
        assert.equal('Undefined', error.code);
        assert.equal('Unknown error', error.message);
    });
});
