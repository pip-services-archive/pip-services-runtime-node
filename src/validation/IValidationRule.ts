import { MicroserviceError } from '../errors/MicroserviceError';
import { Schema } from './Schema';

/**
 * Interface for object schema validation rule.
 * If can performs overall validation across the entire object.
 * For instance, it can check presence of one of several required properties.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-13
 */
export interface IValidationRule {
	/**
	 * Validates object according to the schema and the rule.
	 * @param schema an object schema this rule belongs to
	 * @param value the object value to be validated.
	 * @return a list of validation errors or empty list if validation passed.
	 */
	validate(schema: Schema, value: any): MicroserviceError[];
}
