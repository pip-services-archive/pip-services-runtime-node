import { Category } from '../config/Category';
import { DynamicMap } from '../portability/DynamicMap';
import { State } from '../State';
import { ComponentConfig } from '../config/ComponentConfig';
import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { AbstractCache } from './AbstractCache';
import { CacheEntry } from './CacheEntry';

/**
 * Local in-memory cache that can be used in non-scaled deployments or for testing.
 * 
 * Todo: Track access time for cached entries to optimize cache shrinking logic
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-05-01
 */
export class MemoryCache extends AbstractCache {
	/**
	 * Unique descriptor for the Memory Cache component
	 */
	public static Descriptor: ComponentDescriptor = new ComponentDescriptor(
		Category.Cache, "pip-services-runtime-cache", "memory", "*"
	);

	/**
	 * Default configuration for memory cache component
	 */
	private static DefaultConfig = DynamicMap.fromTuples(
		"options.timeout", 60000, // timeout in milliseconds
		"options.max_size", 1000 // maximum number of elements in cache
	); 

    private _cache: any = {};
    private _count: number = 0;
    private _timeout: number;
    private _maxSize: number;
    
	/**
	 * Creates instance of local in-memory cache component
	 */
    constructor() {
        super(MemoryCache.Descriptor);
    }

	/**
	 * Sets component configuration parameters and switches component
	 * to 'Configured' state. The configuration is only allowed once
	 * right after creation. Attempts to perform reconfiguration will 
	 * cause an exception.
	 * @param config the component configuration parameters.
	 * @throws MicroserviceError when component is in illegal state 
	 * or configuration validation fails. 
	 */
	public configure(config: ComponentConfig) {
		this.checkNewStateAllowed(State.Configured);
		
		super.configure(config.withDefaults(MemoryCache.DefaultConfig));

		this._timeout = config.getOptions().getLong("timeout");
		this._maxSize = config.getOptions().getInteger("max_size");
	}

	/**
	 * Cleans up cache from obsolete values and shrinks the cache
	 * to fit into allowed max size by dropping values that were not
	 * accessed for a long time
	 */
    private cleanup(): void {
        let oldest: CacheEntry = null;
        let now: number = Date.now();
        this._count = 0;
        
        // Cleanup obsolete entries and find the oldest
        for (var prop in this._cache) {
            if (this._cache.hasOwnProperty(prop)) {
                let entry: CacheEntry = <CacheEntry>this._cache[prop];
                // Remove obsolete entry
                if (this._timeout > 0 && (now - entry.getCreated()) > this._timeout) {
                    delete this._cache[prop];
                }
                // Count the remaining entry 
                else {
                    this._count++;
                    if (oldest == null || oldest.getCreated() > entry.getCreated())
                        oldest = entry;
                }
            }
        }
        
        // Remove the oldest if cache size exceeded maximum
        if (this._count > this._maxSize && oldest != null) {
            delete this._cache[oldest.getKey()];
            this._count--;
        }
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
        // Get entry from the cache
        let entry: CacheEntry = <CacheEntry>this._cache[key];
        
        // Cache has nothing
        if (entry == null) {
            callback(null, null);
            return;
        }
        
        // Remove entry if expiration set and entry is expired
        if (this._timeout > 0 && (Date.now() - entry.getCreated()) > this._timeout) {
            delete this._cache[key];
            this._count--;
            callback(null, null);
            return;
        }
                
        callback(null, entry.getValue());
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
        // Get the entry
        let entry: CacheEntry = <CacheEntry>this._cache[key];

        // Shortcut to remove entry from the cache
        if (value == null) {
            if (entry != null) {
                delete this._cache[key];
                this._count--;
            }
            if (callback) callback(null, value);
            return;        
        }
        
        // Update the entry
        if (entry) {
            entry.setValue(value);
        }
        // Or create a new entry 
        else {
            entry = new CacheEntry(key, value);
            this._cache[key] = entry;
            this._count++;
        }

        // Clean up the cache
        if (this._maxSize > 0 && this._count > this._maxSize)
            this.cleanup();
        
        if (callback) callback(null, value);        
    }
    
	/**
	 * Removes value stored in the cache.
	 * @param key a unique key to locate value in the cache.
	 * @param callback a callback function to be called
	 * with error or success
	 */
    public remove(key: string, callback: (err: any) => void): void {
        // Get the entry
        let entry: CacheEntry = <CacheEntry>this._cache[key];

        // Remove entry from the cache
        if (entry != null) {
            delete this._cache[key];
            this._count--;
        }
        if (callback) callback(null);
    }
}
