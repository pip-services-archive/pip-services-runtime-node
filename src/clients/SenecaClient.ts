let _ = require('lodash');

import { DynamicMap } from '../portability/DynamicMap';
import { ComponentSet } from '../ComponentSet';
import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { AbstractClient } from './AbstractClient';
import { UnknownError } from '../errors/UnknownError';
import { SenecaAddon } from '../addons/SenecaAddon';
import { IdGenerator } from '../data/IdGenerator';

export abstract class SenecaClient extends AbstractClient {
    protected _seneca: any;
    
    constructor(descriptor: ComponentDescriptor) {
        super(descriptor);
    }
    
	/**
	 * Sets references to other microservice components to enable their 
	 * collaboration. It is recommended to locate necessary components
	 * and cache their references to void performance hit during
	 * normal operations. 
	 * Linking can only be performed once after configuration 
	 * and will cause an exception when it is called second time 
	 * or out of order. 
     * @param context application context
	 * @param components references to microservice components.
	 * @throws MicroserviceError when requires components are not found.
	 */
    public link(context: DynamicMap, components: ComponentSet): void {        
        // Get global seneca wrapper        
        let senecaAddon = <SenecaAddon>components.getOneRequired(SenecaAddon.Descriptor);
        // Set seneca reference    
        this._seneca = senecaAddon.getSeneca();

        super.link(context, components);
    }

	/**
	 * Opens the component, performs initialization, opens connections
	 * to external services and makes the component ready for operations.
	 * Opening can be done multiple times: right after linking 
	 * or reopening after closure.
	 * @param callback a callback to report success or error in opening  
	 */
    public open(callback: (err: any) => void): void {
        this._seneca.ready((err) => {
            if (err) {
                callback(err);
                return;
            }
            
            // Connect to seneca without waiting
            // Todo: How to wait until connection is successful?
            let endpoint: any = this._config.getEndpoint();
            if (endpoint && endpoint.getProtocol()) {
                this.info(null, 'Connecting seneca service to ' + endpoint.getUri());
                    
                let transport = {
                    type: endpoint.getProtocol(),
                    host: endpoint.getHost(),
                    port: endpoint.getPort()
                };

                // ?? Why do we need that?
                // transport.pin = {
                //     role: this._role
                // };

                this._seneca.client(transport);
            }
            
            super.open(callback);
        })
    }
    
	/**
	 * Closes the component and all open connections, performs deinitialization
	 * steps. Closure can only be done from opened state. Attempts to close
	 * already closed component or in wrong order will cause exception.
	 * @param callback a callback to report success or error in closing  
	 */
    public close(callback: (err: any) => void): void {
        super.close(callback);
        
        // Close seneca listening
        // this._seneca.close((err) => {
        //     if (err) callback(err);
        //     else super.close(callback);
        // });
    } 

    protected call(role: string, cmd: string, correlationId?: string, params: any = {}, callback?: (err: any, result: any) => void): void {
        if (role == null) 
            throw new UnknownError(this, 'NoRole', 'Missing pattern role');

        if (cmd == null) 
            throw new UnknownError(this, 'NoCommand', 'Missing pattern cmd');

        params = _.clone(params);                    
        params.role = role;                                   
        params.cmd = cmd;
                        
        correlationId = correlationId || IdGenerator.short();
        params.correlation_id = correlationId;

        this._seneca.act(params, callback);
    }    
    
}
