import { ITiming } from '../ITiming';
import { CounterType } from './CounterType';
import { AbstractCounters } from './AbstractCounters';

/**
 * Implementation of ITiming interface that
 * provides callback to end measuring execution
 * time interface and update interval counter.
 * 
 * @author Sergey Seroukhov
 * @version 1.1
 * @since 2016-06-09
 */
export class Timing implements ITiming {
    private _start: number;
    private _counters: AbstractCounters;
    private _name: string;
        
	/**
	 * Creates instance of timing object that calculates elapsed time
	 * and stores it to specified performance counters component under specified name.
	 * @param counters a performance counters component to store calculated value.
	 * @param name a name of the counter to record elapsed time interval.
	 */
    constructor(counters: AbstractCounters, name: string) {
        this._counters = counters;
        this._name = name;
        this._start = Date.now();
    }
    
	/**
	 * Completes measuring time interval and updates counter.
	 */
    public endTiming(): void {
        let elapsed = Date.now() - this._start;
        this._counters.setTiming(this._name, elapsed);
    }
}