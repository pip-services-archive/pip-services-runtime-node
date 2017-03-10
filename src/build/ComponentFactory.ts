let _ = require('lodash');

import { UnknownError } from '../errors/UnknownError';
import { ConfigError } from '../errors/ConfigError';
import { BuildError } from '../errors/BuildError';
import { MicroserviceError } from '../errors/MicroserviceError';
import { ErrorCategory } from '../errors/ErrorCategory';
import { IComponentFactory } from '../IComponentFactory';
import { IComponent } from '../IComponent';
import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { ComponentConfig } from '../config/ComponentConfig';
import { FactoryRegistration } from './FactoryRegistration';

/**
 * Factory for microservice components. It registers component classes,
 * locates classes by descriptors and creates component instances.
 * It also supports inheritance from other factories.
 * 
 * In the future we can add an ability to dynamicaly load
 * component libraries from component config. That will allow throw
 * place into microservice container pretty much anything at deployment time.  
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
export class ComponentFactory implements IComponentFactory {
	protected _registrations: FactoryRegistration[] = [];
	protected _baseFactories: IComponentFactory[] = [];
	
	/**
	 * Creates an instance of component factory and extends it with base factories.
	 * @param baseFactories base factories to extend registrations of this factory.
	 */
	constructor(...baseFactories: IComponentFactory[]) {
		for (let i = 0; i < baseFactories.length; i++) {
			this._baseFactories.push(baseFactories[i]);
		}
	}
	
	/**
	 * Extends this factory with base factories.
	 * @param baseFactories a list of base factories to extend registrations of this factory.
	 */
	public extend(...baseFactories: IComponentFactory[]): void {
		for (let i = 0; i < baseFactories.length; i++) {
			this._baseFactories.push(baseFactories[i]);
		}
	}
	
	/**
	 * Registers a component class accompanies by component descriptor.
	 * @param descriptor a component descriptor to locate the class.
	 * @param classFactory a component class used to create a component.
	 * @return a reference to this factory to support chaining registrations.
	 */
	public register(descriptor: ComponentDescriptor, classFactory: any): IComponentFactory {
		if (descriptor == null)
			throw new Error("Descriptor cannot be null");
		if (classFactory == null)
			throw new Error("Class factory cannot be null");
		if (!_.isFunction(classFactory))
			throw new Error("Class factory is not a function");
		
        let registration = new FactoryRegistration(descriptor, classFactory);
		this._registrations.push(registration);		
		return this;
	}

	/**
	 * Lookups for component class by matching component descriptor.
	 * @param descriptor a component descriptor used to locate a class
	 * @return a located component class.
	 */
	public find(descriptor: ComponentDescriptor): () => void {
		// Try to find a match in local registrations
		for (let i = 0; i < this._registrations.length; i++) {
			let registration = this._registrations[i];
			if (registration.getDescriptor().match(descriptor))
				return registration.getClassFactory();
		}

		for (let i = 0; i < this._baseFactories.length; i++) {
			let baseFactory = this._baseFactories[i];
			let classFactory = baseFactory.find(descriptor);
			if (classFactory != null)
				return classFactory;
		}

		return null;		
	}
	
	/**
	 * Create a component instance using class located by component descriptor.
	 * @param descriptor a component descriptor to locate a component class.
	 * @return a created component instance.
	 * @throws MicroserviceError when class to construct component wasn't found, 
	 * when constructor failed or component doesn't implements required interfaces.
	 */
	public create(descriptor: ComponentDescriptor): IComponent {
        try {
            // Create a component
        	let classFactory = this.find(descriptor);

			if (classFactory == null) {
				throw new ConfigError(
					"FactoryNotFound", 
					"Factory for component " + descriptor + " was not found"
				).withDetails(descriptor);
			}

        	return new classFactory();
        } catch (ex) {
        	throw new BuildError(
    			"CreateFailed",
    			"Failed to create component " + descriptor + ": " + ex
			)
    		.withDetails(descriptor)
    		.wrap(ex);
        }
	}
	
	/**
	 * Dynamically creates an instance of configuration factory based
	 * on configuration parameters. 
	 * @param config a configuration parameters to locate the factory class.
	 * @return a created factory instance
	 * @throws MicroserviceError when creation wasn't successful.
	 */
	public static createFactory(config: ComponentConfig): IComponentFactory {
		// The code left here for future references
        // // Shortcut if class if specified as a class function
        // let className = config.get('class');
        // if (_.isFunction(className)) {
        //     return new className(config);
        // }
        
        // // Get and check component module name
        // let moduleName = config.getNullableString('module') 
        //     || config.getNullableString('library') 
        //     || config.getNullableString('assembly');
        // if (moduleName == null)
        //     throw new ConfigError('NoModule', id + ' module is not configured');

        // // Load component module
        // let classFunc = require(moduleName);

        // // Get component function
        // // The class name can have dot notation 'Module.SubModule.Class'
        // if (_.isString(className) && className != '') {
        //     let classNames = className.split('.');
        //     _.each(classNames, (className) => {
        //         if (classFunc && className != '')                
        //             classFunc = classFunc[className];
        //     });
        // }
        
        // // Check component class function
        // if (!_.isFunction(classFunc))
        //     throw new BuildError('WrongFactory', id + ' class is not correctly configured').withDetails(moduleName); 
        
        // // Create a component
        // return new classFunc(new DynamicMap(config));
        
        throw new UnknownError("NotImplemented", "Loading of custom factories it not supported yet");
	}
}
