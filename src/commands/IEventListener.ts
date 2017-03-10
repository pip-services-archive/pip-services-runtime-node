import { DynamicMap } from '../portability/DynamicMap';
import { IEvent } from './IEvent';

/**
 * Listener for command events
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-09-08
 */
export interface IEventListener
{
	/**
	 * Notifies that event occured.
     * @param e event reference
	 * @param correlationId a unique correlation/transaction id
	 * @param args command arguments
	 */
    onEvent(e: IEvent, correlationId: string, value: DynamicMap): void;
}
