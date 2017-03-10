import { AbstractComponent } from '../AbstractComponent';
import { Category } from '../config/Category';
import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { ICounters } from '../ICounters';
import { CounterType } from './CounterType';
import { ITiming } from '../ITiming';
import { Timing } from './Timing';
import { Counter } from './Counter';

/**
 * Performance counters component that doesn't calculate or do anything.
 * NullCounter can be used to disable performance monitoring for performance reasons.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-05-01
 */
export class NullCounters extends AbstractComponent implements ICounters {
	/**
	 * Unique descriptor for the NullCounters component
	 */
	public static Descriptor: ComponentDescriptor = new ComponentDescriptor(
		Category.Counters, "pip-services-runtime-lcounters", "null", "*"
	);

	/**
	 * Creates instance of null counter that doesn't do anything.
	 */
    constructor() {
        super(NullCounters.Descriptor);
    }

	/**
	 * Suppresses time measurements and returns
	 * ITiming interface with endTiming() method
	 * that doesn't do another,
	 * @param name the name of interval counter.
	 * @return callback interface with empty endTiming() method.
	 */
    public beginTiming(name: string): ITiming {
        return <ITiming>{ endTiming(): void {} };
    }
    
	/**
	 * Suppresses calculation of statistics 
	 * @param name the name of statistics counter.
	 * @param value the value to add to statistics calculations.
	 */
    public stats(name: string, value: number) {}    

	/**
	 * Suppresses recording of the last value.
	 * @param name the name of last value counter
	 * @param value the value to be stored as the last one
	 */
    public last(name: string, value: number) {}    

	/**
	 * Suppresses recording of the current time.
	 * @param name the name of timing counter
	 */
    public timestampNow(name: string) {}    

	/**
	 * Suppresses recording of the specified time.
	 * @param name the name of timing counter
     * @param value the specified time
	 */
    public timestamp(name: string, value: Date) {}    

	/**
	 * Suppresses counter increment by 1.
	 * @param name the name of the increment value.
	 */
    public incrementOne(name: string) {}

	/**
	 * Suppresses counter increment.
	 * @param name the name of the increment value.
	 * @param value number to increase the counter.
	 */
    public increment(name: string, value: number) {}
}
