let _ = require('lodash');

import { ErrorCategory } from './ErrorCategory';

/**
 * Base class for all errors thrown by microservice implementation
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
export class MicroserviceError extends Error {
    public category: string;
    public component: string;
    public code: string = 'Undefined';
    public cause: any;
    public status: number = 500;
    public details: any[];   
    public correlationId: string;     
    
    constructor(category: string = ErrorCategory.UnknownError, component: any = null, code: string = 'Undefined', message: string = 'Unknown error') {
        super(message);
        
        this.category = category;
        this.component = component != null ? "" + component : null;
        this.code = code;
        
        // Hack to set message
        if (!this.message) this.message = message;
        this.name = this.code;
    }
    
    public forComponent(component: any): MicroserviceError {
        this.component = component != null ? "" + component : null;
        return this;
    }
    
    public withCode(code: string): MicroserviceError {
        this.code = code || 'Undefined';
        this.name = this.code;
        return this;
    }
    
    public withCause(cause: any): MicroserviceError {
        this.cause = cause;
        return this;
    }
    
    public withStatus(status: number): MicroserviceError {
        this.status = status || 500;
        return this;
    }
    
    public withDetails(...details: any[]): MicroserviceError {
        this.details = this.details != null 
            ? this.details.concat(details) : details;
        return this;
    }
    
    public withCorrelationId(correlationId: string): MicroserviceError {
        this.correlationId = correlationId;
        return this;
    }

    public toObject(): any {
        let result: any = {
            category: this.category,
            code: this.code,
            message: this.message,
            status: this.status
        };
        
        if (this.component) result.component = this.component;
        if (this.cause) result.cause = this.cause;
        if (this.details || this.details.length > 0) result.details = this.details;
        if (this.correlationId) result.correlation_id = this.correlationId;
        
        return result;
    }

    public toJSON(): any {
        return this.toObject();
    }

    public wrap(cause: any): MicroserviceError {
        cause = MicroserviceError.unwrap(cause);

        if (cause instanceof MicroserviceError) 
            return <MicroserviceError>cause;

        this.withCause(cause);
        return this;
    }
    
    public static wrap(error: MicroserviceError, cause: any): MicroserviceError {
        cause = MicroserviceError.unwrap(cause);

        if (cause instanceof MicroserviceError) 
            return <MicroserviceError>cause;

        error.withCause(cause);
        return error;
    }

    public static unwrap(error: any): any {
        if (error == null) return null;
        
        // Unwrapping Seneca exceptions
        if (error.code == 'act_execute' && error.orig) {
            error = error.orig;
            if (error.orig)
                error = error.orig;
        }
        
        // Unwrapping restify exceptions 
        if (error.body && !_.isEmpty(error.body))
            error = error.body;
        
        return error;
    }
    
}