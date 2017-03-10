"use strict";
var _ = require('lodash');
var assert = require('chai').assert;
var DummySenecaPlugin_1 = require('./DummySenecaPlugin');
var buildConfig = {
    logs: {
        descriptor: {
            type: 'console'
        }
    },
    persistence: {
        descriptor: {
            type: 'memory'
        }
    },
    controllers: {
        descriptor: {
            type: '*'
        }
    },
    services: {
        descriptor: {
            type: 'seneca'
        }
    }
};
suite('DummySenecaPlugin', function () {
    var seneca;
    var plugin = new DummySenecaPlugin_1.DummySenecaPlugin();
    suiteSetup(function (done) {
        seneca = require('seneca')();
        seneca.use(plugin.entry(buildConfig));
        done();
    });
    suiteTeardown(function (done) {
        seneca.close(done);
    });
    test('Ping', function (done) {
        var dummy1, dummy2;
        seneca.act({
            role: 'dummy',
            cmd: 'get_dummies'
        }, function (err, dummies) {
            assert.isNull(err);
            assert.isObject(dummies);
            done();
        });
    });
});
