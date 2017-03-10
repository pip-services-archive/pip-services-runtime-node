import { DynamicMap } from '../portability/DynamicMap';
import { MicroserviceError } from '../errors/MicroserviceError';
import { ICommand } from './ICommand';
import { ICommandIntercepter } from './ICommandIntercepter';

/**
 * Interceptor wrapper to turn it into stackable command
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-12
 */
export class InterceptedCommand implements ICommand {
	private _intercepter: ICommandIntercepter;
	private _next: ICommand;
	
	/**
	 * Creates instance of intercepted command by chaining
	 * intercepter with the next intercepter in the chain 
	 * or command at the end of the chain.
	 * @param intercepter the intercepter reference.
	 * @param next the next intercepter or command in the chain.
	 */
	constructor(intercepter: ICommandIntercepter, next: ICommand) {
		this._intercepter = intercepter;
		this._next = next;
	}
	
	/**
	 * Gets the command name.
	 * @return the command name
	 */
	public getName(): string {
		return this._intercepter.getName(this._next);
	}
	
	/**
	 * Executes the command given specific arguments as an input.
	 * @param correlationId a unique correlation/transaction id
	 * @param args map with command arguments
	 * @param callback a callback to return execution result or an error.
	 */
	public execute(correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void): void {
		this._intercepter.execute(this._next, correlationId, args, callback);
	}
	
	/**
	 * Performs validation of the command arguments.
	 * @param args command arguments
	 * @return a list of errors or empty list if validation was successful.
	 */
	public validate(args: DynamicMap): MicroserviceError[] {
		return this._intercepter.validate(this._next, args);
	}
}
