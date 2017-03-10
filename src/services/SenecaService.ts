let _ = require('lodash');

import { Category } from '../config/Category';
import { AbstractService } from './AbstractService';
import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { ComponentSet } from '../ComponentSet';
import { ICommand } from '../commands/ICommand';
import { CommandSet } from '../commands/CommandSet';
import { DynamicMap } from '../portability/DynamicMap';
import { UnknownError } from '../errors/UnknownError';
import { SenecaAddon } from '../addons/SenecaAddon';

type ActionFunction = (params: any, callback: (err: any, result: any) => void) => void;

export abstract class SenecaService extends AbstractService {
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

        // Register (add) seneca actions
        this.register();

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
        let endpoint = this._config.getEndpoint();

        if (endpoint == null || endpoint.getProtocol() == null) {
            super.open(callback);
            return;
        }

        this._seneca.ready((err) => {
            if (err) {
                callback(err);
                return;
            }
            
            // Launch seneca without waiting            
            let transport = {
                type: endpoint.getProtocol(),
                host: endpoint.getHost(),
                port: endpoint.getPort()
            };

            if (transport && transport.type) {
                this.info(null, 'Seneca service started listening at ' + endpoint.getUri());
                this._seneca.listen(transport);
            }
            
            // This code blocks plugin!!
            //super.open(callback);
        })

        super.open(callback);
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

    /**
     * Registers individual seneca action
     * @param role an action role. Usually it shall correspond to the microservice name
     * @param cmd a unique command identifier
     * @param pattern definition of action parameters
     * @param action an action callback
     */
    protected registerAction(role: string, cmd: string, pattern: any, action: ActionFunction): void {
        if (role == '') 
            throw new UnknownError(this, 'NoRole', 'Missing seneca pattern role');

        if (cmd == '') 
            throw new UnknownError(this, 'NoCommand', 'Missing seneca pattern cmd');
            
        if (action == null)
            throw new UnknownError(this, 'NoAction', 'Missing seneca action');
            
        if (!_.isFunction(action))
            throw new UnknownError(this, 'ActionNotFunction', 'Seneca action is not a function');
            

        pattern = _.clone(pattern || {});
        pattern.role = role;
        pattern.cmd = cmd;

        // Adding default parameters required for every action
        pattern.correlation_id = { type$: 'string' };

        // Hack!!! Wrapping action to preserve prototyping context
        let actionCurl = (params, callback) => { action.call(this, params, callback); };
        
        this._seneca.add(pattern, actionCurl);
    }    

    /**
     * Registers commands as seneca actions
     * @param role an action role. Usually it shall correspond to the microservice name
     * @param commands a list of command to register
     */
    protected registerCommands(role: string, commands: ICommand[]): void {
        if (role == '') 
            throw new UnknownError(this, 'NoRole', 'Missing seneca pattern role');

        for (let i = 0; i < commands.length; i++) {
            let command = commands[i];
            // Use closure to prevent argument erasure
            let actionCurl = (command) => {  
                return (params: any, callback: (err: any, result: any) => void) => {
                    // Get correlation id from the parameters
                    let correlationId = params.correlation_id;
                    // Cut system parameters and convert them to DynamicMap
                    let args = DynamicMap.fromValue(
                        _.omit(params, 'role', 'cmd', 'correlation_id')
                    );
                    // Call the command
                    command.execute(correlationId, args, callback);
                }
            };
            let action = actionCurl(command);

            this.registerAction(role, command.getName(), {}, action);
        }
    }

    /**
     * Registers a command set as seneca actions
     * @param role an action role. Usually it shall correspond to the microservice name
     * @param commands a command set to be registered
     */
    protected registerCommandSet(role: string, commands: CommandSet): void {
        this.registerCommands(role, commands.getCommands());
    }

    /**
     * Registration of all actions that is called after successful linking.
     * This method shall be overridden in descendant classes to make all 
     * required registrations
     */    
    protected register(): void {}
}
