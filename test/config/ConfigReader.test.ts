let async = require('async');
let assert = require('chai').assert;

import { ConfigReader } from '../../src/config/ConfigReader';
import { DynamicMap } from '../../src/portability/DynamicMap';

suite('ConfigReader', () => {
    
    test('TestJson', (done) => {
        var config = ConfigReader.read('./test/config/options.json');
        var content = config.getRawContent();

        assert.isNotNull(config);
        assert.equal(123, content.getInteger('test'));

        done();
    });

    test('TestYaml', (done) => {
        var config = ConfigReader.read('./test/config/options.yaml');
        var content = config.getRawContent();

        assert.isNotNull(config);
        assert.equal(123, content.getInteger('test'));

        done();
    });

});