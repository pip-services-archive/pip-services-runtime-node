"use strict";
var _ = require('lodash');
var Category_1 = require('../config/Category');
var ComponentDescriptor_1 = require('../config/ComponentDescriptor');
var ComponentConfig_1 = require('../config/ComponentConfig');
var ComponentSet_1 = require('../ComponentSet');
/**
 * Builds microservice components using configuration as a build recipe.
 *
 * @author Sergey Seroukhov
 * @version 2.0
 * @since 2016-09-10
 */
var Builder = (function () {
    function Builder() {
    }
    /**
     * Builds default components for specified configuration section.
     * @param factory a component factory that creates component instances.
     * @param category a name of the section inside configuration.
     * @param components a list with section components
     * @return a list with section components for chaining
     * @throws MicroserviceError when creation or configuration of components fails.
     */
    Builder.buildSectionDefaults = function (factory, category, components) {
        // Add null discovery by default
        if (category == Category_1.Category.Discovery && components.length == 0) {
        }
        else if (category == Category_1.Category.Logs && components.length == 0) {
            var log = factory.create(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Logs, null, "null", null));
            log.configure(new ComponentConfig_1.ComponentConfig());
            components.push(log);
        }
        else if (category == Category_1.Category.Counters && components.length == 0) {
            var counters = factory.create(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Counters, null, "null", null));
            counters.configure(new ComponentConfig_1.ComponentConfig());
            components.push(counters);
        }
        else if (category == Category_1.Category.Cache && components.length == 0) {
            var cache = factory.create(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Cache, null, "null", null));
            cache.configure(new ComponentConfig_1.ComponentConfig());
            components.push(cache);
        }
        return components;
    };
    /**
     * Builds components from specific configuration section.
     * @param factory a component factory that creates component instances.
     * @param config a microservice configuration
     * @param category a name of the section inside configuration.
     * @return a list with created components
     * @throws MicroserviceError when creation or configuration of components fails.
     */
    Builder.buildSection = function (factory, config, category) {
        var components = [];
        // Get specified configuration section
        var componentConfigs = config.getSection(category);
        // Go through configured components one by one
        for (var i = 0; i < componentConfigs.length; i++) {
            var componentConfig = componentConfigs[i];
            // Create component using component config
            var descriptor = componentConfig.getDescriptor();
            var component = factory.create(descriptor);
            // Configure the created component
            component.configure(componentConfig);
            components.push(component);
        }
        // Add default components and return the result
        return this.buildSectionDefaults(factory, category, components);
    };
    /**
     * Build seneca addon to provide global seneca reference
     * @param factory a component factory that creates component instances.
     * @param componentList a component list reference
     * @return a list with created components
     */
    Builder.buildSeneca = function (factory, componentList) {
        var components = [];
        // Get references to any seneca components
        var senecaComponents = componentList.getAllOptional(new ComponentDescriptor_1.ComponentDescriptor('*', '*', 'seneca', '*'));
        // Double check that they are real seneca components
        var containsSeneca = _.some(senecaComponents, function (c) {
            return c.getDescriptor().getType() == 'seneca';
        });
        // If at least one seneca component is present
        if (containsSeneca) {
            var senecaDescriptor = new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Addons, 'pip-services-runtime-seneca', '*', '*');
            var senecaAddon = componentList.getOneOptional(senecaDescriptor);
            // If seneca addon isn't there then add it
            if (senecaAddon == null) {
                senecaAddon = factory.create(senecaDescriptor);
                senecaAddon.configure(new ComponentConfig_1.ComponentConfig());
                components.push(senecaAddon);
            }
        }
        return components;
    };
    /**
     * Builds global component instances
     * @param factory a component factory that creates component instances.
     * @param config a microservice configuration.
     * @param componentList a component list with all created microservice components
     * @return a list with created components
     */
    Builder.buildGlobals = function (factory, config, componentList) {
        return this.buildSeneca(factory, componentList);
    };
    /**
     * Builds all microservice components according to configuration.
     * @param factory a component factory that creates component instances.
     * @param config a microservice configuration.
     * @return a component list with all created microservice components
     * @throws MicroserviceError when creation of configuration of components fails.
     */
    Builder.build = function (factory, config) {
        if (factory == null)
            throw new Error("Factory isn't set");
        if (config == null)
            throw new Error("Microservice config isn't set");
        var components = new ComponentSet_1.ComponentSet();
        // Build components section by section
        components.addAll(this.buildSection(factory, config, Category_1.Category.Discovery));
        components.addAll(this.buildSection(factory, config, Category_1.Category.Logs));
        components.addAll(this.buildSection(factory, config, Category_1.Category.Counters));
        components.addAll(this.buildSection(factory, config, Category_1.Category.Cache));
        components.addAll(this.buildSection(factory, config, Category_1.Category.Clients));
        components.addAll(this.buildSection(factory, config, Category_1.Category.Persistence));
        components.addAll(this.buildSection(factory, config, Category_1.Category.Controllers));
        components.addAll(this.buildSection(factory, config, Category_1.Category.Decorators));
        components.addAll(this.buildSection(factory, config, Category_1.Category.Services));
        components.addAll(this.buildSection(factory, config, Category_1.Category.Addons));
        // Build global components
        components.addAll(this.buildGlobals(factory, config, components));
        return components;
    };
    return Builder;
}());
exports.Builder = Builder;
