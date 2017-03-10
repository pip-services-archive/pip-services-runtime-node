import { MicroserviceError } from '../errors/MicroserviceError';
import { IValidationRule } from './IValidationRule';
import { PropertySchema } from './PropertySchema';
import { IPropertyValidationRule } from './IPropertyValidationRule';

/**
 * Represents a validation schema for complex objects.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
export class Schema {
	private _properties: PropertySchema[] = [];
	private _rules: IValidationRule[] = [];
	
	/**
	 * Creates an instance of validation schema
	 */
	constructor() {}
	
	/**
	 * Gets a list of object properties
	 * @return a list of property validation schemas
	 */
	public getProperties(): PropertySchema[] {
		return this._properties;
	}
	
	/**
	 * Gets a validation rules for entire object
	 * @return a list of validation rules
	 */
	public getRules(): IValidationRule[] {
		return this._rules;
	}

	/**
	 * Adds to the validation schema a required property defined by a simple type.
	 * @param name a name of the property to be added
	 * @param type simple type that defines the property value
	 * @param rules a set of validation rules for the property
	 * @return a self reference to the schema for chaining
	 */
	public withProperty(name: string, type: string, ...rules: IPropertyValidationRule[]): Schema {
		this._properties.push(new PropertySchema(name, false, type, false, rules));
		return this;
	}

	/**
	 * Adds to the validation schema a required property array defined by a simple type.
	 * @param name a name of the property to be added
	 * @param type simple type that defines the property value
	 * @param required a required flag
	 * @param rules a set of validation rules for the property
	 * @return a self reference to the schema for chaining
	 */
	public withArray(name: string, type: string, ...rules: IPropertyValidationRule[]): Schema {
		this._properties.push(new PropertySchema(name, true, type, false, rules));
		return this;
	}

	/**
	 * Adds to the validation schema an optional property defined by a simple type.
	 * @param name a name of the property to be added
	 * @param type simple type that defines the property value
	 * @param rules a set of validation rules for the property
	 * @return a self reference to the schema for chaining
	 */
	public withOptionalProperty(name: string, type: string, ...rules: IPropertyValidationRule[]): Schema {
		this._properties.push(new PropertySchema(name, false, type, true, rules));
		return this;
	}
	
	/**
	 * Adds to the validation schema an optional property array defined by a simple type.
	 * @param name a name of the property to be added
	 * @param type simple type that defines the property value
	 * @param rules a set of validation rules for the property
	 * @return a self reference to the schema for chaining
	 */
	public withOptionalArray(name: string, type: string, ...rules: IPropertyValidationRule[]): Schema {
		this._properties.push(new PropertySchema(name, true, type, true, rules));
		return this;
	}
	
	/**
	 * Adds to the validation schema a required property defined by validation schema.
	 * @param name a name of the property to be added
	 * @param schema validation schema for the property value
	 * @param required a required flag
	 * @param rules a set of validation rules for the property
	 * @return a self reference to the schema for chaining
	 */
	public withPropertySchema(name: string, schema: Schema, ...rules: IPropertyValidationRule[]): Schema {
		this._properties.push(new PropertySchema(name, false, schema, false, rules));
		return this;
	}

	/**
	 * Adds to the validation schema a required property array defined by validation schema.
	 * @param name a name of the property to be added
	 * @param schema validation schema for the property value
	 * @param required a required flag
	 * @param rules a set of validation rules for the property
	 * @return a self reference to the schema for chaining
	 */
	public withArraySchema(name: string, schema: Schema, ...rules: IPropertyValidationRule[]): Schema {
		this._properties.push(new PropertySchema(name, true, schema, false, rules));
		return this;
	}

	/**
	 * Adds to the validation schema an optional property defined by validation schema.
	 * @param name a name of the property to be added
	 * @param schema validation schema for the property value
	 * @param rules a set of validation rules for the property
	 * @return a self reference to the schema for chaining
	 */
	public withOptionalPropertySchema(name: string, schema: Schema, ...rules: IPropertyValidationRule[]): Schema {
		this._properties.push(new PropertySchema(name, false, schema, true, rules));
		return this;
	}

	/**
	 * Adds to the validation schema an optional property array defined by validation schema.
	 * @param name a name of the property to be added
	 * @param schema validation schema for the property value
	 * @param rules a set of validation rules for the property
	 * @return a self reference to the schema for chaining
	 */
	public withOptionalArraySchema(name: string, schema: Schema, ...rules: IPropertyValidationRule[]): Schema {
		this._properties.push(new PropertySchema(name, true, schema, true, rules));
		return this;
	}

	/**
	 * Adds a validation rule to this scheme
	 * @param rule a validation rule to be added
	 * @return a self reference to the schema for chaining
	 */
	public withRule(rule: IValidationRule): Schema {
		this._rules.push(rule);
		return this;
	}
}
