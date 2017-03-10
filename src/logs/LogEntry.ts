export class LogEntry {
    public component: string;
    public time: Date;
    public level: number;
    public correlation_id: string;
    public message: any[];

    constructor(level: number, component: string, time: Date, correlationId: string, message: any[]) {
        this.level = level;
        this.component = component;
        this.time = time || new Date();
        this.correlation_id = correlationId;
        this.message = message;
    }    
}