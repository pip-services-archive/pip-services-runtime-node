import { DynamicMap } from '../portability/DynamicMap';
import { Converter } from '../portability/Converter';

export class PagingParams {
    constructor(skip?: any, take?: any, total?: any) {
        this.skip = Converter.toNullableInteger(skip);
        this.take = Converter.toNullableInteger(take);
        this.total = Converter.toBooleanWithDefault(total, true);
    }
    
    public skip: number;
    public take: number;
    public total: boolean;
    
    public getSkip(minSkip: number): number {
    	if (this.skip == null) return minSkip;
    	if (this.skip < minSkip) return minSkip;
    	return this.skip; 
	}

    public getTake(maxTake: number): number {
    	if (this.take == null) return maxTake;
    	if (this.take < 0) return 0;
    	if (this.take > maxTake) return maxTake;
    	return this.take; 
	}
    
    public toObject(): any {
        return {
            skip: this.skip,
            take: this.take,
            total: this.total  
        };
    }

    public toJSON(): any {
        return this.toObject();
    }

	public static fromValue(value: any): PagingParams {
		if (value instanceof PagingParams)
			return <PagingParams>value;
		if (value instanceof DynamicMap)
			return PagingParams.fromMap(<DynamicMap>value);
		
		let map = DynamicMap.fromValue(value);
		return PagingParams.fromMap(map);
	}
	
	public static fromTuples(...tuples: any[]): PagingParams {
        let map: DynamicMap = new DynamicMap();
        map.setTuplesArray(tuples);
		return PagingParams.fromMap(map);
	}

	public static fromMap(map: DynamicMap): PagingParams {
        let skip = map.getNullableInteger("skip");
        let take = map.getNullableInteger("take");
        let total = map.getNullableBoolean("total");
		return new PagingParams(skip, take, total);
	}
}
