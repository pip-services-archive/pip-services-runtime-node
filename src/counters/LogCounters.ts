let _ = require('lodash');

import { Category } from '../config/Category';
import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { AbstractCounters } from './AbstractCounters';
import { CounterType } from './CounterType';
import { Counter } from './Counter';

/**
 * Performance counters component that periodically dumps counters
 * to log as message: 'Counter <name> {"type": <type>, "last": <last>, ...}
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-05-01
 */
export class LogCounters extends AbstractCounters {
	/**
	 * Unique descriptor for the LogCounters component
	 */
	public static Descriptor: ComponentDescriptor = new ComponentDescriptor(
		Category.Counters, "pip-services-runtime-counters", "log", "*"
	);

	/**
	 * Creates instance of log counters component.
	 */
    constructor() {
        super(LogCounters.Descriptor);
    }

	/**
	 * Formats counter string representation.
	 * @param counter a counter object to generate a string for.
	 * @return a formatted string representation of the counter.
	 */
    private counterToString(counter: Counter) {
        return 'Counter ' + counter.name 
            + ' ' + JSON.stringify(_.omit(counter, 'name'));
    }

    /**
     * Outputs a list of counter values to log.
     * @param counter a list of counters to be dump to log.
     */
    protected save(counters: Counter[], callback: (err: any) => void) {
        if (_.isEmpty(counters)) {
            callback(null);
            return;
        }

        counters = _.sortBy(counters, (counter) => counter.name);
        _.each(counters, (counter) => {
            this.debug(null, this.counterToString(counter));
        });
        
        callback(null);
    }
}
