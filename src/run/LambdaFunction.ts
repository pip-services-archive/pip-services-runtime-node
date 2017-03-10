let _ = require('lodash');

import { DynamicMap } from '../portability/DynamicMap';
import { Category } from '../config/Category';
import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { ComponentSet } from '../ComponentSet';
import { ICommand } from '../commands/ICommand';
import { CommandSet } from '../commands/CommandSet';
import { MicroserviceConfig } from '../config/MicroserviceConfig';
import { Builder } from '../build/Builder';
import { IBusinessLogic } from '../IBusinessLogic';
import { BadRequestError } from '../errors/BadRequestError';
import { Microservice } from './Microservice';
import { UnknownError } from '../errors/UnknownError';

type LambdaAction = (params: any, callback: (err: any, result: any) => void) => void;

export abstract class LambdaFunction {
    protected _microservice: Microservice;
    private _actionMap: any = {};
    
    constructor(microservice: Microservice) {
        this._microservice = microservice;
    }

    public setConfig(config: MicroserviceConfig): void {
        this._microservice.setConfig(config);
    }

    public loadConfig(configPath: string): void {
        this._microservice.loadConfig(configPath);
    }

    public loadConfigWithDefault(defaultConfigPath: string): void {
        let configPath = process.argv[2] || defaultConfigPath || '../config/config.yaml';
        this._microservice.loadConfig(configPath);
    }

    public link(context: DynamicMap, components: ComponentSet): void {
        this.register();
    }
    
    /**
     * Registers individual lambda action
     * @param cmd a unique command identifier
     * @param pattern definition of action parameters
     * @param action an action callback
     */
    protected registerAction(cmd: string, action: LambdaAction): void {
        // Hack to prevent wrong this
        let self = this;
        let actionCurl = (params, callback) => {             
            action.call(self, params, callback); 
        }
        this._actionMap[cmd] = actionCurl;
    }

    /**
     * Registers commands as lambda actions
     * @param commands a list of command to register
     */
    protected registerCommands(commands: ICommand[]): void {
        for (let i = 0; i < commands.length; i++) {
            let command = commands[i];

            // Use closure to prevent argument erasure
            let actionCurl = (command) => {  
                return (params: any, callback: (err: any, result: any) => void) => {
                    // Get correlation id from the parameters
                    let correlationId = params.correlation_id;
                    // Cut system parameters and convert them to DynamicMap
                    let args = DynamicMap.fromValue(
                        _.omit(params, 'cmd', 'correlation_id')
                    );
                    // Call the command
                    command.execute(correlationId, args, callback);
                }
            };
            let action = actionCurl(command);

            this.registerAction(command.getName(), action);
        }
    }

    /**
     * Registers a command set as lambda actions
     * @param commands a command set to be registered
     */
    protected registerCommandSet(commands: CommandSet): void {
        this.registerCommands(commands.getCommands());
    }
    
    protected register(): void {}
        
    private execute(event: any, context: any) {
        let cmd: string = event.cmd;
        
        if (cmd == null) {
            let err = new BadRequestError(
                this, 
                'NoCommand', 
                'Cmd parameter is missing'
            ).forComponent(this._microservice.getName());

            context.done(err, null);
            return;
        }
        
        let action: any = this._actionMap[cmd];
        if (action == null) {
            let err = new BadRequestError(
                this, 
                'NoAction', 
                'Action ' + cmd + ' was not found'
            )
            .forComponent(this._microservice.getName())
            .withDetails(cmd);

            context.done(err, null);
            return;
        }
        
        action(event, context.done);
    }
    
    private handler(event: any, context: any) {
        // If already started then execute
        if (this._actionMap != null) {
            this.execute(event, context);
        }
        // Start before execute
        else {
            this.start((err) => {
                if (err) context.done(err, null);
                else this.execute(event, context);
            });
        }
    }
    
    public getHandler(): (event: any, context: any) => void {
        let self = this;
        
        // Return plugin function
        return function (event, context) {
            // Calling run with changed context
            return self.handler.call(self, event, context);
        }
    }

    public start(callback?: (err: any) => void): void {
        this._microservice.start((err) => {
            if (err == null) this.link(this._microservice.getContext(), this._microservice.getComponents());
            if (callback) callback(err);
        });
    }

    public startWithConfig(config: MicroserviceConfig, callback?: (err: any) => void): void {
        this._microservice.startWithConfig(config, (err) => {
            if (err == null) this.link(this._microservice.getContext(), this._microservice.getComponents());
            if (callback) callback(err);
        });
    }

    public startWithConfigFile(configPath: string, callback?: (err: any) => void): void {
        this._microservice.startWithConfigFile(configPath, (err) => {
            if (err == null) this.link(this._microservice.getContext(), this._microservice.getComponents());
            if (callback) callback(err);
        });
    }

    public startWithDefaultConfig(defaultConfigPath: string, callback?: (err: any) => void): void {
        let configPath = process.argv[2] || defaultConfigPath || '../config/config.yaml';
        this.startWithConfigFile(configPath, callback);
    }

    public stop(callback?: (err: any) => void): void {
        this._microservice.close(callback);
    }
}
