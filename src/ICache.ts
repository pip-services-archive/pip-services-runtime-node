import { IComponent } from './IComponent';

/**
 * Transient cache which is used to bypass persistence 
 * to increase overall system performance. 
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-05-01
 */
export interface ICache extends IComponent {
	/**
	 * Retrieves a value from the cache by unique key.
	 * It is recommended to use either string GUIDs like '123456789abc'
	 * or unique natural keys prefixed with the functional group
	 * like 'pip-services-storage:block-123'. 
	 * @param key a unique key to locate value in the cache
	 * @param callback a callback function to be called 
	 * with error or retrieved value. It returns <b>null</b> 
	 * when value was not found
	 */
    retrieve(key: string, callback: (err: any, value: any) => void): void;

	/**
	 * Stores value identified by unique key in the cache. 
	 * Stale timeout is configured in the component options. 
	 * @param key a unique key to locate value in the cache.
	 * @param value a value to store.
	 * @param callback a callback function to be called with error
	 * or stored value
	 */
    store(key: string, value: any, callback: (err: any, value: any) => void): void;

	/**
	 * Removes value stored in the cache.
	 * @param key a unique key to locate value in the cache.
	 * @param callback a callback function to be called
	 * with error or success
	 */
    remove(key: string, callback: (err: any) => void): void;
}
