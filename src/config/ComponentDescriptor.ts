import { Category } from './Category';

/**
 * Component descriptor used to identify the component by descriptive elements:
 * <ul>
 * <li> logical group: typically microservice with or without transaction subgroup 'pip-services-storage:blocks'
 * <li> component category: 'controller', 'services' or 'cache'
 * <li> functional type: 'memory', 'file' or 'mongodb', ...
 * <li> compatibility version: '1.0', '1.5' or '10.4'
 * </ul>
 * 
 * The descriptor also checks matching to another descriptor for component search.
 * '*' or null mean that element shall match to any value. 
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
export class ComponentDescriptor {
	private _category: string;
	private _group: string;
	private _type: string;
	private _version: string;
	
	/**
	 * Creates instance of a component descriptor
	 * @param category - component category: 'cache', 'services' or 'controllers' 
	 * @param group - logical group: 'pip-services-runtime', 'pip-services-logging'
	 * @param type - functional type: 'memory', 'file' or 'memcached' 
	 * @param version - compatibility version: '1.0'. '1.5' or '10.4'
	 */
	constructor(category: string, group: string, type: string, version: string) {
		if ("*" == category) category = null;		
		if ("*" == group) group = null;
		if ("*" == type) type = null;
		if ("*" == version) version = null;
		
		this._category = category;
		this._group = group;
		this._type = type;
		this._version = version;
	}

	/**
	 * Gets the component category
	 * @return the component category
	 */
	public getCategory(): string { 
        return this._category; 
    }
	
	/**
	 * Gets the logical group
	 * @return the logical group
	 */
	public getGroup(): string { 
        return this._group; 
    }
	
	/**
	 * Gets the functional type
	 * @return the functional type
	 */
	public getType(): string { 
        return this._type; 
    }
	
	/**
	 * Gets the compatibility version
	 * @return the compatibility version
	 */
	public getVersion(): string { 
        return this._version; 
    }
	
	/**
	 * Matches this descriptor to another descriptor.
	 * All '*' or null descriptor elements match to any other value.
	 * Specific values must match exactly.
	 * 
	 * @param descriptor - another descriptor to match this one.
	 * @return <b>true</b> if descriptors match or <b>false</b> otherwise. 
	 */
	public match(descriptor: ComponentDescriptor): boolean {
		if (this._category != null && descriptor.getCategory() != null) {
			// Special processing if this category is business logic
			if (this._category == Category.BusinessLogic) {
				if (descriptor.getCategory() != Category.Controllers
					&& descriptor.getCategory() != Category.Decorators
					&& descriptor.getCategory() != Category.BusinessLogic)
					return false;
			}			
			// Special processing is descriptor category is business logic
			else if (descriptor.getCategory() == Category.BusinessLogic) {
				if (this._category != Category.Controllers
					&& this._category != Category.Decorators
					&& this._category != Category.BusinessLogic)
					return false;
			}
			// Matching categories
			else if (this._category != descriptor.getCategory()) {
				return false;
			}
		}

		// Matching groups
		if (this._group != null && descriptor.getGroup() != null 
			&& this._group != descriptor.getGroup()) {
			return false;
		}

		// Matching types
		if (this._type != null && descriptor.getType() != null 
			&& this._type != descriptor.getType()) {
			return false;
		}

		// Matching versions
		if (this._version != null && descriptor.getVersion() != null 
			&& this._version != descriptor.getVersion()) {
			return false;
		}
		
		// All checks are passed...
		return true;
	}
	
	public toString(): string {
		return (this._category || "*")
			+ ":" + (this._group || "*")
			+ ":" + (this._type || "*")
			+ ":" + (this._version || "*");
	}
}
