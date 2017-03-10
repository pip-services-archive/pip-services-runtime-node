import { IAddon } from '../IAddon';
import { AbstractComponent } from '../AbstractComponent';
import { ComponentDescriptor } from '../config/ComponentDescriptor';

/**
 * Abstract implementation for microservice addons.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-05-01
 */
export abstract class AbstractAddon extends AbstractComponent implements IAddon {    
    /**
	 * Creates and initializes instance of the microservice addon
	 * @param descriptor the unique descriptor that is used to identify and locate the component.
	 */
    constructor(descriptor: ComponentDescriptor) {
        super(descriptor);
    }
}
