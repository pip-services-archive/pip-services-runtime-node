"use strict";
var async = require('async');
var assert = require('chai').assert;
var ConfigReader_1 = require('../../src/config/ConfigReader');
suite('ConfigReader', function () {
    test('TestJson', function (done) {
        var config = ConfigReader_1.ConfigReader.read('./test/config/options.json');
        var content = config.getRawContent();
        assert.isNotNull(config);
        assert.equal(123, content.getInteger('test'));
        done();
    });
    test('TestYaml', function (done) {
        var config = ConfigReader_1.ConfigReader.read('./test/config/options.yaml');
        var content = config.getRawContent();
        assert.isNotNull(config);
        assert.equal(123, content.getInteger('test'));
        done();
    });
});
