let _ = require('lodash');

import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { AbstractComponent } from '../AbstractComponent';
import { ComponentConfig } from '../config/ComponentConfig';
import { State } from '../State';
import { ILogger } from '../ILogger';
import { LogLevel } from '../LogLevel';
import { DynamicMap } from '../portability/DynamicMap';

export abstract class AbstractLogger extends AbstractComponent implements ILogger {
	private DefaultConfig: DynamicMap = DynamicMap.fromTuples(
		"options.level", LogLevel.Info
	); 

    protected _level: number;

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
	public configure(config: ComponentConfig) {
		this.checkNewStateAllowed(State.Configured);
		
		super.configure(config.withDefaults(this.DefaultConfig));

        this._level = this.parseLevel(this._config.getOptions().get("level"));
	}

	/**
	 * Parses log level from configuration file
	 * @param level log level value
	 * @return parsed log level
	 */	
    protected parseLevel(level: any): number {
        if (level == null) return LogLevel.Info;

        level = level.toString().toUpperCase();
        if (level == "0" || level == "NOTHING" || level == "NONE")
            return LogLevel.None;
        else if (level == "1" || level == "FATAL")
            return LogLevel.Fatal;
        else if (level == "2" || level == "ERROR")
            return LogLevel.Error;
        else if (level == "3" || level == "WARN" || level == "WARNING")
            return LogLevel.Warn;
        else if (level == "4" || level == "INFO")
            return LogLevel.Info;
        else if (level == "5" || level == "DEBUG")
            return LogLevel.Debug;
        else if (level == "6" || level == "TRACE")
            return LogLevel.Trace;
        else
            return LogLevel.Info;
	}
            
	/**
	 * Get the current level of details
	 * @see LogLevel
	 * @return returns the current log level
	 */
    public getLevel(): number { 
        return this._level; 
    }        

    /**
     * Writes a message to the log
     * @param level a log level - Fatal, Error, Warn, Info, Debug or Trace
     * @param component a component name
     * @param correlationId a correlationId
     * @param message a message objects
     */
    public abstract log(level: number, component: string, correlationId: string, message: any[]): void;
}
