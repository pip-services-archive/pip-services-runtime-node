import { UnknownError } from './errors/UnknownError';
import { ConfigError } from './errors/ConfigError';
import { Category } from './config/Category';
import { IComponent } from './IComponent';
import { ComponentDescriptor } from './config/ComponentDescriptor';

/**
 * A list with references to all microservice components.
 * It is capable of searching and retrieving components
 * by specified criteria.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
export class ComponentSet {
	private _components: IComponent[] = [];
	
	/**
	 * Creates a component list and fills it with hardcoded component references.
	 * This constructor is typically used in testing.
	 * @param components a hardcoded list of complnents to add to this list.
	 */
	constructor(components?: IComponent[]) {
		if (components != null)
        	this.addAll(components);
	}

	/**
	 * Adds a single component to the list
	 * @param component a component to be added to the list
	 */
	public add(component: IComponent): void {
		this._components.push(component);
	}

	/**
	 * Adds multiple components to the list
	 * @param components a list of components to be added.
	 */
	public addAll(components: IComponent[]): void {
		this._components = this._components.concat(components);
	}
	
	/**
	 * Internal utility method to fill a list with components from a specific category.
	 * @param components a component list where found components shall be added
	 * @param category a category to pick components.
	 * @return a reference to the component list for chaining.
	 */
	private addByCategory(components: IComponent[], category: string): IComponent[] {
		for (let i = 0; i < this._components.length; i++) {
            let component = this._components[i];
			if (component.getDescriptor().getCategory() == category)
				components.push(component);
		}
		return components;
	}

	/**
	 * Gets a sublist of component references from specific category.
	 * @param category a category to pick components.
	 * @return a list of found components
	 */
	public getAllByCategory(category: string): IComponent[] {
		return this.addByCategory([], category);
	}

	/**
	 * Get a list of components in random order.
	 * Since it doesn't perform additional calculations
	 * this operation is faster then getting ordered list. 
	 * @return an unsorted list of components.
	 */
	public getAllUnordered(): IComponent[] {
		return this._components;
	}

	/**
	 * Gets a list with all component references sorted in strict 
	 * initialization order: Discovery, Logs, Counters, Cache, Persistence, Controller, ...
	 * This sorting order it require to lifecycle management to proper sequencing. 
	 * @return a sorted list of components
	 */
	public getAllOrdered(): IComponent[] {
		let result: IComponent[] = [];
		this.addByCategory(result, Category.Discovery);
		this.addByCategory(result, Category.Boot);
		this.addByCategory(result, Category.Logs);
		this.addByCategory(result, Category.Counters);
		this.addByCategory(result, Category.Cache);
		this.addByCategory(result, Category.Persistence);
		this.addByCategory(result, Category.Clients);
		this.addByCategory(result, Category.Controllers);
		this.addByCategory(result, Category.Decorators);
		this.addByCategory(result, Category.Services);
		this.addByCategory(result, Category.Addons);
		return result;
	}

	/**
	 * Finds all components that match specified descriptor.
	 * The descriptor is used to specify number of search criteria
	 * or their combinations:
	 * <ul>
	 * <li> By category
	 * <li> By logical group
	 * <li> By functional type
	 * <li> By implementation version
	 * </ul>
	 * @param descriptor a component descriptor as a search criteria
	 * @return a list with found components
	 */
	public getAllOptional(descriptor: ComponentDescriptor): IComponent[] {
		if (descriptor == null)
			throw new Error("Descriptor is not set");

		let result: IComponent[] = [];
		// Search from the end to account for decorators
		for (let i = this._components.length - 1; i >= 0; i--) {
			let component = this._components[i];
			if (component.getDescriptor().match(descriptor))
				result.push(component);
		}
		return result;
	}

	/**
	 * Finds the a single component instance (the first one)
	 * that matches to the specified descriptor. 
	 * The descriptor is used to specify number of search criteria
	 * or their combinations:
	 * <ul>
	 * <li> By category
	 * <li> By logical group
	 * <li> By functional type
	 * <li> By implementation version
	 * </ul>
	 * @param descriptor a component descriptor as a search criteria
	 * @return a found component instance or <b>null</b> if nothing was found.
	 */
	public getOneOptional(descriptor: ComponentDescriptor): IComponent {
		if (descriptor == null)
			throw new Error("Descriptor is not set");

		// Search from the end to account for decorators
		for (let i = this._components.length - 1; i >= 0; i--) {
			let component = this._components[i];
			if (component.getDescriptor().match(descriptor))
				return component;
		}
		return null;
	}
	
	/**
	 * Gets all components that match specified descriptor.
	 * If no components found it throws a configuration error.
	 * The descriptor is used to specify number of search criteria
	 * or their combinations:
	 * <ul>
	 * <li> By category
	 * <li> By logical group
	 * <li> By functional type
	 * <li> By implementation version
	 * </ul>
	 * @param descriptor a component descriptor as a search criteria
	 * @return a list with found components
	 * @throws MicroserviceError when no components found
	 */
	public getAllRequired(descriptor: ComponentDescriptor): IComponent[] {
		if (descriptor == null)
			throw new Error("Descriptor is not set");

		let result = this.getAllOptional(descriptor);
		if (result.length == 0) {
			throw new ConfigError(
				"NoDependency", 
				"At least one component " + descriptor + " must be present to satisfy dependencies"
			).withDetails(descriptor);
		}
		return result;
	}

	/**
	 * Gets a component instance that matches the specified descriptor.
	 * If nothing is found it throws a configuration error.
	 * The descriptor is used to specify number of search criteria
	 * or their combinations:
	 * <ul>
	 * <li> By category
	 * <li> By logical group
	 * <li> By functional type
	 * <li> By implementation version
	 * </ul>
	 * @param descriptor a component descriptor as a search criteria
	 * @return a found component instance
	 * @throws MicroserviceError when no components found
	 */
	public getOneRequired(descriptor: ComponentDescriptor): IComponent {
		if (descriptor == null)
			throw new Error("Descriptor is not set");

		let result = this.getOneOptional(descriptor);
		if (result == null) {
			throw new ConfigError(
				"NoDependency", 
				"Component " + descriptor + " must be present to satisfy dependencies"
			).withDetails(descriptor);
		}
		return result;
	}

	/**
	 * Gets a component instance that matches the specified descriptor defined
	 * <b>before</b> specified instance. If nothing is found it throws a configuration error.
	 * This method is used primarily to find dependencies between business logic components
	 * in their logical chain. The sequence goes in order as components were configured. 
	 * The descriptor is used to specify number of search criteria
	 * or their combinations:
	 * <ul>
	 * <li> By category
	 * <li> By logical group
	 * <li> By functional type
	 * <li> By implementation version
	 * </ul>
	 * For instance, quite often the descriptor will look as "logic / group / * / *"
	 * @param component a component that searches for prior dependencies
	 * @param descriptor a component descriptor as a search criteria
	 * @return a found component instance
	 * @throws MicroserviceError when no components found
	 */
	public getOnePrior(component: IComponent, descriptor: ComponentDescriptor): IComponent {
		if (descriptor == null)
			throw new Error("Descriptor is not set");

		let index = this._components.indexOf(component);
		if (index < 0) {
			throw new UnknownError(
				"ComponentNotFound", 
				"Current component " + component + " was not found in the component list"
			);
		}
		
		// Search down from the current component
		for (let i = index - 1; i >= 0; i--) {
			let thisComponent = this._components[i];
			if (thisComponent.getDescriptor().match(descriptor))
				return thisComponent;
		}

		// Throw exception if nothing was found
		throw new ConfigError(
			"NoDependency", 
			"Compoment " + descriptor + " must present to satisfy dependencies"
		).withDetails(descriptor);
	}

	/**
	 * Creates a component list from components passed as params
	 * @param components a list of components
	 */
	public static fromComponents(...components: IComponent[]): ComponentSet {
		let list = new ComponentSet();
		list.addAll(components);
		return list;
	}

}
