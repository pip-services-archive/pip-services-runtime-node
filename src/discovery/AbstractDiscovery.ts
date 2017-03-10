import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { IDiscovery } from '../IDiscovery';
import { AbstractComponent } from '../AbstractComponent';
import { Endpoint } from '../config/Endpoint';

/**
 * Abstract implementation for all discovery components.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-12
 */
export abstract class AbstractDiscovery extends AbstractComponent implements IDiscovery {    
	/**
	 * Creates and initializes instance of discovery component
	 * @param descriptor the unique component descriptor
	 */
    constructor(descriptor: ComponentDescriptor) {
        super(descriptor);
    }
    
	/**
	 * Register in discovery service endpoint where API service binds to.
	 * The endpoint shall contain discovery name to locate the registration.
	 * If it's not defined, the registration doesn't do anything.
	 * @param endpoint the endpoint to be registered.
     * @param callback a callback to be called with registration error or success
	 */
	public abstract register(endpoint: Endpoint, callback: (err: any) => void);
	
	/**
	 * Resolves one endpoint from the list of service endpoints
	 * to be called by a client.
	 * @param endpoints a list of endpoints to be resolved from. 
	 * The list must contain at least one endpoint with discovery name. 
     * @param callback a callback to be called with resolution error
     * or resolved endpoint
	 */
	public abstract resolve(endpoints: Endpoint[], callback: (err: any, endpoint: Endpoint) => void);

	/**
	 * Resolves a list of endpoints from to be called by a client.
	 * @param endpoints a list of endpoints to be resolved from. 
	 * The list must contain at least one endpoint with discovery name. 
     * @param callback a callback to be called when resolution error 
     * or a list of resolved endpoints
	 */
	public abstract resolveAll(endpoints: Endpoint[], callback: (err: any, endpoints: Endpoint[]) => void);
}
