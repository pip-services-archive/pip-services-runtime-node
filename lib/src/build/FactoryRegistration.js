"use strict";
/**
 * Holds registration of specific component in component factory.
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
var FactoryRegistration = (function () {
    /**
     * Creates and fills registration instance.
     * @param descriptor a component descriptor to locate the registration
     * @param classFactory a component class factory to instantiate a component
     */
    function FactoryRegistration(descriptor, classFactory) {
        this._descriptor = descriptor;
        this._classFactory = classFactory;
    }
    /**
     * Gets a component descriptor for matching
     * @return a component descriptor
     */
    FactoryRegistration.prototype.getDescriptor = function () {
        return this._descriptor;
    };
    /**
     * Get a component class factory to create a component instance
     * @return a component class
     */
    FactoryRegistration.prototype.getClassFactory = function () {
        return this._classFactory;
    };
    return FactoryRegistration;
}());
exports.FactoryRegistration = FactoryRegistration;
