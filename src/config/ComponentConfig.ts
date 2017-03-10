import { DynamicMap } from '../portability/DynamicMap';
import { Category } from './Category';
import { ComponentDescriptor } from './ComponentDescriptor';
import { Connection } from './Connection';
import { Endpoint } from './Endpoint';

/**
 * Stores configuration for microservice component 
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
export class ComponentConfig {
	private _category: string;
	private _content: DynamicMap;
	
	/**
	 * Creates instance of component configuration with values retrieved from microservice configuration section.
	 * @param category a component category
	 * @param content configuration parameters
	 */
	constructor(category?: string, content?: DynamicMap) {
		this._category = category || Category.Undefined;
		this._content = content || new DynamicMap();
	}
		
	/**
	 * Gets the raw content of the configuration as dynamic map
	 * @return dynamic map with all component configuration parameters.
	 */
	public getRawContent(): DynamicMap {
		return this._content;
	}

	/**
	 * Sets default values to the configuration
	 * @param defaultContent default configuration
	 * @return a reference to this configuration for chaining or passing through.
	 */
	public withDefaults(defaultContent: DynamicMap): ComponentConfig {
		this._content = this._content.merge(defaultContent, true);
		return this;
	}	

	/**
	 * Sets default tuples to the configuration
	 * @param defaultsTuples default configuration represented by <key> + <value> tuples
	 * @return a reference to this configuration for chaining or passing through.
	 */
	public withDefaultTuples(...defaultTuples: any[]): ComponentConfig {
		let defaultContent: DynamicMap = new DynamicMap();
		defaultContent.setTuplesArray(defaultTuples);
		return this.withDefaults(defaultContent);
	}	

	/**
	 * Gets component descriptor. It is read from 'descriptor' object if it exists.
	 * @return the component descriptor
	 */
	public getDescriptor(): ComponentDescriptor {
		let values: DynamicMap = this._content.getMap("descriptor");
		
		return new ComponentDescriptor(
			this._category,
			values.getNullableString("group"),
			values.getNullableString("type"),
			values.getNullableString("version")
		);
	}
	
	/**
	 * Gets connection parameters from 'connection' object 
	 * This method is usually used by persistence components to get connections to databases.
	 * @return connection parameters
	 */
	public getConnection(): Connection {
		let values = this._content.getNullableMap("connection");
		return values != null ? new Connection(values) : null;
	}

	/**
	 * Gets a list of database connections from 'connections' or 'connection' objects
	 * This method is usually used by persistence components that may connect to one of few database servers.
	 * @return a list with database connections
	 */
	public getConnections(): Connection[] {
		// Get configuration parameters for connections
		let values: any[] = this._content.getNullableArray("connections");
		values = values || this._content.getNullableArray("connection");
		
		// Convert configuration parameters to connections
		let connections: Connection[] = [];

		// Convert list of values
		if (values != null) {
			for (let i = 0; i < values.length; i++) {
                let value = values[i];
				connections.push(new Connection(DynamicMap.fromValue(value)));
			}
		}

		// Return the result
		return connections;
	}

	/**
	 * Gets a service endpoint from 'endpoint' object 
	 * This method is usually used by services that need to bind to a single endpoint.
	 * @return a service endpoint or <b>null</b> if endpoint is not set
	 */
	public getEndpoint(): Endpoint {
		let values: DynamicMap = this._content.getNullableMap("endpoint");
		return values != null ? new Endpoint(values) : null;
	}

	/**
	 * Gets a list of service endpoint from 'endpoints' or 'endpoint' objects
	 * This method is usually used by clients that may connect to one of few services.
	 * @return a list with service endpoints
	 */
	public getEndpoints(): Endpoint[] {
		// Get configuration parameters for endpoints
		let values: any[] = this._content.getNullableArray("endpoints");
		values = values || this._content.getNullableArray("endpoint");
		
		// Convert configuration parameters to endpoints
		let endpoints: Endpoint[] = [];

		// Convert list of values
		if (values != null) {
			for (let i = 0; i < values.length; i++) {
                let value = values[i];
				endpoints.push(new Endpoint(DynamicMap.fromValue(value)));
			}
		}

		// Return the result
		return endpoints;
	}
	
	/**
	 * Gets component free-form configuration options.
	 * The options are read from 'options', 'settings' or 'params' objects.
	 * @return a map with free-form component options or <b>null</b> when options are not set. 
	 */
	public getOptions(): DynamicMap {
		return this._content.getNullableMap("options");
	}

	/**
	 * Creates component configuration using free-form objects.
	 * This method of configuration is usually used during testing.
	 * The configuration is created with 'Undefined' category since it's not used to create a component.
	 * @param value a free-form object
	 * @return constructed component configuration
	 */
	public static fromValue(value: any): ComponentConfig {
        let content: DynamicMap = DynamicMap.fromValue(value);
        return new ComponentConfig(Category.Undefined, content);
	}

	/**
	 * Creates component configuration using hardcoded parameters.
	 * This method of configuration is usually used during testing.
	 * The configuration is created with 'Undefined' category since it's not used to create a component.
	 * @param tuples configuration parameters as <key> + <value> tuples
	 * @return constructed component configuration
	 */
	public static fromTuples(...tuples: any[]): ComponentConfig {
        let content: DynamicMap = new DynamicMap();
        content.setTuplesArray(tuples);
        return new ComponentConfig(Category.Undefined, content);
	}

}
