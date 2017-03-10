import { Category } from '../config/Category';
import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { AbstractLogger } from './AbstractLogger';

export class NullLogger extends AbstractLogger {
	/**
	 * Unique descriptor for the NullLogger component
	 */
	public static Descriptor: ComponentDescriptor = new ComponentDescriptor(
		Category.Logs, "pip-services-runtime-log", "null", "*"
	);

    constructor() {
        super(NullLogger.Descriptor);
    }

    /**
     * Writes a message to the log
     * @param level a log level - Fatal, Error, Warn, Info, Debug or Trace
     * @param component a component name
     * @param correlationId a correlationId
     * @param message a message objects
     */
    public log(level: number, component: string, correlationId: string, message: any[]): void {}
}
