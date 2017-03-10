import { Category } from '../config/Category';
import { IComponent } from '../IComponent';
import { ILogger } from '../ILogger';
import { LogLevel } from '../LogLevel';
import { LogFormatter } from '../logs/LogFormatter';

/**
 * Utility logger to write messages to configured logs 
 * or to console when no logs are found. 
 * This logger is used in the microservice build/run process 
 *  
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
export class LogWriter {
    /**
     * Writes a message to the all logs
     * @param components a list of microservice components to choose logs from
     * @param level a log level - Fatal, Error, Warn, Info, Debug or Trace
     * @param component a component name
     * @param correlationId a correlationId
     * @param message a message objects
     */
    public static log(components: IComponent[], level: number, component: string, correlationId: string, message: any[]): void {
        let logged = false;

        // Output to all loggers
        if (components != null && components.length > 0) {
            for (let i = 0; i < components.length; i++) {
                let cref = components[i];
                if (Category.Logs == cref.getDescriptor().getCategory()) {
                    let logger = <ILogger>cref;
                    logger.log(level, component, correlationId, message);
                    logged = true;
                }
            }
        }

        // If nothing was logged then write to console
        if (logged == false) {
            let output: string = LogFormatter.format(level, message);
            if (correlationId != null)
                output += ", correlated to " + correlationId;

            if (level >= LogLevel.Fatal && level <= LogLevel.Warn)
                console.error(output);
            else console.log(output);
        }
    }
	
    public static fatal(components: IComponent[], ...message: any[]): void {
        this.log(components, LogLevel.Fatal, null, null, message);
    }

    public static error(components: IComponent[], ...message: any[]): void {
        this.log(components, LogLevel.Error, null, null, message);
    }

    public static warn(components: IComponent[], ...message: any[]): void {
        this.log(components, LogLevel.Warn, null, null, message);
    }

    public static info(components: IComponent[], ...message: any[]): void {
        this.log(components, LogLevel.Info, null, null, message);
    }

    public static debug(components: IComponent[], ...message: any[]): void {
        this.log(components, LogLevel.Debug, null, null, message);
    }

    public static trace(components: IComponent[], ...message: any[]): void {
        this.log(components, LogLevel.Trace, null, null, message);
    }
	
}
