import { IComponent } from '../IComponent';
import { ComponentDescriptor } from '../config/ComponentDescriptor';

/**
 * Holds registration of specific component in component factory.
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
export class FactoryRegistration {
	private _descriptor: ComponentDescriptor;
	private _classFactory: () => void;
	
	/**
	 * Creates and fills registration instance.
	 * @param descriptor a component descriptor to locate the registration
	 * @param classFactory a component class factory to instantiate a component
	 */
	constructor(descriptor: ComponentDescriptor, classFactory: () => void) {
		this._descriptor = descriptor;
		this._classFactory = classFactory;
	}

	/**
	 * Gets a component descriptor for matching
	 * @return a component descriptor
	 */
	public getDescriptor(): ComponentDescriptor {
		return this._descriptor;
	}
	
	/**
	 * Get a component class factory to create a component instance
	 * @return a component class
	 */
	public getClassFactory(): () => void {
		return this._classFactory;
	}
}
