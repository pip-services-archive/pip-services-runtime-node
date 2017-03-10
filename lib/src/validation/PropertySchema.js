"use strict";
var _ = require('lodash');
var Schema_1 = require('./Schema');
/**
 * Represents a validation schema for object property.
 * The schema can use simple types like: "string", "number", "object", "DummyObject"
 * or specific schemas for object values
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-13
 */
var PropertySchema = (function () {
    /**
     *  Creates instance of the object property schema defined by a simple type
     * @param name the name of the property
     * @param array the array flag
     * @param type the simple value type
     * @param optional the optional flag
     * @param rules a list of validation rules
     */
    function PropertySchema(name, array, typeOrSchema, optional, rules) {
        if (optional === void 0) { optional = false; }
        if (rules === void 0) { rules = []; }
        this._rules = [];
        this._name = name;
        this._array = array;
        this._optional = optional;
        if (typeOrSchema instanceof Schema_1.Schema)
            this._schema = typeOrSchema;
        else
            this._type = typeOrSchema;
        this._rules = rules || [];
    }
    /***
     * Gets the property name
     * @return the name of the property
     */
    PropertySchema.prototype.getName = function () {
        return this._name;
    };
    /**
     * Gets the property array flag
     * @return <b>true</b> if the property is array and <b>false</b> if it is a simple value
     */
    PropertySchema.prototype.isArray = function () {
        return this._array;
    };
    /**
     * Gets the property optional flag (opposite to required)
     * @return <b>true</b> if the property optional and <b>false</b> if it is required
     */
    PropertySchema.prototype.isOptional = function () {
        return this._optional;
    };
    /**
     * Gets the simple type describing property value
     * @return a simple value type: 'int', 'float', 'number', 'string', 'boolean', 'string', ...
     */
    PropertySchema.prototype.getType = function () {
        return this._type;
    };
    /**
     * Gets the complex property schema describing property value
     * @return a schema object
     */
    PropertySchema.prototype.getSchema = function () {
        return this._schema;
    };
    /**
     * Gets a list of validation rules associated with this property
     * @return a list of validation rules
     */
    PropertySchema.prototype.getRules = function () {
        return this._rules;
    };
    return PropertySchema;
}());
exports.PropertySchema = PropertySchema;
