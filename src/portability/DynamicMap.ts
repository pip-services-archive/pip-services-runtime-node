let _ = require('lodash');

import { Converter } from './Converter';

export class DynamicMap {
       
    constructor(map?: any) {
        if (map != null)
            _.assignIn(this, map);
    }

    /********* Getters *********/
        
    public get(propName: string): any {
        return _.get(this, propName);
    }
    
    public has(propName: string): boolean {
        return _.has(this, propName);
    }
    
    public hasNot(propName: string): boolean {
        return !_.has(this, propName);
    }

    public getNullableMap(propName: string): DynamicMap {
        let value: any = this.get(propName);
        return Converter.toNullableMap(value);
    }

    public getMap(propName: string): DynamicMap {
        let value: any = this.get(propName);
        return Converter.toMap(value);
    }
    
    public getMapWithDefault(propName: string, defaultValue: DynamicMap): DynamicMap {
        let value: any = this.get(propName);
        return Converter.toMapWithDefault(value, defaultValue);
    }

	public getNullableArray(path: string): any[] {
        let value: any = this.get(path);
        return Converter.toNullableArray(value);
	}

	public getArray(path: string): any[] {
		let value: any[] = this.getNullableArray(path);
		return value != null ? value : [];
	}

	public getArrayWithDefault(path: string, defaultValue: any[]): any[] {
		let value: any[] = this.getNullableArray(path);
		return value != null ? value : defaultValue;
	}

    public getNullableString(propName: string): string {
        let value: any = this.get(propName);
        return Converter.toNullableString(value);
    }

    public getString(propName: string): string {
        return this.getStringWithDefault(propName, "");
    }
    
    public getStringWithDefault(propName: string, defaultValue: string): string {
        let value: any = this.get(propName);
        return Converter.toStringWithDefault(value, defaultValue);
    }

    public getNullableBoolean(propName: string): boolean {
        let value: any = this.get(propName);
        return Converter.toNullableBoolean(value);
    }

    public getBoolean(propName: string): boolean {
        return this.getBooleanWithDefault(propName, false);
    }
    
    public getBooleanWithDefault(propName: string, defaultValue: boolean): boolean {
        let value: any = this.get(propName);
        return Converter.toBooleanWithDefault(value, defaultValue);
    }

    public getNullableInteger(propName: string): number {
        let value: any = this.get(propName);
        return Converter.toNullableInteger(value);
    }

    public getInteger(propName: string): number {
        return this.getIntegerWithDefault(propName, 0);
    }
    
    public getIntegerWithDefault(propName: string, defaultValue: number): number {
        let value: any = this.get(propName);
        return Converter.toIntegerWithDefault(value, defaultValue);
    }

    public getNullableLong(propName: string): number {
        let value: any = this.get(propName);
        return Converter.toNullableLong(value);
    }

    public getLong(propName: string): number {
        return this.getLongWithDefault(propName, 0);
    }
    
    public getLongWithDefault(propName: string, defaultValue: number): number {
        let value: any = this.get(propName);
        return Converter.toLongWithDefault(value, defaultValue);
    }

    public getNullableFloat(propName: string): number {
        let value: any = this.get(propName);
        return Converter.toNullableFloat(value);
    }

    public getFloat(propName: string): number {
        return this.getIntegerWithDefault(propName, 0);
    }
    
    public getFloatWithDefault(propName: string, defaultValue: number): number {
        let value: any = this.get(propName);
        return Converter.toFloatWithDefault(value, defaultValue);
    }

    public getNullableDate(propName: string): Date {
        let value: any = this.get(propName);
        return Converter.toNullableDate(value);
    }

    public getDate(propName: string): Date {
        return this.getDateWithDefault(propName, new Date());
    }
    
    public getDateWithDefault(propName: string, defaultValue: Date): Date {
        let value: any = this.get(propName);
        return Converter.toDateWithDefault(value, defaultValue);
    }

    /************ Setters ************/
    
    public set(propName: string, value: any): void {
        _.set(this, propName, value);
    }

    public setTuplesArray(values: any[]): void {
        for (let i = 0; i < values.length; i += 2) {
            if (i + 1 >= values.length) break;
            
            let propName: string = Converter.toString(values[i]);
            let propValue: any = values[i + 1];
            
            _.set(this, propName, propValue);
        }
    }

    public setTuples(...values: any[]): void {
        this.setTuplesArray(values);
    }

    public remove(propName: string): void {
        _.unset(this, propName);
    }

    public removeAll(...propNames: string[]): void {
        _.each(propNames, (propName) => { _.unset(this, propName); });
    }

    /********** Merging **********/

    public static merge(dest: DynamicMap, source: any, deep: boolean): DynamicMap {
        if (dest == null) dest = new DynamicMap();
        if (source == null) return dest;
        
        if (deep) _.defaultsDeep(dest, source);
        else _.defaults(dest, source);
        
        return dest;
    }

    public static setDefaults(dest: DynamicMap, source: any): DynamicMap {
        return DynamicMap.merge(dest, source, true);
    }

    public merge(source: any, deep: boolean): DynamicMap {
        let dest: DynamicMap = new DynamicMap(this);
        return DynamicMap.merge(dest, source, deep);
    }
    
    public mergeDeep(source: any): DynamicMap {
        return this.merge(source, true);
    }

    public setDefaults(defaults: any): DynamicMap {
        return this.merge(defaults, true);
    }
    
    /*********** Other Utilities ***********/

    public assignTo(value: any): void {
        _.assign(value, this);
    }

    public pick(...propNames: string[]): DynamicMap {
        let values: any = _.pick(this, propNames);
        return new DynamicMap(values);
    }

    public omit(...propNames: string[]): DynamicMap {
        let values: any = _.omit(this, propNames);
        return new DynamicMap(values);
    }

    public toObject(): any {
        return _.assign({}, this);
    }

    public toJSON(): any {
        return this.toObject();
    }

    /********* Class constructors ********/

    /**
     * Creates a dynamic map from free-form object
     * by converting it into the map.
     * @param value a free-form object
     * @return a constructed dynamic map
     */
    public static fromValue(value: any): DynamicMap {
        let result: DynamicMap = new DynamicMap();
        // Copy over
        _.assignIn(result, value);
        return result;
    }

    /**
     * Creates a dynamic map from list of
     * <path> + <value> tuples
     * @param values types that contain property path
     * following with property value
     * @return a constructed dynamic map
     */
    public static fromTuples(...values: any[]): DynamicMap {
        let map: DynamicMap = new DynamicMap();
        map.setTuplesArray(values);
        return map;
    }
}