import { Category } from '../config/Category';
import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { AbstractCache } from './AbstractCache';

/**
 * Null cache component that doesn't do caching at all.
 * It's mainly used in testing. However, it can be temporary
 * used to disable cache to troubleshoot problems or study
 * effect of caching on overall system performance. 
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-05-01
 */
export class NullCache extends AbstractCache {
	/**
	 * Unique descriptor for the Memory Cache component
	 */
	public static Descriptor: ComponentDescriptor = new ComponentDescriptor(
		Category.Cache, "pip-services-runtime-cache", "null", "*"
	);

	/**
	 * Creates instance of null cache component.
	 */
    constructor() {
        super(NullCache.Descriptor);
    }
    
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
    public retrieve(key: string, callback: (err: any, value: any) => void): void {
        callback(null, null);
    }
    
	/**
	 * Stores value identified by unique key in the cache. 
	 * Stale timeout is configured in the component options. 
	 * @param key a unique key to locate value in the cache.
	 * @param value a value to store.
	 * @param callback a callback function to be called with error
	 * or stored value
	 */
    public store(key: string, value: any, callback: (err: any, value: any) => void): void {
        if (callback) callback(null, value);        
    }
    
	/**
	 * Removes value stored in the cache.
	 * @param key a unique key to locate value in the cache.
	 * @param callback a callback function to be called
	 * with error or success
	 */
    public remove(key: string, callback: (err: any) => void): void {
        if (callback) callback(null);
    }
}
