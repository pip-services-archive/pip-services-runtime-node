import { Category } from '../config/Category';
import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { AbstractLogger } from './AbstractLogger';
import { LogLevel } from '../LogLevel';
import { LogFormatter } from './LogFormatter';

export class ConsoleLogger extends AbstractLogger {
	/**
	 * Unique descriptor for the ConsoleLogger component
	 */
	public static Descriptor: ComponentDescriptor = new ComponentDescriptor(
		Category.Logs, "pip-services-runtime-log", "console", "*"
	);
    
    constructor() {
        super(ConsoleLogger.Descriptor);
    }

    /**
     * Writes a message to the log
     * @param level a log level - Fatal, Error, Warn, Info, Debug or Trace
     * @param component a component name
     * @param correlationId a correlationId
     * @param message a message objects
     */
    public log(level: number, component: string, correlationId: string, message: any[]): void {
        if (this.getLevel() < level) return;

        let output: string = LogFormatter.format(level, message);
        if (correlationId != null)
            output += ", correlated to " + correlationId; 

        if (level >= LogLevel.Fatal && level <= LogLevel.Warn)
            console.error(output);
        else console.log(output);
    }                
}
