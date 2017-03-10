import { IPersistence } from '../../src/IPersistence';
import { FilterParams } from '../../src/data/FilterParams';
import { PagingParams } from '../../src/data/PagingParams';

export interface IDummyPersistence extends IPersistence {
    getDummies(correlationId: string, filter: FilterParams, paging: PagingParams, callback: any);
    getDummyById(correlationId: string, dummyId: string, callback: any);
    createDummy(correlationId: string, dummy: any, callback: any);
    updateDummy(correlationId: string, dummyId: string, dummy: any, callback: any);
    deleteDummy(correlationId: string, dummyId: string, callback: any);
}
