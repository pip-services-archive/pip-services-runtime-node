import { DynamicMap } from '../portability/DynamicMap';
import { MicroserviceError } from '../errors/MicroserviceError';
import { ICommand } from './ICommand';
import { ILogger } from '../ILogger';
import { LogLevel } from '../LogLevel';
import { ICommandIntercepter } from './ICommandIntercepter';

/**
 * Intercepter that writes trace messages for every executed command.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-12
 */
export class TracingIntercepter implements ICommandIntercepter {
	private _loggers: ILogger[];
	private _verb: string;
	
    /**
     * Creates instance of tracing intercepter
     * @param log a logger component.
     * @param verb a verb for tracing message as '<verb> <command>, ...'
     */
	constructor(loggers: ILogger[], verb: string) {
		this._loggers = loggers;
		this._verb = verb || "Executing";
	}

	/**
	 * Gets the command name.
	 * @param command the intercepted command
	 * @return the command name
	 */
	public getName(command: ICommand): string {
		return command.getName();
	}
	
	/**
	 * Executes the command given specific arguments as an input.
	 * @param command the intercepted command
	 * @param correlationId a unique correlation/transaction id
	 * @param args map with command arguments
	 * @param callback a callback to return execution result or an error.
	 */
	public execute(command: ICommand, correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void): void {
		// Write trace message about the command execution
		if (this._loggers != null) {
			let name: string = command.getName();
			let message: string = this._verb + " " + name + " command";

			// Output to all loggers
			for (let i = 0; i < this._loggers.length; i++)
				this._loggers[i].log(LogLevel.Trace, null, correlationId, [message]);
		}
		
		command.execute(correlationId, args, callback);
	}
	
	/**
	 * Performs validation of the command arguments.
	 * @param command the intercepted command
	 * @param args command arguments
	 * @return a list of errors or empty list if validation was successful.
	 */
	public validate(command: ICommand, args: DynamicMap): MicroserviceError[] {
		return command.validate(args);
	}

}
