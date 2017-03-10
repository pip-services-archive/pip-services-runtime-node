/**
 * Callback interface to complete measuring time interval.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
export interface ITiming {
	/**
	 * Completes measuring time interval and updates counter.
	 */
    endTiming();
}