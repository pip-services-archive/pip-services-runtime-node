import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { AbstractComponent } from '../AbstractComponent';
import { IPersistence } from '../IPersistence';
import { IdGenerator } from '../data/IdGenerator';

/**
 * Abstract implementation of microservice persistence components
 * that store and retrieve persistent data.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-05-01
 */
export abstract class AbstractPersistence extends AbstractComponent implements IPersistence {
	/**
	 * Creates instance of abstract persistence component.
	 * @param descriptor the unique descriptor that is used to identify and locate the component.
	 */
    constructor(descriptor: ComponentDescriptor) {
        super(descriptor);
    }
    
	/**
	 * Generates globally unique string GUID to identify stored object.
	 * Usage of string GUIDs for object ids is one of the key Pip.Services
	 * patterns that helps to ensure portability across all persistence storages
	 * and language implementations.
	 * @return a globally unique GUID
	 */
    protected createUuid(): string {
        return IdGenerator.uuid();
    }

	/**
	 * Clears persistence storage. This method shall only be used in testing
	 * and shall never be called in production.
	 * @throws MicroserviceError when clearing has some problems.
	 */
    public clearTestData(callback: (err: any) => void): void {
        if (callback) callback(null);
    }
}
