import { MicroserviceError } from './MicroserviceError';
import { ErrorCategory } from './ErrorCategory';

/**
 * Errors caused by calls to unsupported 
 * or not yet implemented functionality
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-17
 */
export class UnsupportedError extends MicroserviceError {
	constructor(...args: any[]) {
        super(
            ErrorCategory.Unsupported,
            args.length > 2 ? args[0] : null,
            args.length > 2 ? args[1] : args.length > 1 ? args[0] : null,
            args.length > 2 ? args[2] : args.length > 1 ? args[1] : args[0] 
        );
        this.withStatus(501);
	}
}
