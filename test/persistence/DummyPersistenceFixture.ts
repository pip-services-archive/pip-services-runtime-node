let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from '../../src/data/FilterParams';
import { PagingParams } from '../../src/data/PagingParams';
import { IDummyPersistence } from './IDummyPersistence';

let DUMMY1 = {
    key: 'Key 1',
    content: 'Content 1'
};
let DUMMY2 = {
    key: 'Key 2',
    content: 'Content 2'
};

export class DummyPersistenceFixture {
    private _db: IDummyPersistence;
    
    constructor(db) {
        assert.isNotNull(db);
        this._db = db;
    }
                
    testCrudOperations(done) {
        var dummy1, dummy2;

        async.series([
        // Create one dummy
            (callback) => {
                this._db.createDummy(
                    null,
                    DUMMY1,
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
                this._db.createDummy(
                    null,
                    DUMMY2,
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
                this._db.getDummies(
                    null,
                    new FilterParams(),
                    new PagingParams(),
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
                this._db.updateDummy(
                    null,
                    dummy1.id,
                    { content: 'Updated Content 1' },
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
                this._db.deleteDummy(
                    null,
                    dummy1.id,
                    (err) => {
                        assert.isNull(err);
                        
                        callback();
                    }
                );
            },
        // Try to get deleted dummy
            (callback) => {
                this._db.getDummyById(
                    null,
                    dummy1.id,
                    (err, dummy) => {
                        assert.isNull(err);
                        
                        assert.isNull(dummy || null);

                        callback();
                    }
                );
            }
        ], done);
    }
}
