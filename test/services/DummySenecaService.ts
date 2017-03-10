let _ = require('lodash');

import { DynamicMap } from '../../src/portability/DynamicMap';
import { Category } from '../../src/config/Category';
import { ComponentDescriptor } from '../../src/config/ComponentDescriptor';
import { ComponentSet } from '../../src/ComponentSet';
import { SenecaService } from '../../src/services/SenecaService';
import { FilterParams } from '../../src/data/FilterParams';
import { PagingParams } from '../../src/data/PagingParams';
import { DummyController } from '../logic/DummyController';
import { IDummyBusinessLogic } from '../logic/IDummyBusinessLogic';

export class DummySenecaService extends SenecaService {       
	/**
	 * Unique descriptor for the DummySenecaService component
	 */
	public static Descriptor: ComponentDescriptor = new ComponentDescriptor(
		Category.Services, "pip-services-dummies", "seneca", "1.0"
	);

    private _logic: IDummyBusinessLogic;

    constructor() {
        super(DummySenecaService.Descriptor);
    }
    
	public link(context: DynamicMap, components: ComponentSet): void {
		this._logic = <IDummyBusinessLogic>components.getOnePrior(
			this, new ComponentDescriptor(Category.BusinessLogic, "pip-services-dummies", "*", "*")
		);

		super.link(context, components);		

        this.registerCommands('dummy', this._logic.getCommands());
	}

}
