let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { DynamicMap } from '../../src/portability/DynamicMap';
import { ComponentSet } from '../../src/ComponentSet';
import { ComponentConfig } from '../../src/config/ComponentConfig';
import { SenecaAddon } from '../../src/addons/SenecaAddon';
import { DummyMemoryPersistence} from '../persistence/DummyMemoryPersistence';
import { DummyController } from '../logic/DummyController';
import { DummySenecaService } from './DummySenecaService';
import { LifeCycleManager } from '../../src/run/LifeCycleManager';

let DUMMY1 = {
    key: 'Key 1',
    content: 'Content 1'
};
let DUMMY2 = {
    key: 'Key 2',
    content: 'Content 2'
};

suite('DummySenecaService', ()=> {        
    let db = new DummyMemoryPersistence();
    db.configure(new ComponentConfig());

    let ctrl = new DummyController();
    ctrl.configure(new ComponentConfig());

    let service = new DummySenecaService();
    service.configure(new ComponentConfig());

    let seneca = new SenecaAddon();
    seneca.configure(new ComponentConfig());

    let components = ComponentSet.fromComponents(db, ctrl, service, seneca);

    suiteSetup((done) => {
        LifeCycleManager.linkAndOpen(new DynamicMap(), components, done);
    });
    
    suiteTeardown((done) => {
        seneca.close(() => {
            LifeCycleManager.close(components, done);
        });
    });
    
    setup((done) => {
        db.clearTestData(done);
    });
    
    test('CRUD Operations', (done) => {
        var dummy1, dummy2;

        async.series([
        // Create one dummy
            (callback) => {
                seneca.getSeneca().act(
                    {
                        role: 'dummy',
                        cmd: 'create_dummy',
                        dummy: DUMMY1
                    },
                    (err, dummy) => {
                        assert.isNull(err);
                        
                        assert.isObject(dummy);
                        assert.equal(dummy.content, DUMMY1.content);
                        assert.equal(dummy.key, DUMMY1.key);

                        dummy1 = dummy;

                        callback();
                    }
                );
            },
        // Create another dummy
            (callback) => {
                seneca.getSeneca().act(
                    {
                        role: 'dummy',
                        cmd: 'create_dummy',
                        dummy: DUMMY2
                    },
                    (err, dummy) => {
                        assert.isNull(err);
                        
                        assert.isObject(dummy);
                        assert.equal(dummy.content, DUMMY2.content);
                        assert.equal(dummy.key, DUMMY2.key);

                        dummy2 = dummy;

                        callback();
                    }
                );
            },
        // Get all dummies
            (callback) => {
                seneca.getSeneca().act(
                    {
                        role: 'dummy',
                        cmd: 'get_dummies' 
                    },
                    (err, dummies) => {
                        assert.isNull(err);
                        
                        assert.isObject(dummies);
                        assert.lengthOf(dummies.data, 2);

                        callback();
                    }
                );
            },
        // Update the dummy
            (callback) => {
                seneca.getSeneca().act(
                    {
                        role: 'dummy',
                        cmd: 'update_dummy',
                        dummy_id: dummy1.id,
                        dummy: { content: 'Updated Content 1' }
                    },
                    (err, dummy) => {
                        assert.isNull(err);
                        
                        assert.isObject(dummy);
                        assert.equal(dummy.content, 'Updated Content 1');
                        assert.equal(dummy.key, DUMMY1.key);

                        dummy1 = dummy;

                        callback();
                    }
                );
            },
        // Delete dummy
            (callback) => {
                seneca.getSeneca().act(
                    {
                        role: 'dummy',
                        cmd: 'delete_dummy',
                        dummy_id: dummy1.id
                    },
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete dummy
            (callback) => {
                seneca.getSeneca().act(
                    {
                        role: 'dummy',
                        cmd: 'get_dummy_by_id',
                        dummy_id: dummy1.id
                    },
                    (err, dummy) => {
                        assert.isNull(err);
                        
                        assert.isNull(dummy || null);

                        callback();
                    }
                );
            }
        ], done);
    });
});