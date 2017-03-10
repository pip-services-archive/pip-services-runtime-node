import { DynamicMap } from '../portability/DynamicMap';
import { MicroserviceError } from '../errors/MicroserviceError';
import { ICommand } from './ICommand';

/**
 * Interface for stackable command intercepters
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-12
 */
export interface ICommandIntercepter {
	/**
	 * Gets the command name. Intercepter can modify the name if needed
	 * @param command the name of intercepted command
	 * @return the command name
	 */
	getName(command: ICommand): string;
	
	/**
	 * Executes the command given specific arguments as an input.
	 * @param command the intercepted command
	 * @param correlationId a unique correlation/transaction id
	 * @param args map with command arguments
	 * @param callback a callback to return execution result or an error.
	 */
	execute(command: ICommand, correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void): void;
	
	/**
	 * Performs validation of the command arguments.
	 * @param command the intercepted command
	 * @param args map with command arguments
	 * @return a list of errors or empty list if validation was successful.
	 */
	validate(command: ICommand, args: DynamicMap): MicroserviceError[];
}
