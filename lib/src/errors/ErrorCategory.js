"use strict";
/**
 * Defines broad categories of microservice errors.
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
var ErrorCategory = (function () {
    function ErrorCategory() {
    }
    /**
     * Errors caused by programming or unexpected errors
     */
    ErrorCategory.UnknownError = "UnknownError";
    /**
     * Errors happened during microservice build process
     * and caused by problems in component factories
     */
    ErrorCategory.BuildError = "BuildError";
    /**
     * Errors related to mistakes in microservice
     * user-defined configuration
     */
    ErrorCategory.ConfigError = "ConfigError";
    /**
     * Errors related to operations called in wrong component state.
     * For instance, business calls when component is not ready
     */
    ErrorCategory.StateError = "StateError";
    /**
     * Errors happened during connection to remote services.
     * They can be related to misconfiguration, network issues
     * or remote service itself
     */
    ErrorCategory.ConnectionError = "ConnectionError";
    /**
     * Errors returned by remote services or network
     * during call attempts
     */
    ErrorCategory.CallError = "CallError";
    /**
     * Errors in read/write file operations
     */
    ErrorCategory.FileError = "FileError";
    /**
     * Errors due to improper user requests, like
     * missing or wrong parameters
     */
    ErrorCategory.BadRequest = "BadRequest";
    /**
     * Access errors caused by missing user identity
     * or security permissions
     */
    ErrorCategory.Unauthorized = "Unauthorized";
    /**
     * Error caused by attempt to access missing object
     */
    ErrorCategory.NotFound = "NotFound";
    /**
     * Errors raised by conflict in object versions
     * posted by user and stored on server.
     */
    ErrorCategory.Conflict = "Conflict";
    /**
     * Errors caused by calls to unsupported
     * or not yet implemented functionality
     */
    ErrorCategory.Unsupported = "Unsupported";
    return ErrorCategory;
}());
exports.ErrorCategory = ErrorCategory;
