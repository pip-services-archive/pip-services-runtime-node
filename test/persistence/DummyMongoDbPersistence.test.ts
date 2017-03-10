import { ComponentSet } from '../../src/ComponentSet';
import { Category } from '../../src/config/Category';
import { ConfigReader } from '../../src/config/ConfigReader';
import { ComponentConfig } from '../../src/config/ComponentConfig';
import { DynamicMap } from '../../src/portability/DynamicMap';
import { DummyMongoDbPersistence } from './DummyMongoDbPersistence';
import { DummyPersistenceFixture } from './DummyPersistenceFixture';

let config = ConfigReader.read('./config/config.yaml');
let dbConfigs = config.getSection(Category.Persistence) || [];
let dbConfig = dbConfigs.length == 1 ? dbConfigs[0] : null;

suite('DummyMongoDbPersistence', ()=> {
    // Skip test if mongodb is not configured
    if (dbConfig == null || dbConfig.getDescriptor().getType() != 'mongodb')
        return; 
    
    let db = new DummyMongoDbPersistence();
    db.configure(dbConfig);

    let fixture = new DummyPersistenceFixture(db);

    suiteSetup((done) => {
        db.link(new DynamicMap(), new ComponentSet());
        db.open(done);
    });
    
    suiteTeardown((done) => {
        db.close(done);
    });
    
    setup((done) => {
        db.clearTestData(done);
    });
    
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });
});