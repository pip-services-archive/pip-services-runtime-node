let _ = require('lodash');

import { Schema } from './Schema';
import { IPropertyValidationRule } from './IPropertyValidationRule';

/**
 * Represents a validation schema for object property.
 * The schema can use simple types like: "string", "number", "object", "DummyObject"
 * or specific schemas for object values
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-13
 */
export class PropertySchema {
	private _name: string;
	private _array: boolean;
	private _optional: boolean;
	private _type: string;
	private _schema: Schema;
	private _rules: IPropertyValidationRule[] = [];

	/**
	 *  Creates instance of the object property schema defined by a simple type
	 * @param name the name of the property
	 * @param array the array flag
	 * @param type the simple value type
	 * @param optional the optional flag
	 * @param rules a list of validation rules
	 */
	constructor(name: string, array: boolean, typeOrSchema: any, 
        optional: boolean = false, rules: IPropertyValidationRule[] = []) {

		this._name = name;
		this._array = array;
		this._optional = optional;
        
        if (typeOrSchema instanceof Schema)
            this._schema = <Schema>typeOrSchema;
        else
		    this._type = typeOrSchema;
		
		this._rules = rules || []; 
	}
		
	/***
	 * Gets the property name
	 * @return the name of the property
	 */
	public getName(): string {
		return this._name;
	}
	
	/**
	 * Gets the property array flag
	 * @return <b>true</b> if the property is array and <b>false</b> if it is a simple value
	 */
	public isArray(): boolean {
		return this._array;
	}

	/**
	 * Gets the property optional flag (opposite to required)
	 * @return <b>true</b> if the property optional and <b>false</b> if it is required
	 */
	public isOptional(): boolean {
		return this._optional;
	}

	/**
	 * Gets the simple type describing property value
	 * @return a simple value type: 'int', 'float', 'number', 'string', 'boolean', 'string', ...
	 */
	public getType(): string {
		return this._type;
	}

	/**
	 * Gets the complex property schema describing property value
	 * @return a schema object
	 */
	public getSchema(): Schema {
		return this._schema;
	}
	
	/**
	 * Gets a list of validation rules associated with this property
	 * @return a list of validation rules
	 */
	public getRules(): IPropertyValidationRule[] {
		return this._rules;
	}
}
