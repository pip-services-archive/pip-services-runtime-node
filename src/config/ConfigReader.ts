let fs = require('fs');
let path = require('path');
let yaml = require('js-yaml');

import { MicroserviceConfig } from './MicroserviceConfig';
import { DynamicMap } from '../portability/DynamicMap';
import { MicroserviceError } from '../errors/MicroserviceError';
import { FileError } from '../errors/FileError';
import { UnsupportedError } from '../errors/UnsupportedError';

/**
 * Configuration reader capable of reading various formats:
 * JavaScript, JSON, YAML, XML, etc.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-27
 */
export class ConfigReader {
	/**
	 * Reads configuration from a file.
     * The file type is automatically determined by its extension
	 * @param filePath a path to configuration file.
	 * @return MicroserviceConfig with file content
	 * @throws MicroserviceError when reading fails.
	 */
    public static read(filePath: string): MicroserviceConfig {
        // Check if config file is present
        if (!fs.existsSync(filePath)) {
            throw new FileError('FileNotFound', 'Config file was not found at ' + filePath);
        }         

        let ext = path.extname(filePath).toLowerCase();

        if (ext == '.js') 
            return ConfigReader.readJavascript(filePath);
        else if (ext == '.json')
            return ConfigReader.readJson(filePath);
        else if (ext == '.yaml')
            return ConfigReader.readYaml(filePath);

        // By default read as JSON
        return ConfigReader.readJson(filePath);
    }

	/**
	 * Reads configuration from JSON file.
	 * @param filePath a path to configuration file.
	 * @return MicroserviceConfig with file content
	 * @throws MicroserviceError when reading fails.
	 */
    public static readJson(filePath: string): MicroserviceConfig {
        // Check if config file is present
        if (!fs.existsSync(filePath)) {
            throw new FileError('FileNotFound', 'Config file was not found at ' + filePath);
        }         

        try {
            let text = fs.readFileSync(filePath, 'utf8');
            let content = JSON.parse(text);
            return MicroserviceConfig.fromValue(content);
        }
        catch (ex) {            
            throw new FileError(
				'ReadFailed', 
				'Failed reading configuration from ' + filePath + ': ' + ex
			)
			.withDetails(filePath)
			.wrap(ex);
        }
    }

	/**
	 * Reads configuration from JavaScript file.
	 * @param filePath a path to configuration file.
	 * @return MicroserviceConfig with file content
	 * @throws MicroserviceError when reading fails.
	 */
    public static readJavascript(filePath: string): MicroserviceConfig {
        // Check if config file is present
        if (!fs.existsSync(filePath)) {
            throw new FileError('FileNotFound', 'Config file was not found at ' + filePath);
        }         

        try {
            let content = require(filePath);
            return MicroserviceConfig.fromValue(content);
        }
        catch (ex) {            
            throw new FileError(
				'ReadFailed', 
				'Failed reading configuration from ' + filePath + ': ' + ex
			)
			.withDetails(filePath)
			.wrap(ex);
        }
    }

	/**
	 * Reads configuration from YAML file.
	 * @param filePath a path to configuration file.
	 * @return MicroserviceConfig with file content
	 * @throws MicroserviceError when reading fails.
	 */
    public static readYaml(filePath: string): MicroserviceConfig {
        // Check if config file is present
        if (!fs.existsSync(filePath)) {
            throw new FileError('FileNotFound', 'Config file was not found at ' + filePath);
        }         

        try {
            let text = fs.readFileSync(filePath, 'utf8');
            let content = yaml.load(text);
            return MicroserviceConfig.fromValue(content);
        }
        catch (ex) {            
            throw new FileError(
				'ReadFailed', 
				'Failed reading configuration from ' + filePath + ': ' + ex
			)
			.withDetails(filePath)
			.wrap(ex);
        }
    }
    
}
