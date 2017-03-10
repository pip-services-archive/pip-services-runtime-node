"use strict";
var LogLevel_1 = require('../LogLevel');
/**
 * Intercepter that writes trace messages for every executed command.
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-12
 */
var TracingIntercepter = (function () {
    /**
     * Creates instance of tracing intercepter
     * @param log a logger component.
     * @param verb a verb for tracing message as '<verb> <command>, ...'
     */
    function TracingIntercepter(loggers, verb) {
        this._loggers = loggers;
        this._verb = verb || "Executing";
    }
    /**
     * Gets the command name.
     * @param command the intercepted command
     * @return the command name
     */
    TracingIntercepter.prototype.getName = function (command) {
        return command.getName();
    };
    /**
     * Executes the command given specific arguments as an input.
     * @param command the intercepted command
     * @param correlationId a unique correlation/transaction id
     * @param args map with command arguments
     * @param callback a callback to return execution result or an error.
     */
    TracingIntercepter.prototype.execute = function (command, correlationId, args, callback) {
        // Write trace message about the command execution
        if (this._loggers != null) {
            var name_1 = command.getName();
            var message = this._verb + " " + name_1 + " command";
            // Output to all loggers
            for (var i = 0; i < this._loggers.length; i++)
                this._loggers[i].log(LogLevel_1.LogLevel.Trace, null, correlationId, [message]);
        }
        command.execute(correlationId, args, callback);
    };
    /**
     * Performs validation of the command arguments.
     * @param command the intercepted command
     * @param args command arguments
     * @return a list of errors or empty list if validation was successful.
     */
    TracingIntercepter.prototype.validate = function (command, args) {
        return command.validate(args);
    };
    return TracingIntercepter;
}());
exports.TracingIntercepter = TracingIntercepter;
