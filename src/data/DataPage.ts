let _ = require('lodash');

export class DataPage {
    constructor(data?: any, total?: number) {
        // It it's set as an object
        if (data && !_.isArray(data)) {
            this.data = data.data;
            this.total = data.total;
        }
        // If it's set via parameters 
        else {
            this.data = data;
            this.total = total;
        }
    }    
    
    public data: any[];
    public total: number;
    
    public toObject(): any {
        return { 
            data: this.data, 
            total: this.total 
        };
    }

    public toJSON(): any {
        return this.toObject();
    }
}