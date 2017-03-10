import { IComponent } from '../IComponent';
import { IEvent } from './IEvent';
import { IEventListener } from './IEventListener';
import { AbstractComponent } from '../AbstractComponent';
import { DynamicMap } from '../portability/DynamicMap';
import { MicroserviceError } from '../errors/MicroserviceError';
import { UnknownError } from '../errors/UnknownError';
// import { Schema } from '../validation/Schema';

type CommandFunction = (correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void) => void;

/**
 * Events to receive notifications on command execution results and failures.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-13
 */
export class Event implements IEvent {
	private _component: IComponent;
	private _name: string;
	private _listeners: IEventListener[] = [];
	
	/**
	 * Creates a command instance
	 * @param component a component this command belongs to
	 * @param name the name of the command
	 * @param schema a validation schema for command arguments
	 * @param function an execution function to be wrapped into this command.
	 */
	constructor(component: IComponent, name: string) {
		if (name == null)
			throw new Error("Command name is not set");
		
		this._component = component;
		this._name = name;
	}

	/**
	 * Gets the event name.
	 * @return the event name
	 */
	public getName(): string {
		return this._name;
	}

    /**
     * Gets the listeners that receive notifications for this event
     */
    public getListeners(): IEventListener[] {
        return this._listeners;
    }

    /**
     * Adds listener to receive notifications
     * @param name a listener reference to be added
     */
    public addListener(listener: IEventListener): void
    {
        this._listeners.push(listener);
    }

    /**
     * Removes a listener for event notifications
     * @param listener a listener reference to be removed
     */
    public removeListener(listener: IEventListener): void
    {
        var index = this._listeners.indexOf(listener);
        if (index >= 0)
            this._listeners.splice(index, 1);
    }

    /**
     * Notifies all listeners about the event
     * @param correlatonId a nique correlation/transacton id
     * @param value an event value
     */
    public notify(correlationId: string, value: DynamicMap): void
    {
        for (var index = 0; index < this._listeners.length; index++)
        {
            var listener = this._listeners[index];
            try
            {
                listener.onEvent(this, correlationId, value);
            }
            catch (ex)
            {
                // Wrap the error
                var error = new UnknownError(
                    this._component,
                    "EventFailed",
                    "Rasing event " + this._name + " failed: " + ex
                )
                .withDetails(this._name)
                .withCorrelationId(correlationId)
                .wrap(ex);

                // Output the error
                var component = this._component as AbstractComponent;
                if (component != null)
                {
                    component.error(correlationId, error);
                }
            }
        }
    }
}
