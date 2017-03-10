import { MicroserviceError } from './MicroserviceError';
import { ErrorCategory } from './ErrorCategory';

/**
 * Errors in read/write file operations
 * 
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
export class FileError extends MicroserviceError {
	constructor(...args: any[]) {
        super(
            ErrorCategory.FileError,
            args.length > 2 ? args[0] : null,
            args.length > 2 ? args[1] : args.length > 1 ? args[0] : null,
            args.length > 2 ? args[2] : args.length > 1 ? args[1] : args[0] 
        );
        this.withStatus(500);
	}
}
