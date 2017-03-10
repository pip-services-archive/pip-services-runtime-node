let _ = require('lodash');
let assert = require('chai').assert;

import { DummySenecaPlugin } from './DummySenecaPlugin';

let buildConfig = {
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

suite('DummySenecaPlugin', ()=> {    
    let seneca;
    let plugin = new DummySenecaPlugin();

    suiteSetup((done) => {
        seneca = require('seneca')();
        seneca.use(plugin.entry(buildConfig));
        done();
    });
    
    suiteTeardown((done) => {
        seneca.close(done);
    });
                
    test('Ping', (done) => {
        var dummy1, dummy2;

        seneca.act(
            {
                role: 'dummy',
                cmd: 'get_dummies' 
            },
            (err, dummies) => {
                assert.isNull(err);                
                assert.isObject(dummies);
                done();
            }
        );
    });
});