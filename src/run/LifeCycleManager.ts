let _ = require('lodash');
let async = require('async');

import { DynamicMap } from '../portability/DynamicMap';
import { IComponent } from '../IComponent';
import { ComponentSet } from '../ComponentSet';
import { State } from '../State';
import { LogWriter } from './LogWriter'; 

export class LifeCycleManager {
        
	public static getState(components: IComponent[]): number {
		let state = State.Undefined; // Fake state
		for (let i = 0; i < components.length; i++) {
            let component = components[i];
			if (state == State.Undefined || component.getState() < state)
				state = component.getState();
		}
		return state;
	}
    
    public static linkComponents(context: DynamicMap, components: IComponent[], callback?: (err: any) => void): void {
        LifeCycleManager.link(context, new ComponentSet(components), callback);
    }

    public static link(context: DynamicMap, components: ComponentSet, callback?: (err: any) => void): void {
        let error: any = null;

        // Link all components
        try {
            let orderedList = components.getAllOrdered();
            for (let i = 0; i < orderedList.length; i++) {
                let component = orderedList[i];
                if (component.getState() == State.Configured)
                    component.link(context, components);
            }
        }
        // Capture occured error 
        catch (err) {
            error = err;
        }

        // If callback is defined then return error
        if (callback) callback(error);
        // Otherwise throw error
        else if (error) throw error;
    }

    public static linkAndOpenComponents(context: DynamicMap, components: IComponent[], callback: (err: any) => void): void {
        LifeCycleManager.linkAndOpen(context, new ComponentSet(components), callback);
    }

    public static linkAndOpen(context: DynamicMap, components: ComponentSet, callback: (err: any) => void): void {
        LifeCycleManager.link(context, components, (err: any) => {
            if (err) callback(err);
            else LifeCycleManager.open(components, callback);
        });
    }
    
    public static openComponents(components: IComponent[], callback: (err: any) => void): void {
        let opened = [];

        async.eachSeries(
            components, 
            (component, callback) => {
                if (component.getState() != State.Opened)
                    component.open((err) => {
                        if (err == null) opened.push(component);
                        callback(err);
                    });
                else callback();
            },
            (err) => {
                if (err) {
                    LogWriter.trace(components, 'Microservice opening failed with error ' + err);
                    LifeCycleManager.forceCloseComponents(opened, () => callback(err));
                }
                else callback(null);
            }
        );
    }

    public static open(components: ComponentSet, callback: (err: any) => void): void {
        LifeCycleManager.openComponents(components.getAllOrdered(), callback);
    }
    
    public static closeComponents(components: IComponent[], callback: (err: any) => void): void {
        // Close in reversed order
        components = _.reverse(components);
        
        // Close components on by one
        async.eachSeries(
            components, 
            (component, callback) => {
                if (component.getState() == State.Opened)
                    component.close(callback);
                else callback();
            },
            (err) => {
                if (err)
                    LogWriter.trace(components, 'Microservice closure failed with error ' + err);
                callback(err);
            }
        );
    }

    public static close(components: ComponentSet, callback: (err: any) => void): void {
        LifeCycleManager.closeComponents(components.getAllOrdered(), callback);
    }

    public static forceCloseComponents(components: IComponent[], callback: (err: any) => void): void {
        // Close in reversed order
        components = _.reverse(components);
        
        let firstError = null;
        
        // Close components one by one
        async.eachSeries(
            components, 
            (component, callback) => {
                if (component.getState() == State.Opened)
                    component.close((err) => {
                        // Capture the error and continue
                        firstError = firstError || err;
                        callback(null);
                    });
                else callback();
            },
            (err) => {
                // Print and return the first error
                firstError = firstError || err;
                if (firstError) 
                    LogWriter.trace(components, 'Microservice closure failed with error ' + firstError);                                        
                callback(firstError);
            }
        );
    }

    public static forceClose(components: ComponentSet, callback: (err: any) => void): void {
        LifeCycleManager.forceCloseComponents(components.getAllOrdered(), callback);
    }
    
}
