import { Microservice } from '../../src/run/Microservice';
import { DummyFactory } from '../build/DummyFactory';

/**
 * Dummy microservice class.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
export class DummyMicroservice extends Microservice {
	/**
	 * Creates instance of dummy microservice.
	 */
	constructor() {
		super("pip-services-dummies", DummyFactory.Instance);
	}
}
