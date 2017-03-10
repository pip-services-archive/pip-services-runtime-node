let assert = require('chai').assert;
let async = require('async');

import { MicroserviceConfig } from '../../src/config/MicroserviceConfig';
import { ConfigReader } from '../../src/config/ConfigReader';
import { Builder } from '../../src/build/Builder';
import { DummyFactory } from './DummyFactory';

let buildConfig = MicroserviceConfig.fromTuples(
    "logs.descriptor.type", "console",
    "counters.descriptor.type", "log",
    "cache.descriptor.type", "memory",
    "persistence.descriptor.type", "file",
    "persistence.options.path", "dummies.json",
    "persistence.options.data", [],
    "controllers.descriptor.type", "*",
    "services.descriptor.type", "rest",
    "services.descriptor.version", "1.0",
    "services.endpoint.port", 3000
);

suite('Builder', ()=> {
    
    test('Build Defaults', (done) => {
        let config = new MicroserviceConfig();
        let components = Builder.build(DummyFactory.Instance, config);
        assert.lengthOf(components.getAllOrdered(), 3);
        done();
    });

    test('Build with Config', (done) => {
        let config = buildConfig;
        let components = Builder.build(DummyFactory.Instance, config);
        assert.lengthOf(components.getAllOrdered(), 6);
        done();
    });

    test('Build with File', (done) => {
        let config = ConfigReader.read('./test/build/config.json');
        let components = Builder.build(DummyFactory.Instance, config);
        assert.lengthOf(components.getAllOrdered(), 7);
        done();
    });
    
});