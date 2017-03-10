"use strict";
var PropertySchema_1 = require('./PropertySchema');
/**
 * Represents a validation schema for complex objects.
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
var Schema = (function () {
    /**
     * Creates an instance of validation schema
     */
    function Schema() {
        this._properties = [];
        this._rules = [];
    }
    /**
     * Gets a list of object properties
     * @return a list of property validation schemas
     */
    Schema.prototype.getProperties = function () {
        return this._properties;
    };
    /**
     * Gets a validation rules for entire object
     * @return a list of validation rules
     */
    Schema.prototype.getRules = function () {
        return this._rules;
    };
    /**
     * Adds to the validation schema a required property defined by a simple type.
     * @param name a name of the property to be added
     * @param type simple type that defines the property value
     * @param rules a set of validation rules for the property
     * @return a self reference to the schema for chaining
     */
    Schema.prototype.withProperty = function (name, type) {
        var rules = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            rules[_i - 2] = arguments[_i];
        }
        this._properties.push(new PropertySchema_1.PropertySchema(name, false, type, false, rules));
        return this;
    };
    /**
     * Adds to the validation schema a required property array defined by a simple type.
     * @param name a name of the property to be added
     * @param type simple type that defines the property value
     * @param required a required flag
     * @param rules a set of validation rules for the property
     * @return a self reference to the schema for chaining
     */
    Schema.prototype.withArray = function (name, type) {
        var rules = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            rules[_i - 2] = arguments[_i];
        }
        this._properties.push(new PropertySchema_1.PropertySchema(name, true, type, false, rules));
        return this;
    };
    /**
     * Adds to the validation schema an optional property defined by a simple type.
     * @param name a name of the property to be added
     * @param type simple type that defines the property value
     * @param rules a set of validation rules for the property
     * @return a self reference to the schema for chaining
     */
    Schema.prototype.withOptionalProperty = function (name, type) {
        var rules = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            rules[_i - 2] = arguments[_i];
        }
        this._properties.push(new PropertySchema_1.PropertySchema(name, false, type, true, rules));
        return this;
    };
    /**
     * Adds to the validation schema an optional property array defined by a simple type.
     * @param name a name of the property to be added
     * @param type simple type that defines the property value
     * @param rules a set of validation rules for the property
     * @return a self reference to the schema for chaining
     */
    Schema.prototype.withOptionalArray = function (name, type) {
        var rules = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            rules[_i - 2] = arguments[_i];
        }
        this._properties.push(new PropertySchema_1.PropertySchema(name, true, type, true, rules));
        return this;
    };
    /**
     * Adds to the validation schema a required property defined by validation schema.
     * @param name a name of the property to be added
     * @param schema validation schema for the property value
     * @param required a required flag
     * @param rules a set of validation rules for the property
     * @return a self reference to the schema for chaining
     */
    Schema.prototype.withPropertySchema = function (name, schema) {
        var rules = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            rules[_i - 2] = arguments[_i];
        }
        this._properties.push(new PropertySchema_1.PropertySchema(name, false, schema, false, rules));
        return this;
    };
    /**
     * Adds to the validation schema a required property array defined by validation schema.
     * @param name a name of the property to be added
     * @param schema validation schema for the property value
     * @param required a required flag
     * @param rules a set of validation rules for the property
     * @return a self reference to the schema for chaining
     */
    Schema.prototype.withArraySchema = function (name, schema) {
        var rules = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            rules[_i - 2] = arguments[_i];
        }
        this._properties.push(new PropertySchema_1.PropertySchema(name, true, schema, false, rules));
        return this;
    };
    /**
     * Adds to the validation schema an optional property defined by validation schema.
     * @param name a name of the property to be added
     * @param schema validation schema for the property value
     * @param rules a set of validation rules for the property
     * @return a self reference to the schema for chaining
     */
    Schema.prototype.withOptionalPropertySchema = function (name, schema) {
        var rules = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            rules[_i - 2] = arguments[_i];
        }
        this._properties.push(new PropertySchema_1.PropertySchema(name, false, schema, true, rules));
        return this;
    };
    /**
     * Adds to the validation schema an optional property array defined by validation schema.
     * @param name a name of the property to be added
     * @param schema validation schema for the property value
     * @param rules a set of validation rules for the property
     * @return a self reference to the schema for chaining
     */
    Schema.prototype.withOptionalArraySchema = function (name, schema) {
        var rules = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            rules[_i - 2] = arguments[_i];
        }
        this._properties.push(new PropertySchema_1.PropertySchema(name, true, schema, true, rules));
        return this;
    };
    /**
     * Adds a validation rule to this scheme
     * @param rule a validation rule to be added
     * @return a self reference to the schema for chaining
     */
    Schema.prototype.withRule = function (rule) {
        this._rules.push(rule);
        return this;
    };
    return Schema;
}());
exports.Schema = Schema;
