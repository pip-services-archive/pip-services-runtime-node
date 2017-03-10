let _ = require('lodash');

import { DynamicMap } from '../portability/DynamicMap';
import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { ComponentConfig } from '../config/ComponentConfig';
import { State } from '../State';
import { AbstractComponent } from '../AbstractComponent';
import { ICounters } from '../ICounters';
import { CounterType } from './CounterType';
import { Counter } from './Counter';
import { ITiming } from '../ITiming';
import { Timing } from './Timing';

export abstract class AbstractCounters extends AbstractComponent implements ICounters {
	private static DefaultConfig = DynamicMap.fromTuples(
		"options.timeout", 60000
	); 

    private _cache: any = {};
    private _updated: boolean = false;
    private _interval: any;
    private _timeout: number;

	/**
	 * Creates and initializes instance of the microservice performance counter
	 * @param descriptor the unique descriptor that is used to identify and locate the component.
	 */
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
		
		super.configure(config.withDefaults(AbstractCounters.DefaultConfig));

        // Convert timeout to seconds
		this._timeout =  Math.max(1000, this._config.getOptions().getInteger('timeout'));
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
            () => { this.dump(); }, 
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

        // Save and clear counters if any
        if (this._updated) {
            let counters = this.getAll();
            this.save(counters, (err) => {
                this.resetAll();

                if (err) callback(err);
                else super.close(callback);
            });
        } else
            super.close(callback);
    }

    protected abstract save(counters: Counter[], callback: (err: any) => void): void;

    public reset(name: string): void {
        delete this._cache[name];
    } 
        
    public resetAll(): void {
        this._cache = {};
        this._updated = false;
    }

    public dump(): void {
        if (this._updated) {
            let counters = this.getAll();
            this.save(counters, (err) => {
                if (err) this.error(null, err, 'Error while saving counters');
                else this._updated = false;
            });
        }
    }

    public getAll(): Counter[] {
        var result: Counter[] = [];

        for (var name in this._cache) {
            if (this._cache.hasOwnProperty(name))
                result.push(this._cache[name]);
        }

        return result;
    };

    public get(name: string, type: CounterType): Counter {
        if (name == '') 
            throw new Error('Counter name was not set');
            
        let counter: Counter = this._cache[name];

        if (counter == null || counter.type != type) {
            counter = new Counter(name, type);
            this._cache[name] = counter;
        }
        
        return counter;
    }
                                                        
    private calculateStats(counter: Counter, value: number): void {
        if (counter == null) 
            throw new Error('Missing counter');

        counter.last = value;
        counter.count = _.isUndefined(counter.count) ? 1 : counter.count + 1;
        counter.max = _.isUndefined(counter.max) ? value : Math.max(counter.max, value);
        counter.min = _.isUndefined(counter.min) ? value : Math.min(counter.min, value);
        counter.avg = _.isUndefined(counter.avg) || counter.count == 1
            ? value : ((counter.avg * (counter.count - 1)) + value) / counter.count;

        this._updated = true;
    }
            
    public setTiming(name: string, elapsed: number): void {
        let counter = this.get(name, CounterType.Interval);
        this.calculateStats(counter, elapsed);
    }        
            
    public beginTiming(name: string): ITiming {
        return new Timing(this, name);
    }
    
    public stats(name: string, value: number): void {
        let counter = this.get(name, CounterType.Statistics);
        this.calculateStats(counter, value);
        this._updated = true;
    }
    
    public last(name: string, value: number): void {
        let counter = this.get(name, CounterType.LastValue);
        counter.last = value;
        this._updated = true;
    }
    
    public timestampNow(name: string): void {
        this.timestamp(name, new Date());
    }

    public timestamp(name: string, value: Date): void {
        let counter = this.get(name, CounterType.Timestamp);
        counter.time = value || new Date();
        this._updated = true;
    }

    public incrementOne(name: string): void {
        this.increment(name, 1);
    }
    
    public increment(name: string, value: number): void {
        value = _.isNumber(value) ? value: 1;
        let counter = this.get(name, CounterType.Increment); 
        counter.count = _.isUndefined(counter.count)
            ? value : counter.count + value;
        this._updated = true;
    }
}
