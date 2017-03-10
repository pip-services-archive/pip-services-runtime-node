/**
 * State in lifecycle of components or the entire microservice
 *  
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
export enum State {
	/**
	 * Undefined state
	 */
	Undefined = -1,
	
	/**
	 * Initial state right after creation
	 */
	Initial = 0,
	
	/**
	 * Configuration was successfully completed
	 */
	Configured = 1,
	
	/**
	 * Links between components were successfully set
	 */
	Linked = 2,
	
	/**
	 * Ready to perform operations
	 */
	Opened = 3,

	/**
	 * Ready to perform operations.
	 * This is a duplicate for Opened. 
	 */
	Ready = 3,

	/**
	 * Closed but can be reopened
	 */
	Closed = 4
}
