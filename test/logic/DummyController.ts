import { DynamicMap } from '../../src/portability/DynamicMap';
import { Category } from '../../src/config/Category';
import { ComponentDescriptor } from '../../src/config/ComponentDescriptor';
import { ComponentSet } from '../../src/ComponentSet';
import { AbstractController } from '../../src/logic/AbstractController';
import { FilterParams } from '../../src/data/FilterParams';
import { PagingParams } from '../../src/data/PagingParams';
import { IDummyPersistence } from '../persistence/IDummyPersistence';
import { IDummyBusinessLogic } from './IDummyBusinessLogic';
import { DummyCommandSet } from './DummyCommandSet';

export class DummyController extends AbstractController implements IDummyBusinessLogic {
	/**
	 * Unique descriptor for the DummyController component
	 */
	public static Descriptor: ComponentDescriptor = new ComponentDescriptor(
		Category.Controllers, "pip-services-dummies", "*", "*"
	);
    
	private _db: IDummyPersistence;
    
    constructor() {
        super(DummyController.Descriptor);
    }
    
    public link(context: DynamicMap, components: ComponentSet): void {
        // Locate reference to dummy persistence component
        this._db = <IDummyPersistence>components.getOneRequired(
        	new ComponentDescriptor(Category.Persistence, "pip-services-dummies", '*', '*')
    	);
        
        super.link(context, components);

        // Add commands
        let commands = new DummyCommandSet(this);
        this.addCommandSet(commands);
    }
        
    public getDummies(correlationId: string, filter: FilterParams, paging: PagingParams, callback: any) {
        callback = this.instrument(correlationId, 'dummy.get_dummies', callback);
        this._db.getDummies(correlationId, filter, paging, callback);        
	}

    public getDummyById(correlationId: string, dummyId: string, callback: any) {
        callback = this.instrument(correlationId, 'dummy.get_dummy_by_id', callback);
        this._db.getDummyById(correlationId, dummyId, callback);        
	}

    public createDummy(correlationId: string, dummy: any, callback: any) {
        callback = this.instrument(correlationId, 'dummy.create_dummy', callback);
        this._db.createDummy(correlationId, dummy, callback);        
	}

    public updateDummy(correlationId: string, dummyId: string, dummy: any, callback: any) {
        callback = this.instrument(correlationId, 'dummy.update_dummy', callback);
        this._db.updateDummy(correlationId, dummyId, dummy, callback);        
	}

    public deleteDummy(correlationId: string, dummyId: string, callback: any) {
        callback = this.instrument(correlationId, 'dummy.delete_dummy', callback);
        this._db.deleteDummy(correlationId, dummyId, callback);        
	}
    
}
