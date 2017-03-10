import { DynamicMap } from '../portability/DynamicMap';

/**
 * Database connection configuration as set in the component config.
 * It usually contains a complete uri or separate host, port, user, password, etc.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-19
 */
export class Connection {
	private _content: DynamicMap;

	/**
	 * Create an instance of database connection with free-form configuration map.
	 * @param content a map with the database connection parameters. 
	 */
	constructor(content?: DynamicMap) {
		this._content = content || new DynamicMap();
	}

	/**
	 * Gets connection as free-form configuration set.
	 * @return a free-form map with connection configuration.
	 */
	public getRawContent(): DynamicMap {
		return this._content;
	}
	
	/**
	 * Gets the connection type
	 * @return the connection type
	 */
	public getType(): string {
		return this._content.getNullableString("type");
	}

	/**
	 * Gets the connection host name or ip address.
	 * @return a string representing service host 
	 */
	public getHost(): string {
		return this._content.getNullableString("host");
	}

	/**
	 * Gets the connection port number
	 * @return integer representing the service port.
	 */
	public getPort(): number {
		return this._content.getInteger("port");
	}

	/**
	 * Gets the database name
	 * @return the database name
	 */
	public getDatabase(): string {
		return this._content.getNullableString("database");
	}

	/**
	 * Gets the connection user name.
	 * @return the user name 
	 */
	public getUsername(): string {
		return this._content.getNullableString("username");
	}

	/**
	 * Gets the connection user password.
	 * @return the user password 
	 */
	public getPassword(): string {
		return this._content.getNullableString("password");
	}

	/**
	 * Gets the endpoint uri constracted from type, host and port
	 * @return uri as <type>://<host | ip>:<port>
	 */
	public getUri(): string {
		return this.getType() + "://" + this.getHost() + ":" + this.getPort();
	}
}
