"use strict";
var IdGenerator_1 = require('../data/IdGenerator');
var UnknownError_1 = require('../errors/UnknownError');
var InterceptedCommand_1 = require('./InterceptedCommand');
/**
 * Handles command registration and execution.
 * Enables intercepters to control or modify command behavior
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-12
 */
var CommandSet = (function () {
    /**
     * Create a command set instance.
     */
    function CommandSet() {
        this._commands = [];
        this._commandsByName = {};
        this._intercepters = [];
    }
    /**
     * Get all supported commands
     * @return a list with all commands supported by component.
     */
    CommandSet.prototype.getCommands = function () {
        return this._commands;
    };
    /**
     * Find a specific command by its name.
     * @param command the command name.
     * @return an object with command name.
     */
    CommandSet.prototype.findCommand = function (command) {
        return this._commandsByName[command];
    };
    /**
     * Builds execution chain including all intercepters
     * and the specified command.
     * @param command the command to build a chain.
     */
    CommandSet.prototype.buildCommandChain = function (command) {
        var next = command;
        for (var i = this._intercepters.length - 1; i >= 0; i--) {
            next = new InterceptedCommand_1.InterceptedCommand(this._intercepters[i], next);
        }
        this._commandsByName[next.getName()] = next;
    };
    /**
     * Rebuilds execution chain for all registered commands.
     * This method is typically called when intercepters are changed.
     * Because of that it is more efficient to register intercepters
     * before registering commands (typically it will be done in abstract classes).
     * However, that performance penalty will be only once during creation time.
     */
    CommandSet.prototype.rebuildAllCommandChains = function () {
        this._commandsByName = {};
        for (var i = 0; i < this._commands.length; i++) {
            var command = this._commands[i];
            this.buildCommandChain(command);
        }
    };
    /**
     * Adds a command to the command set.
     * @param command a command instance to be added
     */
    CommandSet.prototype.addCommand = function (command) {
        this._commands.push(command);
        this.buildCommandChain(command);
    };
    /**
     * Adds a list of commands to the command set
     * @param commands a list of commands to be added
     */
    CommandSet.prototype.addCommands = function (commands) {
        for (var i = 0; i < this._commands.length; i++) {
            var command = this._commands[i];
            this.addCommand(command);
        }
    };
    /**
     * Adds commands from another command set to this one
     * @param commands a commands set to add commands from
     */
    CommandSet.prototype.addCommandSet = function (commands) {
        var crefs = commands.getCommands();
        for (var i = 0; i < crefs.length; i++) {
            var command = crefs[i];
            this.addCommand(command);
        }
    };
    /**
     * Adds intercepter to the command set.
     * @param intercepter an intercepter instance to be added.
     */
    CommandSet.prototype.addIntercepter = function (intercepter) {
        this._intercepters.push(intercepter);
        this.rebuildAllCommandChains();
    };
    /**
     * Executes the command given specific arguments as an input.
     * @param command the command name.
     * @param correlationId a unique correlation/transaction id
     * @param args map with command arguments
     * @param callback a callback to return execution result or an error.
     */
    CommandSet.prototype.execute = function (command, correlationId, args, callback) {
        // Get command and throw error if it doesn't exist
        var cref = this.findCommand(command);
        if (cref == null)
            throw new UnknownError_1.UnknownError("NoCommand", "Requested command does not exist")
                .withDetails(command);
        // Generate correlationId if it doesn't exist
        // Use short ids for now
        if (correlationId == null)
            correlationId = IdGenerator_1.IdGenerator.short();
        // Validate command arguments before execution and return the 1st found error
        var errors = cref.validate(args);
        if (errors.length > 0) {
            callback(errors[0], null);
            return;
        }
        // Execute the command.
        cref.execute(correlationId, args, callback);
    };
    /**
     * Validates command arguments.
     * @param command the command name.
     * @param args a list of command arguments.
     * @return a list of validation errors or empty list when arguments are valid.
     */
    CommandSet.prototype.validate = function (command, args) {
        var cref = this.findCommand(command);
        if (cref == null) {
            var errors = [];
            errors.push(new UnknownError_1.UnknownError("NoCommand", "Requested command does not exist")
                .withDetails(command));
            return errors;
        }
        return cref.validate(args);
    };
    return CommandSet;
}());
exports.CommandSet = CommandSet;
