import { DynamicMap } from '../portability/DynamicMap';

/**
 * Service address as set in component configuration or
 * retrieved by discovery service. It contains service protocol,
 * host, port number, timeouts and additional configuration parameters.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
export class Endpoint {
	private _content: DynamicMap;

	/**
	 * Create an instance of service address with free-form configuration map.
	 * @param content a map with the address configuration parameters. 
	 */
	constructor(content?: DynamicMap) {
		this._content = content || new DynamicMap();
	}

	/**
	 * Gets endpoint as free-form configuration set.
	 * @return a free-form map with address configuration.
	 */
	public getRawContent(): DynamicMap {
		return this._content;
	}
	
	/**
	 * Checks if discovery registration or resolution shall be performed.
	 * The discovery is requested when 'discover' parameter contains 
	 * a non-empty string that represents the discovery name.
	 * @return <b>true</b> if the address shall be handled by discovery 
	 * and <b>false</b> when all address parameters are defined statically.
	 */
	public useDiscovery(): boolean {
		return this._content.has("discover") || this._content.has("discovery");
	}
	
	/**
	 * Gets a name under which the address shall be registered or resolved
	 * by discovery service. 
	 * @return a name to register or resolve the address
	 */
	public getDiscoveryName(): string {
		let discover: string = this._content.getNullableString("discover");
		discover = discover || this._content.getNullableString("discovery");
		return discover;
	}
	
	/**
	 * Gets the endpoint protocol
	 * @return the endpoint protocol
	 */
	public getProtocol(): string {
		return this._content.getNullableString("protocol");
	}

	/**
	 * Gets the service host name or ip address.
	 * @return a string representing service host 
	 */
	public getHost(): string {
		return this._content.getNullableString("host");
	}

	/**
	 * Gets the service port number
	 * @return integer representing the service port.
	 */
	public getPort(): number {
		return this._content.getNullableInteger("port");
	}

	/**
	 * Gets the service user name.
	 * @return the user name 
	 */
	public getUsername(): string {
		return this._content.getNullableString("username");
	}

	/**
	 * Gets the service user password.
	 * @return the user password 
	 */
	public getPassword(): string {
		return this._content.getNullableString("password");
	}

	/**
	 * Gets the endpoint uri constracted from protocol, host and port
	 * @return uri as <protocol>://<host | ip>:<port>
	 */
	public getUri(): string {
		return this.getProtocol() + "://" + this.getHost() + ":" + this.getPort()
	}
}
