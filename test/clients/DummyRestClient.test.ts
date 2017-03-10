let _ = require('lodash');

import { ComponentSet } from '../../src/ComponentSet';
import { DynamicMap } from '../../src/portability/DynamicMap';
import { ComponentConfig } from '../../src/config/ComponentConfig';
import { LifeCycleManager } from '../../src/run/LifeCycleManager';

import { DummyMemoryPersistence } from '../persistence/DummyMemoryPersistence';
import { DummyController } from '../logic/DummyController';
import { DummyRestService } from '../services/DummyRestService';
import { DummyRestClient } from './DummyRestClient';

import { DummyClientFixture } from './DummyClientFixture';

let restConfig = ComponentConfig.fromTuples(
    'endpoint.protocol', 'http',
    'endpoint.host', 'localhost',
    'endpoint.port', 3000
);

suite('DummyRestClient', ()=> {    
    let seneca;
    let db = new DummyMemoryPersistence();
    db.configure(new ComponentConfig());

    let ctrl = new DummyController();
    ctrl.configure(new ComponentConfig());

    let service = new DummyRestService();
    service.configure(restConfig);

    let client = new DummyRestClient();
    client.configure(restConfig);

    let components = ComponentSet.fromComponents(db, ctrl, client, service);
    let fixture = new DummyClientFixture(client);

    suiteSetup((done) => {
        LifeCycleManager.linkAndOpen(new DynamicMap(), components, done);
    });
    
    suiteTeardown((done) => {
        LifeCycleManager.close(components, done);
    });
    
    setup((done) => {
        db.clearTestData(done);
    });
    
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });
});