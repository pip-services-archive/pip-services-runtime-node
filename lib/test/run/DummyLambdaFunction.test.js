"use strict";
var _ = require('lodash');
var assert = require('chai').assert;
var DummyLambdaFunction_1 = require('./DummyLambdaFunction');
var MicroserviceConfig_1 = require('../../src/config/MicroserviceConfig');
var buildConfig = MicroserviceConfig_1.MicroserviceConfig.fromValue({
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
    }
});
suite('DummyLambdaFunction', function () {
    var lambda = new DummyLambdaFunction_1.DummyLambdaFunction();
    suiteSetup(function (done) {
        lambda.setConfig(buildConfig);
        lambda.start(done);
        //done();
    });
    suiteTeardown(function (done) {
        lambda.stop(done);
    });
    test('Ping', function (done) {
        lambda.getHandler()({
            cmd: 'get_dummies'
        }, {
            done: function (err, dummies) {
                assert.isNull(err);
                assert.isObject(dummies);
                done();
            }
        });
    });
});
