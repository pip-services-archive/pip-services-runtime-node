import { IComponent } from './IComponent';

/**
 * Logger that logs messages from other microservice components.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-05-01
 */
export interface ILogger extends IComponent {
	/**
	 * Get the current level of details
	 * @see LogLevel
	 * @return returns the current log level
	 */
	getLevel(): number;
    
    /**
     * Writes a message to the log
     * @param level a log level - Fatal, Error, Warn, Info, Debug or Trace
     * @param component a component name
     * @param correlationId a correlationId
     * @param message a message objects
     */
    log(level: number, component: string, correlationId: string, message: any[]): void;
}
