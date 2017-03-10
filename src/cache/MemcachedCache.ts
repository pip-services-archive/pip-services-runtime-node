let _ = require('lodash');

import { Category } from '../config/Category';
import { DynamicMap } from '../portability/DynamicMap';
import { ComponentConfig } from '../config/ComponentConfig';
import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { State } from '../State';
import { ConfigError } from '../errors/ConfigError';
import { CallError } from '../errors/CallError';
import { AbstractCache } from './AbstractCache';

/**
 * Distributed cache that works through Memcached servers
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-19
 */
export class MemcachedCache extends AbstractCache {
	/**
	 * Unique descriptor for the Memcached Cache component
	 */
	public static Descriptor: ComponentDescriptor = new ComponentDescriptor(
		Category.Cache, "pip-services-runtime-cache", "memcached", "*"
	);

	/**
	 * Default configuration for memcached
	 */
	private static DefaultConfig = DynamicMap.fromTuples(
		"options.timeout", 60000, // timeout in milliseconds
		"options.retries", 2,
        "options.failover", false,
        "options.failover_time", 60
	); 

    private _client: any;
    private _timeout: number;

	/**
	 * Creates instance of memcached cache component.
	 */    
    constructor() {
        super(MemcachedCache.Descriptor);
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
	public configure(config: ComponentConfig) {
		this.checkNewStateAllowed(State.Configured);
		
		super.configure(config.withDefaults(MemcachedCache.DefaultConfig));

        // Convert timeout to seconds
		this._timeout = config.getOptions().getLong("timeout") / 1000;

        // Check for endpoints
        let endpoints = this._config.getEndpoints();
        if (endpoints.length == 0) 
            throw new ConfigError(this, 'NoEndpoints', 'Endpoints are not configured');
	}

	/**
	 * Opens the component, performs initialization, opens connections
	 * to external services and makes the component ready for operations.
	 * Opening can be done multiple times: right after linking 
	 * or reopening after closure.
	 * @param callback a callback to report success or error in opening  
	 */
    public open(callback: (err: any) => void): void {
		this.checkNewStateAllowed(State.Opened);

        let endpoints = this._config.getEndpoints();
        let uris = _.map(endpoints, (e) => { 
			return e.getHost() + ':' + (e.getPort() || 11211)  
		}).join(',');
        let options = this._config.getOptions();
        
        let memjs = require('memjs');
        this._client = memjs.Client.create(uris, options);

        super.open(callback);
    }
    
	/**
	 * Closes the component and all open connections, performs deinitialization
	 * steps. Closure can only be done from opened state. Attempts to close
	 * already closed component or in wrong order will cause exception.
	 * @param callback a callback to report success or error in closing  
	 */
    public close(callback: (err: any) => void): void {
		this.checkNewStateAllowed(State.Closed);

        this._client = null;
        
        super.close(callback);
    } 
        
	/**
	 * Retrieves a value from the cache by unique key.
	 * It is recommended to use either string GUIDs like '123456789abc'
	 * or unique natural keys prefixed with the functional group
	 * like 'pip-services-storage:block-123'. 
	 * @param key a unique key to locate value in the cache
	 * @param callback a callback function to be called 
	 * with error or retrieved value. It returns <b>null</b> 
	 * when value was not found
	 */
    public retrieve(key: string, callback: (err: any, value: any) => void): void {
        this._client.get(key, (err, value) => {
            // Convert value from JSON
            value = value != null ? JSON.parse(value) : null;

            if (err) callback(new CallError(this, 'RetrieveFailed', 'Failed to retrieve value from memcached', err), null);
            else callback(null, value);
        });
    }
    
	/**
	 * Stores value identified by unique key in the cache. 
	 * Stale timeout is configured in the component options. 
	 * @param key a unique key to locate value in the cache.
	 * @param value a value to store.
	 * @param callback a callback function to be called with error
	 * or stored value
	 */
    public store(key: string, value: any, callback: (err: any, value: any) => void): void {
        if (value != null) {        
            // Convert value to JSON
            let newValue = value != null ? JSON.stringify(value) : null;
            
            this._client.set(key, newValue, (err, newValue) => {
                if (err) callback(new CallError(this, 'StoreFailed', 'Failed to store value to memcached', err), null);
                else callback(null, value);
            }, this._timeout);
        } else {
            this._client.delete(key, (err, newValue) => {
                if (err) callback(new CallError(this, 'DeleteFailed', 'Failed to delete value from memcached', err), null);
                else callback(null, value);
            }, this._timeout);
        }
    }
    
	/**
	 * Removes value stored in the cache.
	 * @param key a unique key to locate value in the cache.
	 * @param callback a callback function to be called
	 * with error or success
	 */
    public remove(key: string, callback: (err: any) => void): void {
        this._client.delete(key, (err, value) => {            
            if (err) callback(new CallError(this, 'DeleteFailed', 'Failed to delete value from memcached', err));
            else callback(null);
        });
    }
}
