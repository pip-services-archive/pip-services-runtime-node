/**
 * Defines broad categories of microservice errors.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
export class ErrorCategory {
	/**
	 * Errors caused by programming or unexpected errors
	 */
	public static UnknownError: string = "UnknownError";

	/**
	 * Errors happened during microservice build process
	 * and caused by problems in component factories
	 */
	public static BuildError: string = "BuildError";

	/**
	 * Errors related to mistakes in microservice 
	 * user-defined configuration
	 */
	public static ConfigError: string = "ConfigError";

	/**
	 * Errors related to operations called in wrong component state.
	 * For instance, business calls when component is not ready
	 */
	public static StateError: string = "StateError";

	/**
	 * Errors happened during connection to remote services.
	 * They can be related to misconfiguration, network issues
	 * or remote service itself 
	 */
	public static ConnectionError: string = "ConnectionError";

    /**
     * Errors returned by remote services or network
     * during call attempts
     */
	public static CallError: string = "CallError";

	/**
	 * Errors in read/write file operations
	 */
	public static FileError: string = "FileError";

	/**
	 * Errors due to improper user requests, like
	 * missing or wrong parameters 
	 */
	public static BadRequest: string = "BadRequest";

	/**
	 * Access errors caused by missing user identity
	 * or security permissions
	 */
	public static Unauthorized: string = "Unauthorized";

    /**
     * Error caused by attempt to access missing object
     */
	public static NotFound: string = "NotFound";

	/**
	 * Errors raised by conflict in object versions
	 * posted by user and stored on server.
	 */
	public static Conflict: string = "Conflict";	

	/**
	 * Errors caused by calls to unsupported 
	 * or not yet implemented functionality
	 */
	public static Unsupported: string = "Unsupported";
}
