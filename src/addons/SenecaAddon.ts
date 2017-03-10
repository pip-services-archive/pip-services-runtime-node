import { Category } from '../config/Category';
import { ComponentDescriptor } from '../config/ComponentDescriptor';
import { AbstractAddon } from './AbstractAddon';

/**
 * Addon to wrap global seneca reference for all microservice components 
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-16
 */
export class SenecaAddon extends AbstractAddon {    
	/**
	 * Unique descriptor for the Memory Cache component
	 */
	public static Descriptor: ComponentDescriptor = new ComponentDescriptor(
		Category.Addons, "pip-services-runtime-seneca", "*", "*"
	);

    private _seneca: any;

    /**
	 * Creates and initializes instance of the microservice addon
	 * @param descriptor the unique descriptor that is used to identify and locate the component.
	 */
    constructor() {
        super(SenecaAddon.Descriptor);
    }

    /**
     * Gets reference to the global seneca instance.
     * If seneca isn't created, the method creates it.
     * @return a global reference to seneca runtime.
     */
    public getSeneca(): any {
        // Initialize seneca reference
        if (this._seneca == null) {
            this._seneca = require('seneca')();
            this._seneca.error((err) => {
                this.error(null, err);
            });
        }

        return this._seneca;
    }

    /**
     * Sets a global seneca reference to share it across all microservice components
     * @param seneca a seneca reference
     */
    public setSeneca(seneca: any): void {
        this._seneca = seneca;
    }

}
