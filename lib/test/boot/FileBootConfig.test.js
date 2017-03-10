"use strict";
var async = require('async');
var assert = require('chai').assert;
var ComponentSet_1 = require('../../src/ComponentSet');
var DynamicMap_1 = require('../../src/portability/DynamicMap');
var ComponentConfig_1 = require('../../src/config/ComponentConfig');
var FileBootConfig_1 = require('../../src/boot/FileBootConfig');
suite('FileBootConfig', function () {
    var config = new FileBootConfig_1.FileBootConfig();
    config.configure(ComponentConfig_1.ComponentConfig.fromTuples('options.path', './test/boot/options.json'));
    test('Read', function (done) {
        async.series([
            function (callback) {
                config.link(new DynamicMap_1.DynamicMap(), new ComponentSet_1.ComponentSet());
                callback();
            },
            function (callback) {
                config.open(callback);
            },
            function (callback) {
                config.readConfig(function (err, config) {
                    assert.isNull(err);
                    assert.isDefined(config);
                    assert.equal(123, config.getRawContent().getInteger('test'));
                    callback();
                });
            },
            function (callback) {
                config.close(callback);
            }
        ], done);
    });
});
