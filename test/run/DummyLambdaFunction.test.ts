let _ = require('lodash');
let assert = require('chai').assert;

import { DummyLambdaFunction } from './DummyLambdaFunction';
import { MicroserviceConfig } from '../../src/config/MicroserviceConfig';

let buildConfig = MicroserviceConfig.fromValue({
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

suite('DummyLambdaFunction', ()=> {    
    let lambda = new DummyLambdaFunction();

    suiteSetup((done) => {
        lambda.setConfig(buildConfig);
        lambda.start(done);
        //done();
    });
    
    suiteTeardown((done) => {
        lambda.stop(done);
    });
                
    test('Ping', (done) => {
        lambda.getHandler()(
            {
                cmd: 'get_dummies'
            },
            { 
                done: (err, dummies) => {
                    assert.isNull(err);
                    
                    assert.isObject(dummies);
                    done();
                }
            }
        );
    });
});