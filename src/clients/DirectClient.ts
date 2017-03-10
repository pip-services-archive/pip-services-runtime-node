import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { AbstractClient } from './AbstractClient';

/**
 * Direct client implementation that allows to call another microservice from the same container.
 * 
 * It can be very useful for deployments of microservices as monolythic systems.
 * Although it may seem strange some situation may require deployment simplicity 
 * over scalability and other behefits of microservices. The good news, you have flexibility to 
 * adapt the end product without sacrifacing the system architecture.  
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
export abstract class DirectClient extends AbstractClient {
	/**
	 * Creates and initializes instance of the microservice client component.
	 * @param descriptor the unique descriptor that is used to identify and locate the component.
	 */
    constructor(descriptor: ComponentDescriptor) {
        super(descriptor);
    }  
}
