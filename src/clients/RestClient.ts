let _ = require('lodash');
let querystring = require('querystring');

import { State } from '../State';
import { ComponentSet } from '../ComponentSet';
import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { ComponentConfig } from '../config/ComponentConfig';
import { DynamicMap } from '../portability/DynamicMap';
import { IdGenerator } from '../data/IdGenerator';
import { UnknownError } from '../errors/UnknownError';
import { ConfigError } from '../errors/ConfigError';
import { FilterParams } from '../data/FilterParams';
import { PagingParams } from '../data/PagingParams';
import { AbstractClient } from './AbstractClient';

export abstract class RestClient extends AbstractClient {
    private static DefaultConfig = DynamicMap.fromTuples(
        'endpoint.protocol', 'http'
        //'endpoint.host', 'localhost',
        //'endpoint.port', 3000,
    );

    protected _client;
    
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
        this.checkNewStateAllowed(State.Configured);

        config = config.withDefaults(RestClient.DefaultConfig);
        let endpoint = config.getEndpoint();

        // Check for type
        let protocol = endpoint.getProtocol();
        if (protocol != 'http')
            throw new ConfigError(this, 'UnsupportedProtocol', 'Protocol type is not supported by REST transport').withDetails(protocol);

        // Check for host
        if (endpoint.getHost() == null)
            throw new ConfigError(this, 'NoHost', 'No host is configured in REST transport');

        // Check for port
        if (endpoint.getPort() == 0)
            throw new ConfigError(this, 'NoPort', 'No port is configured in REST transport');

        super.configure(config);
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

        let options: any = this._config.getOptions() || {};
        let endpoint = this._config.getEndpoint();
        
        let type = endpoint.getProtocol();
        let host = endpoint.getHost();
        let port = endpoint.getPort();
        options.url = type + '://' + host + ':' + port; 

        let restify = require('restify');
        this._client = restify.createJsonClient(options);
        
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

    protected addCorrelationId(params: any, correlationId: string): any {
        // Automatically generate short ids for now
        if (correlationId == null)
            correlationId = IdGenerator.short();

        params = params || {};
        params.correlation_id = correlationId;
        return params;
    }

    protected addFilterParams(params: any, filter: any): void {
        params = params || {};

        if (filter) {       
            for (let prop in filter) {
                if (filter.hasOwnProperty(prop))
                    params[prop] = filter[prop];
            }
        }

        return params;
    }

    protected addPagingParams(params: any, paging: any): void {
        params = params || {};

        if (paging) {
            if (paging.total)
                params.total = paging.total;
            if (paging.skip)
                params.skip = paging.skip;
            if (paging.take)
                params.take = paging.take;
        }

        return params;
    }

    protected call(method: string, route: string, correlationId?: string, params: any={}, data?: any, callback?: (err: any, result: any) => void): void {
        this.checkCurrentState(State.Opened);

        method = method.toLowerCase();
                
        if (_.isFunction(data)) {
            callback = data;
            data = {};
        }

        params = this.addCorrelationId(params, correlationId)

        if (!_.isEmpty(params))
            route += '?' + querystring.stringify(params);
                    
        let self = this;
        let action = null;    
        if (callback) {
            action = (err, req, res, data) => {
                // Handling 204 codes
                if (res.statusCode == 204)
                    callback.call(self, null, null);
                else
                    callback.call(self, err, data);  
            };
        }
        
        if (method == 'get') this._client.get(route, action);
        else if (method == 'head') this._client.head(route, action);
        else if (method == 'post') this._client.post(route, data, action);
        else if (method == 'put') this._client.put(route, data, action);
        else if (method == 'delete') this._client.del(route, action);
        else {
            let error = new UnknownError(this, 'UnsupportedMethod', 'Method is not supported by REST client').withDetails(method);

            if (callback) callback(error, null)
            else throw error;
        }
    }    
    
}
