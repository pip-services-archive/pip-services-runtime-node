/**
 * Category of components or configuration sections that are used to configure components.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
export class Category {
	/**
	 * Undefined category
	 */
	public static Undefined: string = "undefined";
	
	/**
	 * Component factories
	 */
	public static Factories: string = "factories";
	
	/**
	 * Service discovery components
	 */
	public static Discovery: string = "discovery";
	
	/**
	 * Bootstap configuration readers
	 */
	public static Boot: string = "boot";
	
	/**
	 * Logging components
	 */
	public static Logs: string = "logs";
	
	/**
	 * Performance counters
	 */
	public static Counters: string = "counters";
	
	/**
	 * Value caches
	 */
	public static Cache: string = "cache";
	
	/**
	 * Persistence components
	 */
	public static Persistence: string = "persistence";
	
	/**
	 * Clients to other microservices or infrastructure services
	 */
	public static Clients: string = "clients";
	
	/**
	 * Any business logic component - controller or decorator
	 */
	public static BusinessLogic: string = "logic";

	/**
	 * Business logic controllers
	 */
	public static Controllers: string = "controllers";
	
	/**
	 * Decorators to business logic controllers
	 */
	public static Decorators: string = "decorators";
	
	/**
	 * API services
	 */
	public static Services: string = "services";
	
	/**
	 * Various microservice addons / extension components
	 */
	public static Addons: string = "addons";
}
