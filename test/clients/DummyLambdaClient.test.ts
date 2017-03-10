let _ = require('lodash');

import { ComponentSet } from '../../src/ComponentSet';
import { ComponentConfig } from '../../src/config/ComponentConfig';
import { DynamicMap } from '../../src/portability/DynamicMap';
import { Category } from '../../src/config/Category';
import { ConfigReader } from '../../src/config/ConfigReader';

import { DummyLambdaClient } from './DummyLambdaClient';
import { DummyClientFixture } from './DummyClientFixture';

let config = ConfigReader.read('./config/config.yaml');
let clientConfigs = config.getSection(Category.Clients) || [];
let lambdaConfig = _.find(clientConfigs, (c) => { 
    return c.getDescriptor().getType() == 'lambda'; 
});

suite('DummyLambdaClient', ()=> {        
    // Skip test if lambda is not configured
    if (lambdaConfig == null) return; 

    let config = ComponentConfig.fromValue(lambdaConfig);
    let client = new DummyLambdaClient();
    client.configure(config);

    let fixture = new DummyClientFixture(client);

    suiteSetup((done) => {
        client.link(new DynamicMap(), new ComponentSet());
        client.open(done);
    });
    
    suiteTeardown((done) => {
        client.close(done);
    });
        
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });
});