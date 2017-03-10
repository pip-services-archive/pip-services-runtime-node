/**
 * Holds cached value for in-memory cache.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
export class CacheEntry {
	private _created: number;
    private _key: string;
    private _value: any;

	/**
	 * Creates instance of the cache entry.
	 * @param key the unique key used to identify and locate the value.
	 * @param value the cached value.
	 */
    constructor(key: string, value: any) {
        this._created = Date.now();
        this._key = key;
        this._value = value;
    }
    
	/**
	 * Gets the unique key to identify and locate the value.
	 * @return the value key.
	 */
	public getKey(): string { 
		return this._key; 
	}

	/**
	 * Gets the cached value.
	 * @return the currently cached value.
	 */
	public getValue(): any {
		return this._value;
	}
	
	/**
	 * Changes the cached value and updates creation time.
	 * @param value the new cached value.
	 */
	public setValue(value: any): void {
		this._value = value;
		this._created = Date.now();
	}

	/**
	 * Gets time when the cached value was stored.
	 * @return the value creation time.
	 */
	public getCreated(): number {
		return this._created;
	}
}