let _ = require('lodash');

import { Category } from '../config/Category';
import { IComponent } from '../IComponent';
import { IComponentFactory } from '../IComponentFactory';
import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { ComponentConfig } from '../config/ComponentConfig';
import { MicroserviceConfig } from '../config/MicroserviceConfig';
import { ComponentSet } from '../ComponentSet';

/**
 * Builds microservice components using configuration as a build recipe.
 * 
 * @author Sergey Seroukhov
 * @version 2.0
 * @since 2016-09-10
 */
export class Builder {
	/**
	 * Builds default components for specified configuration section.
	 * @param factory a component factory that creates component instances.
	 * @param category a name of the section inside configuration.
	 * @param components a list with section components
	 * @return a list with section components for chaining
	 * @throws MicroserviceError when creation or configuration of components fails.
	 */
	private static buildSectionDefaults(factory: IComponentFactory, category: string, components: IComponent[]) {
		// Add null discovery by default
		if (category == Category.Discovery && components.length == 0) {
            // Todo: complete implementation
		} 
		// Add null log by default
		else if (category == Category.Logs && components.length == 0) {
			let log = factory.create(new ComponentDescriptor(Category.Logs, null, "null", null));
			log.configure(new ComponentConfig());
			components.push(log);
		}
		// Add null counters by default
		else if (category == Category.Counters && components.length == 0) {
			let counters = factory.create(new ComponentDescriptor(Category.Counters, null, "null", null));
			counters.configure(new ComponentConfig());
			components.push(counters);
		}
		// Add null cache by default
		else if (category == Category.Cache && components.length == 0) {
			let cache = factory.create(new ComponentDescriptor(Category.Cache, null, "null", null));
			cache.configure(new ComponentConfig());
			components.push(cache);
		}
		return components;
	}

	/**
	 * Builds components from specific configuration section.
	 * @param factory a component factory that creates component instances.
	 * @param config a microservice configuration
	 * @param category a name of the section inside configuration.
	 * @return a list with created components
	 * @throws MicroserviceError when creation or configuration of components fails.
	 */
	public static buildSection(factory: IComponentFactory, config: MicroserviceConfig, category: string): IComponent[] {		
		let components: IComponent[] = [];
		
		// Get specified configuration section
		let componentConfigs = config.getSection(category);
		
	    // Go through configured components one by one
		for (let i = 0; i < componentConfigs.length; i++) {
            let componentConfig = componentConfigs[i];

			// Create component using component config
			let descriptor = componentConfig.getDescriptor();
			let component = factory.create(descriptor);

			// Configure the created component
			component.configure(componentConfig);
			components.push(component);
		}
		
		// Add default components and return the result
		return this.buildSectionDefaults(factory, category, components);
    }
	
	/**
	 * Build seneca addon to provide global seneca reference
	 * @param factory a component factory that creates component instances.
	 * @param componentList a component list reference
	 * @return a list with created components
	 */
	private static buildSeneca(factory: IComponentFactory, componentList: ComponentSet): IComponent[] {
		let components: IComponent[] = [];

		// Get references to any seneca components
		let senecaComponents = componentList.getAllOptional(
			new ComponentDescriptor('*', '*', 'seneca', '*')
		);
		// Double check that they are real seneca components
		let containsSeneca = _.some(senecaComponents, (c) => { 
			return c.getDescriptor().getType() == 'seneca'; 
		});

		// If at least one seneca component is present
		if (containsSeneca) {
			let senecaDescriptor = new ComponentDescriptor(Category.Addons, 'pip-services-runtime-seneca', '*', '*');
			let senecaAddon = componentList.getOneOptional(senecaDescriptor);

			// If seneca addon isn't there then add it
			if (senecaAddon == null) {
				senecaAddon = factory.create(senecaDescriptor);
				senecaAddon.configure(new ComponentConfig());
				components.push(senecaAddon);
			}
		}

		return components;
	}

	/**
	 * Builds global component instances
	 * @param factory a component factory that creates component instances.
	 * @param config a microservice configuration.
	 * @param componentList a component list with all created microservice components
	 * @return a list with created components
	 */
	public static buildGlobals(factory: IComponentFactory, config: MicroserviceConfig, 
		componentList: ComponentSet): IComponent[] {
		return this.buildSeneca(factory, componentList);
	}

	/**
	 * Builds all microservice components according to configuration.
	 * @param factory a component factory that creates component instances.
	 * @param config a microservice configuration.
	 * @return a component list with all created microservice components
	 * @throws MicroserviceError when creation of configuration of components fails.
	 */
    public static build(factory: IComponentFactory, config: MicroserviceConfig): ComponentSet {
    	if (factory == null)
    		throw new Error("Factory isn't set");
    	if (config == null)
    		throw new Error("Microservice config isn't set");
    	
    	let components = new ComponentSet();
    	
    	// Build components section by section
		components.addAll(this.buildSection(factory, config, Category.Discovery));
    	components.addAll(this.buildSection(factory, config, Category.Logs));
    	components.addAll(this.buildSection(factory, config, Category.Counters));
    	components.addAll(this.buildSection(factory, config, Category.Cache));
    	components.addAll(this.buildSection(factory, config, Category.Clients));
    	components.addAll(this.buildSection(factory, config, Category.Persistence));
    	components.addAll(this.buildSection(factory, config, Category.Controllers));
    	components.addAll(this.buildSection(factory, config, Category.Decorators));
    	components.addAll(this.buildSection(factory, config, Category.Services));
    	components.addAll(this.buildSection(factory, config, Category.Addons));

		// Build global components
    	components.addAll(this.buildGlobals(factory, config, components));

        return components;
    }
    
}
