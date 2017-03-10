"use strict";
/**
 * Category of components or configuration sections that are used to configure components.
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
var Category = (function () {
    function Category() {
    }
    /**
     * Undefined category
     */
    Category.Undefined = "undefined";
    /**
     * Component factories
     */
    Category.Factories = "factories";
    /**
     * Service discovery components
     */
    Category.Discovery = "discovery";
    /**
     * Bootstap configuration readers
     */
    Category.Boot = "boot";
    /**
     * Logging components
     */
    Category.Logs = "logs";
    /**
     * Performance counters
     */
    Category.Counters = "counters";
    /**
     * Value caches
     */
    Category.Cache = "cache";
    /**
     * Persistence components
     */
    Category.Persistence = "persistence";
    /**
     * Clients to other microservices or infrastructure services
     */
    Category.Clients = "clients";
    /**
     * Any business logic component - controller or decorator
     */
    Category.BusinessLogic = "logic";
    /**
     * Business logic controllers
     */
    Category.Controllers = "controllers";
    /**
     * Decorators to business logic controllers
     */
    Category.Decorators = "decorators";
    /**
     * API services
     */
    Category.Services = "services";
    /**
     * Various microservice addons / extension components
     */
    Category.Addons = "addons";
    return Category;
}());
exports.Category = Category;
