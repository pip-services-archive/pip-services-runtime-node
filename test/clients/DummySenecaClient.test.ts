let _ = require('lodash');

import { DummyMemoryPersistence } from '../persistence/DummyMemoryPersistence';
import { DummyController } from '../logic/DummyController';
import { DummySenecaService } from '../services/DummySenecaService';
import { DummySenecaClient } from './DummySenecaClient';
import { ComponentSet } from '../../src/ComponentSet';
import { DynamicMap } from '../../src/portability/DynamicMap';
import { ComponentConfig } from '../../src/config/ComponentConfig';
import { LifeCycleManager } from '../../src/run/LifeCycleManager';
import { SenecaAddon } from '../../src/addons/SenecaAddon';

import { DummyClientFixture } from './DummyClientFixture';

suite('DummySenecaClient', ()=> {        
    let db = new DummyMemoryPersistence();
    db.configure(new ComponentConfig());

    let ctrl = new DummyController();
    ctrl.configure(new ComponentConfig());

    let service = new DummySenecaService();
    service.configure(new ComponentConfig());

    let client = new DummySenecaClient();
    client.configure(new ComponentConfig());

    let seneca = new SenecaAddon();
    seneca.configure(new ComponentConfig());

    let components = ComponentSet.fromComponents(db, ctrl, client, service, seneca);
    let fixture = new DummyClientFixture(client);

    suiteSetup((done) => {
        LifeCycleManager.linkAndOpen(new DynamicMap(), components, done);
    });
    
    suiteTeardown((done) => {
        seneca.getSeneca().close(() => {
            LifeCycleManager.close(components, done);
        });
    });
    
    setup((done) => {
        db.clearTestData(done);
    });
    
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });
});