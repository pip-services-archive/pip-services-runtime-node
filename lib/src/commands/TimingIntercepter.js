"use strict";
/**
 * Intercepter that times execution elapsed time.
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-12
 */
var TimingIntercepter = (function () {
    /**
     * Creates instance of timing intercepter.
     * @param counters a reference to performance counters
     * @param suffix a suffix to create a counter name as <command>.<suffix>
     */
    function TimingIntercepter(counters, suffix) {
        this._counters = counters;
        this._suffix = suffix || "ExecTime";
    }
    /**
     * Gets the command name.
     * @param command the intercepted command
     * @return the command name
     */
    TimingIntercepter.prototype.getName = function (command) {
        return command.getName();
    };
    /**
     * Executes the command given specific arguments as an input.
     * @param command the intercepted command
     * @param correlationId a unique correlation/transaction id
     * @param args map with command arguments
     * @param callback a callback to return execution result or an error.
     */
    TimingIntercepter.prototype.execute = function (command, correlationId, args, callback) {
        // Starting measuring elapsed time
        var timing = null;
        if (this._counters != null) {
            var name_1 = command.getName() + "." + this._suffix;
            timing = this._counters.beginTiming(name_1);
        }
        // Execute command
        command.execute(correlationId, args, function (err, result) {
            // Complete measuring elapsed time
            if (timing != null)
                timing.endTiming();
            // Return results through callback
            callback(err, result);
        });
    };
    /**
     * Performs validation of the command arguments.
     * @param command the intercepted command
     * @param args command arguments
     * @return a list of errors or empty list if validation was successful.
     */
    TimingIntercepter.prototype.validate = function (command, args) {
        return command.validate(args);
    };
    return TimingIntercepter;
}());
exports.TimingIntercepter = TimingIntercepter;
