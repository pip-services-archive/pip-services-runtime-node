import { ComponentFactory } from '../../src/build/ComponentFactory';
import { DefaultFactory } from '../../src/build/DefaultFactory';

import { DummyMongoDbPersistence } from '../persistence/DummyMongoDbPersistence';
import { DummyFilePersistence } from '../persistence/DummyFilePersistence';
import { DummyMemoryPersistence } from '../persistence/DummyMemoryPersistence';
import { DummyController } from '../logic/DummyController';
import { DummyRestClient } from '../clients/DummyRestClient';
import { DummySenecaClient } from '../clients/DummySenecaClient';
import { DummyLambdaClient } from '../clients/DummyLambdaClient';
import { DummyRestService } from '../services/DummyRestService';
import { DummySenecaService } from '../services/DummySenecaService'; 

export class DummyFactory extends ComponentFactory {
	public static Instance: DummyFactory = new DummyFactory();
	
	constructor() {
		super(DefaultFactory.Instance);

		this.register(DummyFilePersistence.Descriptor, DummyFilePersistence);
		this.register(DummyMemoryPersistence.Descriptor, DummyMemoryPersistence);
		this.register(DummyMongoDbPersistence.Descriptor, DummyMongoDbPersistence);
		this.register(DummyController.Descriptor, DummyController);
		this.register(DummyRestClient.Descriptor, DummyRestClient);
		this.register(DummySenecaClient.Descriptor, DummySenecaClient);
		this.register(DummyLambdaClient.Descriptor, DummyLambdaClient);
		this.register(DummyRestService.Descriptor, DummyRestService);
		this.register(DummySenecaService.Descriptor, DummySenecaService);
	}
	
}
