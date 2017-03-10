import { IComponent } from './IComponent';
import { ICommand } from './commands/ICommand';
import { DynamicMap } from './portability/DynamicMap';
import { MicroserviceError } from './errors/MicroserviceError';

/**
 * Interface for components that implement microservice
 * business logic: controllers or decorators.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
export interface IBusinessLogic extends IComponent {
	/**
	 * Get all supported commands
	 * @return a list with all commands supported by component. 
	 */
	getCommands(): ICommand[];
	
	/**
	 * Find a specific command by its name.
	 * @param command the command name.
	 * @return a found command or <b>null</b> if nothing was found
	 */
	findCommand(command: string): ICommand;
	
	/**
	 * Execute command by its name with specified arguments.
	 * @param command the command name.
	 * @param correlationId a unique correlation/transaction id
	 * @param args a list of command arguments.
	 * @param callback callback function that is called 
	 * with execution error or result 
	 * @throws MicroserviceError when execution fails for any reason.
	 */
	execute(command: string, correlationId: string, 
		args: DynamicMap, callback: (err: any, result: any) => void);
	
	/**
	 * Validates command arguments.
	 * @param command the command name.
	 * @param args a list of command arguments.
	 * @return a list of validation errors or empty list when arguments are valid.
	 */
	validate(command: string, args: DynamicMap): MicroserviceError[];
}
