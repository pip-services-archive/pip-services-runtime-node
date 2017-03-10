let _ = require('lodash');

import { MicroserviceError } from '../errors/MicroserviceError';
import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { AbstractComponent } from '../AbstractComponent';
import { IClient } from '../IClient';

/**
 * Abstract implementation for all microservice client components.
 * 
 * @author Sergey Seroukhov
 * @version 1.1
 * @since 2016-06-09
 */
export abstract class AbstractClient extends AbstractComponent implements IClient {
	/**
	 * Creates and initializes instance of the microservice client component.
	 * @param descriptor the unique descriptor that is used to identify and locate the component.
	 */
    constructor(descriptor: ComponentDescriptor) {
        super(descriptor);
    }
  
	/**
	 * Does instrumentation of performed business method by counting elapsed time.
     * 
     * The instrumentation wraps callback by a function that writes trace messages
     * and tracks elapsed time as a counter.
     * 
	 * @param correlationId a unique id to idenfity distributed transactions
	 * @param name the name of called business method
	 * @param callback a callback function to wrap client operation
	 */
    protected instrument(correlationId: string, name: string, callback: any) {
        this.trace(correlationId, 'Calling ' + name + ' method');
        
        let timing = this.beginTiming(name + '.call_time');
        
        return (err, data) => {
            timing.endTiming();

            // Unwrapping errors
            err = MicroserviceError.unwrap(err);
            
            // Handling restify issue when null is received as {}
            if (_.isObject(data) && _.isEmpty(data))
                data = null;
            
            if (callback) callback(err, data);
        }
    }
    
}
