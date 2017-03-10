import { DynamicMap } from '../portability/DynamicMap';
import { MicroserviceError } from '../errors/MicroserviceError';
import { ICommand } from '../commands/ICommand';
import { AbstractComponent } from '../AbstractComponent';
import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { IBusinessLogic } from '../IBusinessLogic';
import { CommandSet } from '../commands/CommandSet';
import { ICommandIntercepter } from '../commands/ICommandIntercepter';

/**
 * Abstract implementation for all microservice business logic components
 * that are able to perform business functions (commands).
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-12
 */
export class AbstractBusinessLogic extends AbstractComponent implements IBusinessLogic {
	private _commands: CommandSet = new CommandSet();
	
	/**
	 * Creates instance of abstract functional component
	 * @param descriptor the unique descriptor that is used to identify and locate the component.
	 */
	constructor(descriptor: ComponentDescriptor) {
		super(descriptor);
	}

	/**
	 * Get all supported commands
	 * @return a list with all commands supported by component. 
	 */
	public getCommands(): ICommand[] {
		return this._commands.getCommands();
	}
	
	/**
	 * Find a specific command by its name.
	 * @param command the command name.
	 * @return an object with command name.
	 */
	public findCommand(command: string): ICommand {
		return this._commands.findCommand(command);
	}

	/**
	 * Adds a command to the command set.
	 * @param command a command instance to be added
	 */
	protected addCommand(command: ICommand): void {
		this._commands.addCommand(command);
	}

	/**
	 * Adds commands from another command set to this one.
	 * @param commands a command set that contains commands to be added
	 */
	protected addCommandSet(commands: CommandSet): void {
		this._commands.addCommandSet(commands);
	}
	
	/**
	 * Delegates all commands to another functional component.
	 * @param component a functional component to perform delegated commands.
	 */
	protected delegateCommands(component: IBusinessLogic): void {
		this._commands.addCommands(component.getCommands());
	}
	
	/**
	 * Adds intercepter to the command set.
	 * @param interceptor an intercepter instance to be added.
	 */
	protected addIntercepter(intercepter: ICommandIntercepter): void {
		this._commands.addIntercepter(intercepter);
	}
	
	/**
	 * Execute command by its name with specified arguments.
	 * @param command the command name.
	 * @param correlationId a unique correlation/transaction id
	 * @param args a list of command arguments.
	 * @param callback callback function that is called 
	 * with execution error or result 
	 * @throws MicroserviceError when execution fails for any reason.
	 */
	public execute(command: string, correlationId: string, 
		args: DynamicMap, callback: (err: any, result: any) => void) {
		this._commands.execute(command, correlationId, args, callback);
	}
	
	/**
	 * Validates command arguments.
	 * @param command the command name.
	 * @param args a list of command arguments.
	 * @return a list of validation errors or empty list when arguments are valid.
	 */
	public validate(command: string, args: DynamicMap): MicroserviceError[] {
		return this._commands.validate(command, args);
	}
}
