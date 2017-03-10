import { MicroserviceError } from './MicroserviceError';
import { ErrorCategory } from './ErrorCategory';

/**
 * Errors happened during microservice build process
 * and caused by problems in component factories
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
export class BuildError extends MicroserviceError {
	constructor(...args: any[]) {
        super(
            ErrorCategory.BuildError,
            args.length > 2 ? args[0] : null,
            args.length > 2 ? args[1] : args.length > 1 ? args[0] : null,
            args.length > 2 ? args[2] : args.length > 1 ? args[1] : args[0] 
        );
        this.withStatus(500);
	}
}
