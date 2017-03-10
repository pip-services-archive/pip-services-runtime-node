import { IComponent } from './IComponent';
import { Endpoint } from './config/Endpoint';

/**
 * Service discovery component used to register addresses of the microservice
 * service endpoints or to resolve addresses of external services called by clients.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-09-16
 */
export interface IDiscovery extends IComponent {
	/**
	 * Register in discovery service endpoint where API service binds to.
	 * The endpoint shall contain discovery name to locate the registration.
	 * If it's not defined, the registration doesn't do anything.
	 * @param endpoint the endpoint to be registered.
     * @param callback a callback to be called with registration error or success
	 */
	register(endpoint: Endpoint, callback: (err: any) => void);
	
	/**
	 * Resolves one endpoint from the list of service endpoints
	 * to be called by a client.
	 * @param endpoints a list of endpoints to be resolved from. 
	 * The list must contain at least one endpoint with discovery name. 
     * @param callback a callback to be called with resolution error
     * or resolved endpoint
	 */
	resolve(endpoints: Endpoint[], callback: (err: any, endpoint: Endpoint) => void);

	/**
	 * Resolves a list of endpoints from to be called by a client.
	 * @param endpoints a list of endpoints to be resolved from. 
	 * The list must contain at least one endpoint with discovery name. 
     * @param callback a callback to be called when resolution error 
     * or a list of resolved endpoints
	 */
	resolveAll(endpoints: Endpoint[], callback: (err: any, endpoints: Endpoint[]) => void);
}
