let _ = require('lodash');

import { Category } from '../../src/config/Category';
import { ComponentDescriptor } from '../../src/config/ComponentDescriptor';
import { MongoDbPersistence } from '../../src/persistence/MongoDbPersistence';
import { FilterParams } from '../../src/data/FilterParams';
import { PagingParams } from '../../src/data/PagingParams';
import { IDummyPersistence } from './IDummyPersistence';

export class DummyMongoDbPersistence extends MongoDbPersistence implements IDummyPersistence {
	/**
	 * Unique descriptor for the DummyMongoDbPersistence component
	 */
	public static Descriptor: ComponentDescriptor = new ComponentDescriptor(
		Category.Persistence, "pip-services-dummies", "mongodb", "*"
	);

    constructor() {
        super(DummyMongoDbPersistence.Descriptor, require('./DummyModel'));
    }
    
    public getDummies(correlationId: string, filter: FilterParams, paging: PagingParams, callback: any): void {
        let criteria = filter.pick('key');

        this.getPage(correlationId, criteria, paging, null, null, callback);
    }

    public getDummyById(correlationId: string, dummyId: string, callback: any): void {
        this.getById(correlationId, dummyId, callback);
    }

    public createDummy(correlationId: string, dummy: any, callback: any): void {
        this.create(correlationId, dummy, callback);
    }

    public updateDummy(correlationId: string, dummyId: string, dummy: any, callback: any): void {
        this.update(correlationId, dummyId, dummy, callback);
    }

    public deleteDummy(correlationId: string, dummyId: string, callback): void {
        this.delete(correlationId, dummyId, callback);
    }
}
