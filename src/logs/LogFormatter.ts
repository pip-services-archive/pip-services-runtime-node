import { LogLevel } from '../LogLevel';

export class LogFormatter {

	public static formatLevel(level: number): string {
		switch (level) {
			case LogLevel.Fatal: return "FATAL"; 
			case LogLevel.Error: return "ERROR"; 
			case LogLevel.Warn:  return "WARN"; 
			case LogLevel.Info:  return "INFO"; 
			case LogLevel.Debug: return "DEBUG"; 
			case LogLevel.Trace: return "TRACE";
			default: return "UNDEF";
		}
	}
	
	public static formatMessage(message: any[]): string {
		if (message == null || message.length == 0) return "";
		if (message.length == 1) return "" + message[0];
		
		let output: string = "" + message[0];
		
		for (let i = 1; i < message.length; i++)
			output += "," + message[i];
		
		return output;
	}

    public static format(level: number, message: any[]): string {
        return new Date().toISOString() 
            + ' ' + this.formatLevel(level) 
            + ' ' + this.formatMessage(message);            
    }    

}
