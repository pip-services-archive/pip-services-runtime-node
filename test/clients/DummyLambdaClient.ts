let _ = require('lodash');

import { Category } from '../../src/config/Category';
import { ComponentDescriptor } from '../../src/config/ComponentDescriptor';
import { FilterParams } from '../../src/data/FilterParams';
import { PagingParams } from '../../src/data/PagingParams';

import { IDummyClient } from './IDummyClient';
import { LambdaClient } from '../../src/clients/LambdaClient';

export class DummyLambdaClient extends LambdaClient implements IDummyClient {       
	/**
	 * Unique descriptor for the DummyLambdaClient component
	 */
	public static Descriptor: ComponentDescriptor = new ComponentDescriptor(
		Category.Clients, "pip-services-dummies", "lambda", "1.0"
	);
    
    constructor() {
        super(DummyLambdaClient.Descriptor);
    }
        
    public getDummies(correlationId: string, filter: FilterParams, paging: PagingParams, callback) {
        callback = this.instrument(correlationId, 'dummy.get_dummies', callback);
        
        this.call(
            'get_dummies',
            correlationId,
            {
                filter: filter ? filter.toObject() : null,
                paging: paging ? paging.toObject() : null
            }, 
            callback
        );
    }

    public getDummyById(correlationId: string, dummyId: string, callback: any) {
        callback = this.instrument(correlationId, 'dummy.get_dummy_by_id', callback);
        
        this.call(
            'get_dummy_by_id', 
            correlationId,
            {
                dummy_id: dummyId
            }, 
            callback
        );        
    }

    public createDummy(correlationId: string, dummy: any, callback: any) {
        callback = this.instrument(correlationId, 'dummy.create_dummy', callback);
        
        this.call(
            'create_dummy', 
            correlationId,
            {
                dummy: dummy
            }, 
            callback
        );
    }

    public updateDummy(correlationId: string, dummyId: string, dummy: any, callback: any) {
        callback = this.instrument(correlationId, 'dummy.update_dummy', callback);
        
        this.call(
            'update_dummy', 
            correlationId,
            {
                dummy_id: dummyId,
                dummy: dummy
            }, 
            callback
        );
    }

    public deleteDummy(correlationId: string, dummyId: string, callback) {
        callback = this.instrument(correlationId, 'dummy.delete_dummy', callback);
        
        this.call(
            'delete_dummy',
            correlationId,
            {
                dummy_id: dummyId
            }, 
            callback
        );
    }
    
}
