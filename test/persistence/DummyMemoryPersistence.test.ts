import { DynamicMap } from '../../src/portability/DynamicMap';
import { ComponentSet } from '../../src/ComponentSet';
import { ComponentConfig } from '../../src/config/ComponentConfig';
import { DummyMemoryPersistence } from './DummyMemoryPersistence';
import { DummyPersistenceFixture } from './DummyPersistenceFixture';

suite('DummyMemoryPersistence', ()=> {
    let db, fixture;
    
    suiteSetup((done) => {
        db = new DummyMemoryPersistence();
        db.configure(new ComponentConfig());

        fixture = new DummyPersistenceFixture(db);
        
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