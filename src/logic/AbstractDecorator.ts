import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { AbstractBusinessLogic } from './AbstractBusinessLogic';
import { IDecorator } from '../IDecorator';

/**
 * Abstract implementation of business logic decorators.
 * Decorators are typically used to alter standard behavior
 * of microservice business logic by injecting custom logic
 * before or after execution.
 * 
 * @author Sergey Seroukhov
 * @version 1.1
 * @since 2016-065-09
 */
export abstract class AbstractDecorator extends AbstractBusinessLogic implements IDecorator {
	/**
	 * Creates instance of abstract business logic decorator
	 * @param descriptor the unique descriptor that is used to identify and locate the component.
	 */
    constructor(descriptor: ComponentDescriptor) {
        super(descriptor);
    }
}
