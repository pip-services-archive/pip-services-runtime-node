import { MicroserviceError } from '../errors/MicroserviceError';
import { PropertySchema } from './PropertySchema';

/**
 * Interface for object property validation rule.
 * If can performs validation for a specified object property.
 * For instance, it check for valid range, allowed or disallowed values.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-13
 */
export interface IPropertyValidationRule {
	/**
	 * Validates object property according to the schema and the rule.
	 * @param schema a property schema this rule belongs to
	 * @param value the property value to be validated.
	 * @return a list of validation errors or empty list if validation passed.
	 */
	validate(schema: PropertySchema, value: any): MicroserviceError[];
}
