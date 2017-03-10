import { DynamicMap } from '../portability/DynamicMap';
import { MicroserviceError } from '../errors/MicroserviceError';

/**
 * Interface for commands that execute functional operations.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-12
 */
export interface ICommand {
	/**
	 * Gets the command name.
	 * @return the command name
	 */
	getName(): string;
	
	/**
	 * Executes the command given specific arguments as an input.
	 * @param correlationId a unique correlation/transaction id
	 * @param args command arguments
	 * @param callback a callback function to be called
	 * with error or execution result
	 */
	execute(correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void);
	
	/**
	 * Performs validation of the command arguments.
	 * @param args command arguments
	 * @return a list of errors or empty list if validation was successful.
	 */
	validate(args: DynamicMap): MicroserviceError[];
}
