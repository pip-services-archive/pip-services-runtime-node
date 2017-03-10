import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { ComponentConfig } from '../config/ComponentConfig';
import { FilePersistence } from './FilePersistence';

export abstract class MemoryPersistence extends FilePersistence {

    constructor(descriptor: ComponentDescriptor) {
        super(descriptor);
    }

	/**
	 * Sets component configuration parameters and switches component
	 * to 'Configured' state. The configuration is only allowed once
	 * right after creation. Attempts to perform reconfiguration will 
	 * cause an exception.
	 * @param config the component configuration parameters.
	 * @throws MicroserviceError when component is in illegal state 
	 * or configuration validation fails. 
	 */
    public configure(config: ComponentConfig): void {
        super.configure(config.withDefaultTuples("options.path", ""));
    }

    public save(callback: (err: any) => void): void {
        // Skip saving data to disk
        if (callback) callback(null);
    }

}
