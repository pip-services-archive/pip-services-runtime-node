import { MicroserviceError } from './MicroserviceError';
import { ErrorCategory } from './ErrorCategory';

/**
 * Errors happened during connection to remote services.
 * They can be related to misconfiguration, network issues
 * or remote service itself 
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
export class ConnectionError extends MicroserviceError {
	constructor(...args: any[]) {
        super(
            ErrorCategory.ConnectionError,
            args.length > 2 ? args[0] : null,
            args.length > 2 ? args[1] : args.length > 1 ? args[0] : null,
            args.length > 2 ? args[2] : args.length > 1 ? args[1] : args[0] 
        );
        this.withStatus(500);
	}
}
