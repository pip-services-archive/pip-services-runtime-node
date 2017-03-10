let _ = require('lodash');
let fs = require('fs');

import { DynamicMap } from '../portability/DynamicMap';
import { Category } from '../config/Category';
import { MicroserviceConfig } from '../config/MicroserviceConfig';
import { ConfigReader } from '../config/ConfigReader';
import { ComponentSet } from '../ComponentSet';
import { IComponent } from '../IComponent';
import { FileError } from '../errors/FileError';
import { UnknownError } from '../errors/UnknownError';
import { IComponentFactory } from '../IComponentFactory';
import { LifeCycleManager } from './LifeCycleManager';
import { LogLevel } from '../LogLevel';
import { LogWriter } from './LogWriter';
import { LogFormatter } from '../logs/LogFormatter';
import { Builder } from '../build/Builder';

export class Microservice {
    private _name: string;
    private _exitOnError: boolean = false;
    private _factory: IComponentFactory;
    private _config: MicroserviceConfig;
    private _components: ComponentSet;
    private _context: DynamicMap;
    
    constructor(name: string, factory: IComponentFactory) {
        this._name = name;
        this._factory = factory;
        this._components = new ComponentSet();
        this._context = new DynamicMap();
    }

    public getName(): string {
        return this._name;
    }

    public enableExitOnError(): void {
        this._exitOnError = true;
    }

    public getConfig(): MicroserviceConfig {
        return this._config;
    } 

    public setConfig(config: MicroserviceConfig): void {
        this._config = config;
    }

    public loadConfig(configPath: string): void {
        // Load config file
        this._config = ConfigReader.read(configPath);
    }

    public getComponents(): ComponentSet {
        return this._components;
    }

    public getContext(): DynamicMap {
        return this._context;
    }

    public fatal(...message: any[]): void {
    	LogWriter.fatal(
			this._components.getAllByCategory(Category.Logs), 
			LogFormatter.format(LogLevel.Fatal, message)
		);
    }

    public error(...message: any[]): void {
    	LogWriter.error(
			this._components.getAllByCategory(Category.Logs), 
			LogFormatter.format(LogLevel.Error, message)
		);
    }

    public info(...message: any[]): void {
    	LogWriter.info(
			this._components.getAllByCategory(Category.Logs), 
			LogFormatter.format(LogLevel.Info, message)
		);
    }

    public trace(...message: any[]): void {
    	LogWriter.trace(
			this._components.getAllByCategory(Category.Logs), 
			LogFormatter.format(LogLevel.Trace, message)
		);
    }
                
    public build(callback: (err: any) => void): void {
        let error = null;
        try {
            this._components = Builder.build(this._factory, this._config);
        } catch (err) {
            error = err;
        }
        callback(error);
    }
    
    public link(callback: (err: any) => void): void {
        this.trace('Initializing ' + this._name + ' microservice');
        LifeCycleManager.link(this._context, this._components, callback); 
    }
    
    public open(callback: (err: any) => void): void {
        this.trace('Opening ' + this._name + ' microservice');
        LifeCycleManager.open(this._components, (err) => {
            if (err) callback(err);
            else {
                this.info('Microservice ' + this._name + ' started');
                callback(null);
            }
        }); 
    }

    public start(callback?: (err: any) => void): void {        
        // Build and open the microservice
        this.build((err) => {
            if (err) this.exit(err, callback);
            else this.link((err) => {
                if (err) this.exit(err, callback);
                else this.open((err) => {
                    if (err) this.exit(err, callback);
                    else if (callback) callback(null);
                });
            });
        });
    }
    
    public startWithConfig(config: MicroserviceConfig, callback?: (err: any) => void): void {
        this.setConfig(config);
        this.start(callback);
    }
    
    public startWithConfigFile(configPath: string, callback?: (err: any) => void): void {
        try {
            this.loadConfig(configPath);
            this.start(callback);
        } catch (err) {
            if (callback) callback(err);
            else throw err;
        }
    }

    public close(callback: (err: any) => void): void {
        this.trace('Closing ' + this._name + ' microservice');

        LifeCycleManager.forceClose(this._components, (err) => {
            if (err) this.error(err);
             
            if (err) this.info('Microservice ' + this._name + ' stopped with error ' + err);
            else this.info('Microservice ' + this._name + ' stopped');

            if (callback) callback(err);
        }); 
    }

    public exit(err: any, callback?: (err: any) => void): void {
        if (err) this.fatal(err);

        this.close(() => {            
            if (this._exitOnError) process.exit(1);
            else if (callback) callback(err);
            else if (err) throw err;
        });
    }    
}
