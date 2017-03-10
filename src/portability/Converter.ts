let _ = require('lodash');

import { DynamicMap } from './DynamicMap';

export class Converter {
    public static toNullableString(value: any): string {
        if (value == null) return null;
        if (_.isString(value)) return value;
        if (_.isDate(value)) value.toISOString();        
        return value.toString();
    }

    public static toString(value: any): string {
        return Converter.toStringWithDefault(value, "");
    }

    public static toStringWithDefault(value: any, defaultValue: string): string {
        return Converter.toNullableString(value) || defaultValue;
    }
    
    public static toNullableBoolean(value: any): boolean {
        if (value == null) return null;
        if (_.isBoolean(value)) return value;
        if (_.isNumber(value)) return !!value;

        value = value.toString().toLowerCase();

        if (value == '1' || value == 'true' || value == 't' 
            || value == 'yes' || value == 'y')
            return true;

        if (value == '0' || value == 'false' || value == 'f' 
            || value == 'no' || value == 'n')
            return false;
            
       return null;
    }

    public static toBoolean(value: any): boolean {
       return Converter.toBooleanWithDefault(value, false);
    }

    public static toBooleanWithDefault(value: any, defaultValue: boolean = false): boolean {
       var result = Converter.toNullableBoolean(value);
       return result != null ? result : defaultValue;
    }
    
    public static toNullableInteger(value: any): number {
        if (value == null) return null;
        if (_.isNumber(value)) return Math.ceil(value);
        if (_.isDate(value)) return value.getTime();
        if (_.isBoolean(value)) return value ? 1 : 0;
        
        let result = parseInt(value);
        return isNaN(result) ? null : result;
    }

    public static toInteger(value: any): number {
       return Converter.toIntegerWithDefault(value, 0);
    }

    public static toIntegerWithDefault(value: any, defaultValue: number = 0): number {
       var result = Converter.toNullableInteger(value);
       return result != null ? result : defaultValue;
    }

    public static toNullableLong(value: any): number {
        return Converter.toNullableInteger(value);
    }

    public static toLong(value: any): number {
       return Converter.toInteger(value);
    }

    public static toLongWithDefault(value: any, defaultValue: number = 0): number {
       return Converter.toIntegerWithDefault(value, defaultValue);
    }

    public static toNullableFloat(value: any): number {
        if (value == null) return null;
        if (_.isNumber(value)) return value;
        if (_.isDate(value)) return value.getTime();
        if (_.isBoolean(value)) return value ? 1 : 0;

        let result = parseFloat(value);
        return isNaN(result) ? null : result;
    }

    public static toFloat(value: any): number {
       return Converter.toFloatWithDefault(value, 0);
    }

    public static toFloatWithDefault(value: any, defaultValue: number = 0): number {
       var result = Converter.toNullableFloat(value);
       return result != null ? result : defaultValue;
    }
    
    public static toNullableDate(value: any): Date {
        if (value == null) return null;
        if (_.isDate(value)) return value;
        if (_.isNumber(value)) return new Date(value);

        let result = Date.parse(value);
        return isNaN(result) ? null : new Date(result);
    }

    public static toDate(value: any): Date {
       return Converter.toDateWithDefault(value, new Date());
    }

    public static toDateWithDefault(value: any, defaultValue: Date = null): Date {
       var result = Converter.toNullableDate(value);
       return result != null ? result : defaultValue;
    }
    
	public static toNullableArray(value: any): any[] {
		// Return null when nothing found
		if (value == null) {
			return null;
		}
		// Convert list
		else if (_.isArray(value)) {
			return <any[]>value;
		}
		// Convert single values
		else {
			let array: any[] = [];
			array.push(value);
			return array;
		}
	}

	public static toArray(value: any): any[] {
		let result: any[] = Converter.toNullableArray(value);
		return value || [];
	}

	public static toArrayWithDefault(value: any, defaultValue: any[]): any[] {
		let result: any[] = Converter.toNullableArray(value);
		return value || defaultValue;
	}

    public static listToArray(value: any): any[] {
        if (value == null) return [];
        if (_.isString(value)) value = value.split(',');
        return _.isArray(value) ? value : [value];
    }
    
    public static fromMultiString(value: any, language: string = 'en'): string {
        if (value == null || _.isString(value)) return value;
        if (value[language] != null && value[language] != '') return '' + value[language];
        if (value.en != null && value.en != '') return '' + value.en;
        
        for (let prop in value) {
            if (value[prop] != null && value[prop] != '') 
                return '' + value[prop];
        }
        
        return null;
    }
    
    public static toNullableMap(value: any): DynamicMap {
        if (value == null) return null;
        if (value instanceof DynamicMap) return value;
        return new DynamicMap(value);
    }
    
    public static toMap(value: any): DynamicMap {
        let map = Converter.toNullableMap(value);
        if (map == null) return new DynamicMap();
        return map;
    }

    public static toMapWithDefault(value: any, defaultValue: DynamicMap): DynamicMap {
        return Converter.toNullableMap(value) || defaultValue;
    }
}
