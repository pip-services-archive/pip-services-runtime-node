let _ = require('lodash');

import { Category } from '../config/Category';
import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { MicroserviceConfig } from '../config/MicroserviceConfig';
import { ComponentConfig } from '../config/ComponentConfig';
import { Microservice } from './Microservice';
import { LifeCycleManager } from './LifeCycleManager';
import { SenecaAddon } from '../addons/SenecaAddon';

export class SenecaPlugin {
    private _name: string;
    private _microservice: Microservice;
    private _seneca: SenecaAddon;
    
    constructor(name: string, microservice: Microservice) {
        this._name = name;        
        this._microservice = microservice;
    }
        
    private build(seneca: any, config: any, callback: (err: any) => void): void {        
        // Configure microservice
        let mconfig = MicroserviceConfig.fromValue(config);        
        this._microservice.setConfig(mconfig);

        // Set global seneca reference
        this._microservice.getContext().set("seneca", seneca);

        // Start with provided configuration options
        this._microservice.build((err) => {
            if (err) {
                callback(err);
                return;
            }

            // Todo: Remove this seneca reference. Use the global one
            // Get seneca addons
            this._seneca = <SenecaAddon>this._microservice.getComponents().getOneOptional(
                new ComponentDescriptor(Category.Addons, 'pip-services-runtime-seneca', '*', '*')
            );

            // Create a new instance if it is not found
            if (this._seneca == null) {
                this._seneca = new SenecaAddon();
                this._seneca.configure(new ComponentConfig());
                this._microservice.getComponents().add(this._seneca);
            }
            this._seneca.setSeneca(seneca);

            callback(null);
        });
    }
    
    private link(callback: (err: any) => void): void {
        this._microservice.link(callback);
    }
    
    private open(callback: (err: any) => void): void {
        this._microservice.open(callback);
    }

    private close(callback: (err: any) => void): void {
        this._microservice.close(callback);
    }
    
    private run(seneca: any, config: any): any {        
        // Open microservice on seneca init
        seneca.add(
            { init: this._name }, 
            (args, done) => { 
                // Build and initialize the plugin
                this.build(seneca, config, (err) => {
                    if (err) done(err);
                    else {
                        this.link((err) => {
                            if (err) done(err);
                            else this.open(done)
                        })
                    }
                }); 
            }
        );
        
        // Close microservice on seneca close
        seneca.on('close', () => { this.close(null); });
        
        return {
            name: this._name
        }
    }
    
    public entry(config?: any): any {
        let self = this;
        
        // Return plugin function
        return function (options) {
            let seneca: any = this;            

            // Calling run with changed context
            return self.run.call(self, seneca, config || options);
        }
    }
}