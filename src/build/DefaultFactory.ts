import { ComponentFactory } from './ComponentFactory';
import { NullLogger } from '../logs/NullLogger';
import { ConsoleLogger } from '../logs/ConsoleLogger';
import { NullCounters } from '../counters/NullCounters';
import { LogCounters } from '../counters/LogCounters';
import { NullCache } from '../cache/NullCache';
import { MemoryCache } from '../cache/MemoryCache';
import { MemcachedCache } from '../cache/MemcachedCache';
import { FileBootConfig } from '../boot/FileBootConfig';
import { SenecaAddon } from '../addons/SenecaAddon';

/**
 * Component factory that contains registrations of standard runtime components.
 * This factory is typically used as a base for microservice factories.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
export class DefaultFactory extends ComponentFactory {
	/**
	 * The instance of default factory
	 */
	public static Instance: DefaultFactory = new DefaultFactory();
	
	/**
	 * Creates an instance of default factory with standard runtime components 
	 */
	constructor() {
		super();

		this.register(NullLogger.Descriptor, NullLogger);
		this.register(ConsoleLogger.Descriptor, ConsoleLogger);
		this.register(NullCounters.Descriptor, NullCounters);
		this.register(LogCounters.Descriptor, LogCounters);
		this.register(NullCache.Descriptor, NullCache);
		this.register(MemoryCache.Descriptor, MemoryCache);
		this.register(FileBootConfig.Descriptor, FileBootConfig);
		this.register(SenecaAddon.Descriptor, SenecaAddon);
	}
}
