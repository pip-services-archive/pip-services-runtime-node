let _ = require('lodash');

import { DynamicMap } from '../portability/DynamicMap';

export class FilterParams extends DynamicMap {
    constructor(map?: DynamicMap) {
        super();
        
        if (map != null)
            _.assignIn(this, map);
    }

	public static fromValue(value: any): FilterParams {
		if (value instanceof FilterParams)
			return <FilterParams>value;
		if (value instanceof DynamicMap)
			return new FilterParams(<DynamicMap>value);
		
		return new FilterParams(DynamicMap.fromValue(value));
	}
	
	public static fromTuples(...tuples: any[]): FilterParams {
		let filter = new FilterParams();
		filter.setTuplesArray(tuples);
		return filter;
	}

	public static fromMap(map: DynamicMap): FilterParams {
		return new FilterParams(map);
	}
    
}