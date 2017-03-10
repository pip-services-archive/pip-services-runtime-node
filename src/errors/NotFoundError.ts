import { MicroserviceError } from './MicroserviceError';
import { ErrorCategory } from './ErrorCategory';

/**
 * Error caused by attempt to access missing object
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
export class NotFoundError extends MicroserviceError {
	constructor(...args: any[]) {
        super(
            ErrorCategory.NotFound,
            args.length > 2 ? args[0] : null,
            args.length > 2 ? args[1] : args.length > 1 ? args[0] : null,
            args.length > 2 ? args[2] : args.length > 1 ? args[1] : args[0] 
        );
        this.withStatus(404);
	}
}
