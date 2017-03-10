import { Builder } from '../build/Builder';
import { Microservice } from './Microservice';

export class ProcessRunner {
    private _microservice: Microservice;
    
    constructor(microservice: Microservice) {
        this._microservice = microservice;
        this._microservice.enableExitOnError();        
    }

    public setConfig(config: any): void {
        this._microservice.setConfig(config);
    }

    public loadConfig(configPath: string): void {
        this._microservice.loadConfig(configPath);
    }

    public loadConfigWithDefault(defaultConfigPath: string): void {
        let configPath = process.argv[2] || defaultConfigPath || '../config/config.yaml';
        this._microservice.loadConfig(configPath);
    }

    private captureErrors(): void {
        process.on('uncaughtException', (err) => {
            this._microservice.exit(err);
        });    
    }

    private captureExit(): void {
        this._microservice.info('Press Control-C to stop the microservice...');

        process.on('SIGINT', () => {
            this._microservice.info('Goodbye!');
            this._microservice.exit(null);
        });    
    }
    
    public start(callback?: (err: any) => void): void {
        this.captureErrors();        
        this.captureExit();
                
        this._microservice.start(callback);
    }

    public startWithConfig(config: any, callback?: (err: any) => void): void {
        this.captureErrors();        
        this.captureExit();
                
        this._microservice.startWithConfig(config, callback);
    }

    public startWithConfigFile(configPath: string, callback?: (err: any) => void): void {
        this.captureErrors();        
        this.captureExit();
                
        this._microservice.startWithConfigFile(configPath, callback);
    }
    
    public startWithDefaultConfig(defaultConfigPath: string, callback?: (err: any) => void): void {
        let configPath = process.argv[2] || defaultConfigPath || '../config/config.yaml';
        this.startWithConfigFile(configPath, callback);
    }
    
    public stop(callback?: (err: any) => void): void {
        this._microservice.close(callback);
    }
}
