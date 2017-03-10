import { DynamicMap } from '../portability/DynamicMap';
import { MicroserviceError } from '../errors/MicroserviceError';
import { FileError } from '../errors/FileError';
import { ComponentConfig } from './ComponentConfig';

/**
 * Configuration for the entire microservice.
 * It can be either stored in JSON file on disk,
 * kept in remote configuration registry or hardcoded within test.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
export class MicroserviceConfig {
	private _content: DynamicMap;
	
	/**
	 * Creates an empty instance of the microservice configuration.
	 * It can be filled with data manually or loaded from the file.
	 */
	constructor(content?: DynamicMap) {
		this._content = content || new DynamicMap();
	}
	
	/**
	 * Gets the raw content of the configuration as dynamic map
	 * @return dynamic map with all microservice configuration parameters.
	 */
	public getRawContent(): DynamicMap {
		return this._content;
	}

	/**
	 * Gets configurations of components for specific section.
	 * @param category a category that defines a section within microservice configuration
	 * @return an array with components configurations
	 */
	public getSection(category: string): ComponentConfig[] {
		let configs: ComponentConfig[] = [];

		let values: any[] = this._content.getArray(category);		
		for (let i = 0; i < values.length; i++) {
            let content = DynamicMap.fromValue(values[i]);
			configs.push(new ComponentConfig(category, content));
		}		
		return configs;
	}

	/**
	 * Removes specified sections from the configuration.
	 * This method can be used to suppress certain functionality in the microservice
	 * like api services when microservice runs inside Lambda function.
	 * @param categories a list of categories / section names to be removed.
	 */
	public removeSections(...categories: string[]): void {
		for (let i = 0; i < categories.length; i++) {
			this._content.remove(categories[i]);
		}
	}
	
	/**
	 * Creates microservice configuration using free-form objects.
	 * @param value a free-form object
	 * @return constructed microservice configuration
	 */
	public static fromValue(value: any): MicroserviceConfig {
        let content: DynamicMap = DynamicMap.fromValue(value);
        return new MicroserviceConfig(content);
	}

	/**
	 * Creates instance of the microservice configuration and
	 * initializes it with hardcoded parameters.
	 * The parameters shall be specified with key/value tuples as:
	 * 'key1', value1, 'key2', value2, ... 
	 * @param tuples list of parameters with key-value tuples 
	 * @return constructed microservice configuration
	 */
	public static fromTuples(...tuples: any[]): MicroserviceConfig {
        let content: DynamicMap = new DynamicMap();
        content.setTuplesArray(tuples);
        return new MicroserviceConfig(content);
	}
    
}
