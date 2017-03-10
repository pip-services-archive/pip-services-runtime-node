import { DynamicMap } from '../portability/DynamicMap';
import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { AbstractBusinessLogic } from './AbstractBusinessLogic';
import { ComponentSet } from '../ComponentSet';
import { IController } from '../IController';
import { TracingIntercepter } from '../commands/TracingIntercepter';
import { TimingIntercepter } from '../commands/TimingIntercepter';

/**
 * Abstract implementation for business logic controller.
 * 
 * @author Sergey Seroukhov
 * @version 1.1
 * @since 2016-06-09
 */
export abstract class AbstractController extends AbstractBusinessLogic implements IController {
	/**
	 * Creates instance of abstract controller
	 * @param descriptor the unique descriptor that is used to identify and locate the component.
	 */
    constructor(descriptor: ComponentDescriptor) {
        super(descriptor);
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
        super.link(context, components);

		// Commented until we decide to use command pattern as everywhere
		// Until now the main method is to implement specific methods with instrumentation
        // this.addIntercepter(new TracingIntercepter(this._loggers, 'Executing'));
        // this.addIntercepter(new TimingIntercepter(this._counters, 'exec_time'));
     }    

	/**
	 * Does instrumentation of performed business method by counting elapsed time.
	 * @param correlationId a unique id to idenfity distributed transactions
	 * @param name the name of called business method
	 * @param callback a callback function to wrap client operation
	 */
    protected instrument(correlationId: string, name: string, callback: any) {
        this.trace(correlationId, 'Executing ' + name + ' method');
        
        let timing = this.beginTiming(name + '.exec_time');
        
        return (err, data) => {
            timing.endTiming();

            if (callback) callback(err, data);
        }
    }
}
