import { DynamicMap } from '../portability/DynamicMap';
import { IEventListener } from './IEventListener';

/**
 * Interface for command events.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-12
 */
export interface IEvent
{
    /**
     * Gets the event name.
     * @returns the event name
     */
    getName(): string;

    /**
     * Gets listeners that receive notifications for that event
     * @returns an list of listeners
     */
    getListeners(): IEventListener[]

    /**
     * Adds a listener to receive notifications
     * @param listener a listener to be added
     */
    addListener(listener: IEventListener): void;

    /**
     * Removes listener for event notifications
     * @param listener a listener to be removed
     */
    removeListener(listener: IEventListener): void;

    /**
     * Notifies all listeners about the event.
     * @param correlationId a unique correlaton/transaction id
     * @param value event value
     */
    notify(correlationId: string, args: DynamicMap): void;
}
