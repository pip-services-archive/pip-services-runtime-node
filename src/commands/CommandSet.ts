import { DynamicMap } from '../portability/DynamicMap';
import { IdGenerator } from '../data/IdGenerator';
import { MicroserviceError } from '../errors/MicroserviceError';
import { UnknownError } from '../errors/UnknownError';
import { ICommand } from './ICommand';
import { ICommandIntercepter } from './ICommandIntercepter';
import { InterceptedCommand } from './InterceptedCommand';

/**
 * Handles command registration and execution.
 * Enables intercepters to control or modify command behavior 
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-12
 */
export class CommandSet {
	private _commands: ICommand[] = [];
	private _commandsByName: any = {};
	private _intercepters: ICommandIntercepter[] = [];
	
	/**
	 * Create a command set instance.
	 */
	constructor() {}
	
	/**
	 * Get all supported commands
	 * @return a list with all commands supported by component. 
	 */
	public getCommands(): ICommand[] {
		return this._commands;
	}
	
	/**
	 * Find a specific command by its name.
	 * @param command the command name.
	 * @return an object with command name.
	 */
	public findCommand(command: string): ICommand {
		return <ICommand>this._commandsByName[command];
	}

	/**
	 * Builds execution chain including all intercepters
	 * and the specified command.
	 * @param command the command to build a chain.
	 */
	private buildCommandChain(command: ICommand): void {
		let next: ICommand = command;
		for (let i = this._intercepters.length - 1; i >= 0; i--) {
			next = new InterceptedCommand(this._intercepters[i], next);
		}
		this._commandsByName[next.getName()] = next;
	}

	/**
	 * Rebuilds execution chain for all registered commands.
	 * This method is typically called when intercepters are changed.
	 * Because of that it is more efficient to register intercepters
	 * before registering commands (typically it will be done in abstract classes).
	 * However, that performance penalty will be only once during creation time. 
	 */
	private rebuildAllCommandChains(): void {
		this._commandsByName = {};
		for (let i = 0; i < this._commands.length; i++) {
            let command = this._commands[i];
			this.buildCommandChain(command);
		}
	}
	
	/**
	 * Adds a command to the command set.
	 * @param command a command instance to be added
	 */
	public addCommand(command: ICommand): void {
		this._commands.push(command);
		this.buildCommandChain(command);
	}

	/**
	 * Adds a list of commands to the command set
	 * @param commands a list of commands to be added
	 */
	public addCommands(commands: ICommand[]): void {
		for (let i = 0; i < this._commands.length; i++) {
            let command = this._commands[i];
			this.addCommand(command);
		}
	}

	/**
	 * Adds commands from another command set to this one
	 * @param commands a commands set to add commands from
	 */
	public addCommandSet(commands: CommandSet): void {
        let crefs = commands.getCommands(); 
		for (let i = 0; i < crefs.length; i++) {
            let command = crefs[i];
			this.addCommand(command);
		}
	}
	
	/**
	 * Adds intercepter to the command set.
	 * @param intercepter an intercepter instance to be added.
	 */
	public addIntercepter(intercepter: ICommandIntercepter): void {
		this._intercepters.push(intercepter);
		this.rebuildAllCommandChains();
	}
	
	/**
	 * Executes the command given specific arguments as an input.
	 * @param command the command name.
	 * @param correlationId a unique correlation/transaction id
	 * @param args map with command arguments
	 * @param callback a callback to return execution result or an error.
	 */
	public execute(command: string, correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void): void {
		// Get command and throw error if it doesn't exist
		let cref: ICommand = this.findCommand(command);
		if (cref == null)
			throw new UnknownError("NoCommand", "Requested command does not exist")
				.withDetails(command);

		// Generate correlationId if it doesn't exist
		// Use short ids for now
		if (correlationId == null)
			correlationId = IdGenerator.short();
		
		// Validate command arguments before execution and return the 1st found error
		let errors = cref.validate(args);
		if (errors.length > 0) {
			callback(errors[0], null);
            return;
        }
				
		// Execute the command.
		cref.execute(correlationId, args, callback);
	}
	
	/**
	 * Validates command arguments.
	 * @param command the command name.
	 * @param args a list of command arguments.
	 * @return a list of validation errors or empty list when arguments are valid.
	 */
	public validate(command: string, args: DynamicMap): MicroserviceError[] {
		let cref = this.findCommand(command);
		if (cref == null) {
			let errors: MicroserviceError[] = [];
			errors.push(
                new UnknownError("NoCommand", "Requested command does not exist")
				    .withDetails(command)
			);
			return errors;
		}
		return cref.validate(args);
	}

}
