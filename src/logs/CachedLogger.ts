import { Converter } from '../portability/Converter';
import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { ComponentConfig } from '../config/ComponentConfig';
import { State } from '../State';
import { AbstractLogger } from './AbstractLogger';
import { LogLevel } from '../LogLevel';
import { LogEntry } from './LogEntry';
import { DynamicMap } from '../portability/DynamicMap';

export abstract class CachedLogger extends AbstractLogger {
	private DefaultConfig1: DynamicMap = DynamicMap.fromTuples(
		"options.timeout", 1000 // timeout in milliseconds
	); 

    private _cache: LogEntry[] = [];
    private _interval: any;
    private _timeout: number;
    
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
		
		super.configure(config.withDefaults(this.DefaultConfig1));

        // Define dump timeout 
        this._timeout = Math.max(1000, this._config.getOptions().getInteger("timeout"));
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

        // Stop previously set timer 
        if (this._interval) 
            clearInterval(this._interval);
            
        // Set a new timer
        this._interval = setInterval(
            () => { this.onTimer(); }, 
            this._timeout
        );
                
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

        // Stop previously set timer
        if (this._interval) 
            clearInterval(this._interval);

        // Clear timer ID
        this._interval = null;

        if (this._cache.length > 0) {
            this.save(this._cache, (err) => {
                this._cache = [];
                if (err) callback(err);
                else super.close(callback);
            });
        } else
            super.close(callback);
    }        

    /**
     * Writes a message to the log
     * @param level a log level - Fatal, Error, Warn, Info, Debug or Trace
     * @param component a component name
     * @param correlationId a correlationId
     * @param message a message objects
     */
    public log(level: number, component: string, correlationId: string, message: any[]): void {
        if (this._level >= level) {
            this._cache.push(
                new LogEntry(level, component, new Date(), correlationId, message)
            );
        }
    }
        
    private onTimer(): void {
        if (this._cache.length > 0) { 
            let entries = this._cache;
            this._cache = [];

            this.save(entries, (err) => {
                if (err) console.error(err);
            });
        }
    }
    
    protected abstract save(entries: LogEntry[], callback): void;
}
