import { IComponent } from '../IComponent';
import { ICommand } from './ICommand';
import { DynamicMap } from '../portability/DynamicMap';
import { MicroserviceError } from '../errors/MicroserviceError';
import { UnknownError } from '../errors/UnknownError';
import { Schema } from '../validation/Schema';

type CommandFunction = (correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void) => void;

/**
 * Represents a command that implements a command pattern
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-13
 */
export class Command implements ICommand {
	private _component: IComponent;
	private _name: string;
	private _schema: Schema;
	private _function: CommandFunction;
	
	/**
	 * Creates a command instance
	 * @param component a component this command belongs to
	 * @param name the name of the command
	 * @param schema a validation schema for command arguments
	 * @param function an execution function to be wrapped into this command.
	 */
	constructor(component: IComponent, name: string, schema: Schema, func: CommandFunction) {
		if (name == null)
			throw new Error("Command name is not set");
		if (func == null)
			throw new Error("Command function is not set");
		
		this._component = component;
		this._name = name;
		this._schema = schema;
		this._function = func;
	}

	/**
	 * Gets the command name.
	 * @return the command name
	 */
	public getName(): string {
		return this._name;
	}

	/**
	 * Executes the command given specific arguments as an input.
	 * @param correlationId a unique correlation/transaction id
	 * @param args map with command arguments
	 * @param callback a callback to return execution result or an error.
	 */
	public execute(correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void): void {
		// Validate arguments
		if (this._schema != null) {
			let errors = this.validate(args);
			// Return the 1st error
			if (errors.length > 0) {
                callback(errors[0], null);
				return;
            }
		}
		
		// Call the function
		try {
			this._function(correlationId, args, callback);
		}
		// Intercept unhandled errors
		catch (err) {
			err = new UnknownError(
				this._component, 
				"CommandFailed", 
				"Execution " + this._name + " failed: " + err
			)
			.withDetails(this._name)
			.withCorrelationId(correlationId)
			.wrap(err);
		}
	}

	/**
	 * Performs validation of the command arguments.
	 * @param args command arguments
	 * @return a list of errors or empty list if validation was successful.
	 */
	public validate(args: DynamicMap): MicroserviceError[] {
		// When schema is not defined, then skip validation
		if (this._schema == null) 
			return [];
		
		// ToDo: Complete implementation
		return [];
	}
}
