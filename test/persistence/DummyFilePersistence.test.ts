import { DynamicMap } from '../../src/portability/DynamicMap';
import { ComponentSet } from '../../src/ComponentSet';
import { ComponentConfig } from '../../src/config/ComponentConfig';
import { DummyFilePersistence } from './DummyFilePersistence';
import { DummyPersistenceFixture } from './DummyPersistenceFixture';

let config = ComponentConfig.fromValue({
    options: {
        path: './data/dummies.json',
        data: []
    }
});

suite('DummyFilePersistence', ()=> {
    let db, fixture;
    
    suiteSetup((done) => {
        db = new DummyFilePersistence();
        db.configure(config);

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