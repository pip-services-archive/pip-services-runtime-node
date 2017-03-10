"use strict";
/**
 * Interceptor wrapper to turn it into stackable command
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-12
 */
var InterceptedCommand = (function () {
    /**
     * Creates instance of intercepted command by chaining
     * intercepter with the next intercepter in the chain
     * or command at the end of the chain.
     * @param intercepter the intercepter reference.
     * @param next the next intercepter or command in the chain.
     */
    function InterceptedCommand(intercepter, next) {
        this._intercepter = intercepter;
        this._next = next;
    }
    /**
     * Gets the command name.
     * @return the command name
     */
    InterceptedCommand.prototype.getName = function () {
        return this._intercepter.getName(this._next);
    };
    /**
     * Executes the command given specific arguments as an input.
     * @param correlationId a unique correlation/transaction id
     * @param args map with command arguments
     * @param callback a callback to return execution result or an error.
     */
    InterceptedCommand.prototype.execute = function (correlationId, args, callback) {
        this._intercepter.execute(this._next, correlationId, args, callback);
    };
    /**
     * Performs validation of the command arguments.
     * @param args command arguments
     * @return a list of errors or empty list if validation was successful.
     */
    InterceptedCommand.prototype.validate = function (args) {
        return this._intercepter.validate(this._next, args);
    };
    return InterceptedCommand;
}());
exports.InterceptedCommand = InterceptedCommand;
