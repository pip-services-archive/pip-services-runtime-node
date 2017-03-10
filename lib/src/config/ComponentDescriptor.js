"use strict";
var Category_1 = require('./Category');
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
var ComponentDescriptor = (function () {
    /**
     * Creates instance of a component descriptor
     * @param category - component category: 'cache', 'services' or 'controllers'
     * @param group - logical group: 'pip-services-runtime', 'pip-services-logging'
     * @param type - functional type: 'memory', 'file' or 'memcached'
     * @param version - compatibility version: '1.0'. '1.5' or '10.4'
     */
    function ComponentDescriptor(category, group, type, version) {
        if ("*" == category)
            category = null;
        if ("*" == group)
            group = null;
        if ("*" == type)
            type = null;
        if ("*" == version)
            version = null;
        this._category = category;
        this._group = group;
        this._type = type;
        this._version = version;
    }
    /**
     * Gets the component category
     * @return the component category
     */
    ComponentDescriptor.prototype.getCategory = function () {
        return this._category;
    };
    /**
     * Gets the logical group
     * @return the logical group
     */
    ComponentDescriptor.prototype.getGroup = function () {
        return this._group;
    };
    /**
     * Gets the functional type
     * @return the functional type
     */
    ComponentDescriptor.prototype.getType = function () {
        return this._type;
    };
    /**
     * Gets the compatibility version
     * @return the compatibility version
     */
    ComponentDescriptor.prototype.getVersion = function () {
        return this._version;
    };
    /**
     * Matches this descriptor to another descriptor.
     * All '*' or null descriptor elements match to any other value.
     * Specific values must match exactly.
     *
     * @param descriptor - another descriptor to match this one.
     * @return <b>true</b> if descriptors match or <b>false</b> otherwise.
     */
    ComponentDescriptor.prototype.match = function (descriptor) {
        if (this._category != null && descriptor.getCategory() != null) {
            // Special processing if this category is business logic
            if (this._category == Category_1.Category.BusinessLogic) {
                if (descriptor.getCategory() != Category_1.Category.Controllers
                    && descriptor.getCategory() != Category_1.Category.Decorators
                    && descriptor.getCategory() != Category_1.Category.BusinessLogic)
                    return false;
            }
            else if (descriptor.getCategory() == Category_1.Category.BusinessLogic) {
                if (this._category != Category_1.Category.Controllers
                    && this._category != Category_1.Category.Decorators
                    && this._category != Category_1.Category.BusinessLogic)
                    return false;
            }
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
    };
    ComponentDescriptor.prototype.toString = function () {
        return (this._category || "*")
            + ":" + (this._group || "*")
            + ":" + (this._type || "*")
            + ":" + (this._version || "*");
    };
    return ComponentDescriptor;
}());
exports.ComponentDescriptor = ComponentDescriptor;
