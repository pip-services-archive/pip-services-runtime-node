import { CounterType } from './CounterType';

export class Counter {
    constructor(name?: string, type?: CounterType) {
        this.name = name;
        this.type = type;
    }
    
    public name: string;
    public type: CounterType;
    public last: number;
    public count: number;
    public min: number;
    public max: number;
    public avg: number;    
    public time: Date;
}