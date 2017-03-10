let fs = require('fs');

import { Category } from '../config/Category';
import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { State } from '../State';
import { ComponentConfig } from '../config/ComponentConfig';
import { AbstractBootConfig } from './AbstractBootConfig';
import { ConfigError } from '../errors/ConfigError';
import { FileError } from '../errors/FileError';
import { MicroserviceConfig } from '../config/MicroserviceConfig';
import { ConfigReader } from '../config/ConfigReader';

/**
 * Boot configuration reader that gets microservice configuration from
 * JSON file on local disk. 
 * 
 * This is the simplest possible configuration.
 * However, in large scale deployments it may be unpractical. 
 * The distrubuting configurations from a centralized configuration 
 * repository may be a better option. Check other types of readers
 * to support those scenarios.
 * 
 * @author Sergey Seroukhov
 * @version 1.1
 * @since 2016-06-19
 */
export class FileBootConfig extends AbstractBootConfig {
	/**
	 * Unique descriptor for the FileBootConfig component
	 */
	public static Descriptor: ComponentDescriptor = new ComponentDescriptor(
		Category.Boot, "pip-services-runtime-boot", "file", "*"
	);

    private _path: string;

	/**
	 * Creates an instance of file configuration reader component.
	 */
    constructor() {
        super(FileBootConfig.Descriptor);
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
	public configure(config: ComponentConfig): void {
		this.checkNewStateAllowed(State.Configured);
		
		let options = config.getOptions(); 
        if (options == null || options.hasNot("path"))
            throw new ConfigError(this, "NoPath", "Missing config file path");
		
        super.configure(config);

        this._path = options.getString("path")
	}
    
	/**
	 * Opens the component, performs initialization, opens connections
	 * to external services and makes the component ready for operations.
	 * Opening can be done multiple times: right after linking 
	 * or reopening after closure.
	 * @param callback a callback to report success or error in opening  
	 */
    public open(callback: (err: any) => void): void { 
		this.checkNewStateAllowed(State.Opened);

        fs.exists(this._path, (exists) => {
            if (!exists) {
                callback(new FileError(
                    this, 
                    'FileNotFound', 
                    'Config file was not found at ' + this._path
                ).withDetails(this._path));
            } else super.open(callback);
        });  
    }        
                
	/**
	 * Reads microservice configuration from the source
	 * @param callback a callback to be called with error
     * or retrieved microservice configuration
	 */
    public readConfig(callback: (err: any, config: MicroserviceConfig) => void): void {
		let config = ConfigReader.read(this._path);
        callback(null, config);
    }       
}
