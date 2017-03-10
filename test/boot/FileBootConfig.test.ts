let async = require('async');
let assert = require('chai').assert;

import { ComponentSet } from '../../src/ComponentSet';
import { DynamicMap } from '../../src/portability/DynamicMap';
import { ComponentConfig } from '../../src/config/ComponentConfig';
import { FileBootConfig } from '../../src/boot/FileBootConfig';

suite('FileBootConfig', () => {
    let config = new FileBootConfig();
    config.configure(ComponentConfig.fromTuples(
        'options.path', './test/boot/options.json' 
    ));
    
    test('Read', (done) => {
        async.series([
            (callback) => {
                config.link(new DynamicMap(), new ComponentSet());
                callback();
            },
            (callback) => {
                config.open(callback);
            },
            (callback) => {
                config.readConfig((err, config) => {
                    assert.isNull(err); 
                    
                    assert.isDefined(config);
                    assert.equal(123, config.getRawContent().getInteger('test'));

                    callback();
                });
            },
            (callback) => {
                config.close(callback);
            }
        ], done);
    });
});