import { IComponent } from './IComponent';
import { MicroserviceConfig } from './config/MicroserviceConfig';

/**
 * Interface for microservice component responsible for
 * reading bootstrap microservice configuration.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-05-01
 */
export interface IBootConfig extends IComponent {
	/**
	 * Reads microservice configuration from the source
	 * @param callback a callback to be called with error
     * or retrieved microservice configuration
	 */
    readConfig(callback: (err: any, config: MicroserviceConfig) => void): void;
}
