import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { AbstractComponent } from '../AbstractComponent';
import { IService } from '../IService';

/**
 * Abstract implementation for all API service components
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-05-01
 */
export abstract class AbstractService extends AbstractComponent implements IService {
	/**
	 * Creates and initializes instance of the APIs service
	 * @param descriptor the unique descriptor that is used to identify and locate the component.
	 */
    constructor(descriptor: ComponentDescriptor) {
        super(descriptor);
    }
}
