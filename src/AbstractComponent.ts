import { DynamicMap } from './portability/DynamicMap';
import { Category } from './config/Category';
import { ComponentDescriptor } from './config/ComponentDescriptor';
import { ComponentConfig } from './config/ComponentConfig';
import { StateError } from './errors/StateError';
import { IComponent } from './IComponent';
import { ComponentSet } from './ComponentSet';
import { IDiscovery } from './IDiscovery';
import { ILogger } from './ILogger';
import { ICounters } from './ICounters';
import { ITiming } from './ITiming';
import { State } from './State';
import { LogLevel } from './LogLevel';

/**
 * Abstract implementation for all microservice components.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
export abstract class AbstractComponent implements IComponent {
	protected _descriptor: ComponentDescriptor;
	protected _state: number = State.Initial;
	protected _config: ComponentConfig;
    protected _discovery: IDiscovery;
    protected _loggers: ILogger[] = [];
    protected _counters: ICounters;

	/**
	 * Creates and initializes the component instance
	 * @param descriptor the unique descriptor that is used to identify and locate the component.
	 */
    constructor(descriptor: ComponentDescriptor) {
        this._descriptor = descriptor;
    }
    
	/**
	 * Gets the unique component descriptor that can identify
	 * and locate the component inside the microservice.
	 * @return the unique component descriptor.
	 */
	public getDescriptor(): ComponentDescriptor { 
        return this._descriptor; 
    }
    
    /* Life cycle management */
    
	/**
	 * Gets the current state of the component.
	 * @return the current component state.
	 */
	public getState(): number { 
        return this._state; 
    }
	
	/**
	 * Checks if specified state matches to the current one.
	 * @param state the expected state
	 * @throws MicroserviceError when current and expected states don't match
	 */
	protected checkCurrentState(state: number): void {
		if (this._state != state)
			throw new StateError(this, "InvalidState", "Component is in wrong state")
				.withDetails(this._state, state);
	}

	/**
	 * Checks if transition to the specified state is allowed from the current one.
	 * @param newState the new state to make transition
	 * @throws MicroserviceError when transition is not allowed.
	 */
	protected checkNewStateAllowed(newState: number): void {
		if (newState == State.Configured && this._state != State.Initial)
			throw new StateError(this, "InvalidState", "Component cannot be configured")
				.withDetails(this._state, State.Configured);

		if (newState == State.Linked && this._state != State.Configured)
			throw new StateError(this, "InvalidState", "Component cannot be linked")
				.withDetails(this._state, State.Linked);

		if (newState == State.Opened && this._state != State.Linked && this._state != State.Closed)
			throw new StateError(this, "InvalidState", "Component cannot be opened")
				.withDetails(this._state, State.Opened);

		if (newState == State.Closed && this._state != State.Opened)
			throw new StateError(this,"InvalidState", "Component cannot be closed")
				.withDetails(this._state, State.Closed);
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
		this._config = config;
		this._state = State.Configured; 
	}
	
	/**
	 * Skips configuration step. Usually this method is used in testing.
	 */
	public skipConfigure(): void {
		this.configure(new ComponentConfig());
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
		this.checkNewStateAllowed(State.Linked);
		
		// Get reference to discovery component
		this._discovery = <IDiscovery>components.getOneOptional(
			new ComponentDescriptor(Category.Discovery, '*', '*', '*')
		);
		
		// Get reference to logger(s)
		this._loggers = <ILogger[]>components.getAllOptional(
			new ComponentDescriptor(Category.Logs, '*', '*', '*')	
		);
		
		// Get reference to counters component
		this._counters = <ICounters>components.getOneOptional(
			new ComponentDescriptor(Category.Counters, '*', '*', '*')
		);

		this._state = State.Linked;
    }

	/**
	 * Skips link step. Usually this method is used in testing.
	 */
	public skipLink(): void {
		this.link(new DynamicMap(), new ComponentSet());
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
		this._state = State.Opened;
		this.trace(null, "Component " + this._descriptor.toString() + " opened");

        callback(null); 
    }
    
	/**
	 * Closes the component and all open connections, performs deinitialization
	 * steps. Closure can only be done from opened state. Attempts to close
	 * already closed component or in wrong order will cause exception.
	 * @param callback a callback to report success or error in closing  
	 */
    public close(callback: (err: any) => void): void { 
		this.checkNewStateAllowed(State.Closed);
		this._state = State.Closed;
		this.trace(null, "Component " + this._descriptor.toString() + " closed");

        callback(null); 
    }
        
    /* Logging */
    
	/**
	 * Writes message to log
	 * @param correlationId a unique id to identify distributed transacton
	 * @param message a message objects
	 */
	protected writeLog(level: number, correlationId: string, message: any[]) {
		if (this._loggers == null || this._loggers.length == 0) 
			return;

		let component = this._descriptor.toString();
    	for (let i = 0; i < this._loggers.length; i++) {
			let logger = this._loggers[i];			
            logger.log(level, component, correlationId, message);
        }
	}

	/**
	 * Logs fatal error that causes microservice to shutdown
	 * @param correlationId a unique id to identify distributed transaction
	 * @param message a list with message values
	 */
    public fatal(correlationId: string, ...message: any[]): void { 
		this.writeLog(LogLevel.Fatal, correlationId, message);
    }
    
    /**
     * Logs recoverable error
	 * @param correlationId a unique id to identify distributed transaction
     * @param message a list with message values
     */
    public error(correlationId: string, ...message: any[]): void { 
		this.writeLog(LogLevel.Error, correlationId, message);
    }
    
    /**
     * Logs warning messages
	 * @param correlationId a unique id to identify distributed transaction
     * @param message a list with message values
     */
    public warn(correlationId: string, ...message: any[]): void { 
		this.writeLog(LogLevel.Warn, correlationId, message);
    }
    
    /**
     * Logs important information message
     * @param message a list with message values
     */
    public info(correlationId: string, ...message: any[]): void { 
		this.writeLog(LogLevel.Info, correlationId, message);
    }
    
    /**
     * Logs high-level debugging messages
	 * @param correlationId a unique id to identify distributed transaction
     * @param message a list with message values
     */
    public debug(correlationId: string, ...message: any[]): void { 
		this.writeLog(LogLevel.Debug, correlationId, message);
    }
    
    /**
     * Logs fine-granular debugging message
	 * @param correlationId a unique id to identify distributed transaction
     * @param message a list with message values
     */
    public trace(correlationId: string, ...message: any[]): void { 
		this.writeLog(LogLevel.Trace, correlationId, message);
    }

    /* Performance monitoring */

	/**
	 * Starts measurement of execution time interval.
	 * The method returns ITiming object that provides endTiming()
	 * method that shall be called when execution is completed
	 * to calculate elapsed time and update the counter.
	 * @param name the name of interval counter.
	 * @return callback interface with endTiming() method 
	 * that shall be called at the end of execution.
	 */
    protected beginTiming(name: string): ITiming {
        if (this._counters) 
            return this._counters.beginTiming(name);
        else
            return <ITiming>{ endTiming(): void {} };
    }    
    
	/**
	 * Calculates rolling statistics: minimum, maximum, average
	 * and updates Statistics counter.
	 * This counter can be used to measure various non-functional
	 * characteristics, such as amount stored or transmitted data,
	 * customer feedback, etc. 
	 * @param name the name of statistics counter.
	 * @param value the value to add to statistics calculations.
	 */
    protected stats(name: string, value: number): void { 
        if (this._counters) this._counters.stats(name, value); 
    }
        
	/**
	 * Records the last reported value. 
	 * This counter can be used to store performance values reported
	 * by clients or current numeric characteristics such as number
	 * of values stored in cache.
	 * @param name the name of last value counter
	 * @param value the value to be stored as the last one
	 */
    protected last(name: string, value: number): void {
        if (this._counters) this._counters.last(name, value); 
    }
    
	/**
	 * Records the current time.
	 * This counter can be used to track timing of key
	 * business transactions.
	 * @param name the name of timing counter
	 */
    protected timestampNow(name: string): void {
        this.timestamp(name, new Date()); 
    }

	/**
	 * Records specified time.
	 * This counter can be used to tack timing of key
	 * business transactions as reported by clients.
	 * @param name the name of timing counter.
	 * @param value the reported timing to be recorded.
	 */
    protected timestamp(name: string, value: Date): void {
        if (this._counters) this._counters.timestamp(name, value); 
    }
    
	/**
	 * Increments counter by value of 1.
	 * This counter is often used to calculate
	 * number of client calls or performed transactions.
	 * @param name the name of counter counter.
	 */
    protected incrementOne(name: string): void {
        this.increment(name, 1); 
    }

	/**
	 * Increments counter by specified value.
	 * This counter can be used to track various
	 * numeric characteristics
	 * @param name the name of the increment value.
	 * @param value number to increase the counter.
	 */
    protected increment(name: string, value: number): void {
        if (this._counters) this._counters.increment(name, value); 
    }

 	/**** Utility Methods ******/

	/**
	 * Generates a string representation for this component
	 * @return a component descriptor in string format
	 */
	public toString() : string {
		return this._descriptor.toString();
	}    
}
