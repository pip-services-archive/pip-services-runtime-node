import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { MicroserviceConfig } from '../config/MicroserviceConfig';
import { AbstractComponent } from '../AbstractComponent';
import { IBootConfig } from '../IBootConfig';

/**
 * Abstract implementation for all bootstrap configuration reader components.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-05-01
 */
export abstract class AbstractBootConfig extends AbstractComponent implements IBootConfig {
	/**
	 * Creates instance of abstract configuration reader component.
	 * @param descriptor the unique descriptor that is used to identify and locate the component.
	 */
    constructor(descriptor: ComponentDescriptor) {
        super(descriptor);
    }
            
	/**
	 * Reads microservice configuration from the source
	 * @param callback a callback to be called with error
     * or retrieved microservice configuration
	 */
    public abstract readConfig(callback: (err: any, config: MicroserviceConfig) => void): void;
}
