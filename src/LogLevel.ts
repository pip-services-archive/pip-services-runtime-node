/**
 * Logging levels to determine details of logged messages
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-05-01
 */
export enum LogLevel {
	/**
	 * Nothing to be logged
	 */
    None = 0,
    
    /**
     * Logs only fatal errors that cause microservice to fail
     */
    Fatal = 1,
    
    /**
     * Logs all errors - fatal or recoverable
     */
    Error = 2,
    
    /**
     * Logs errors and warnings
     */
    Warn = 3,
    
    /**
     * Logs errors and important information messages
     */
    Info = 4,
    
    /**
     * Logs everything up to high-level debugging information
     */
    Debug = 5,
    
    /**
     * Logs everything down to fine-granular debugging messages
     */
    Trace = 6
}
