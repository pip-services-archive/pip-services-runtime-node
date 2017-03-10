import { DynamicMap } from '../portability/DynamicMap';
import { MicroserviceError } from '../errors/MicroserviceError';
import { ICommand } from './ICommand';
import { ICounters } from '../ICounters';
import { ITiming } from '../ITiming';
import { ICommandIntercepter } from './ICommandIntercepter';

/**
 * Intercepter that times execution elapsed time.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-12
 */
export class TimingIntercepter implements ICommandIntercepter {
	private _counters: ICounters;
	private _suffix: string;
	
	/**
	 * Creates instance of timing intercepter.
	 * @param counters a reference to performance counters
	 * @param suffix a suffix to create a counter name as <command>.<suffix>
	 */
	constructor(counters: ICounters, suffix: string) {
		this._counters = counters;
		this._suffix = suffix || "ExecTime";
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
		// Starting measuring elapsed time
		let timing: ITiming = null;
		if (this._counters != null) {
			let name = command.getName() + "." + this._suffix;
			timing = this._counters.beginTiming(name);
		}
		
        // Execute command
	    command.execute(correlationId, args, (err: any, result: any): void => {
			// Complete measuring elapsed time
			if (timing != null) timing.endTiming();

            // Return results through callback
            callback(err, result);
        });
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
