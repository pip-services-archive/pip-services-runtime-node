"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractComponent_1 = require('../AbstractComponent');
var CommandSet_1 = require('../commands/CommandSet');
/**
 * Abstract implementation for all microservice business logic components
 * that are able to perform business functions (commands).
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-12
 */
var AbstractBusinessLogic = (function (_super) {
    __extends(AbstractBusinessLogic, _super);
    /**
     * Creates instance of abstract functional component
     * @param descriptor the unique descriptor that is used to identify and locate the component.
     */
    function AbstractBusinessLogic(descriptor) {
        _super.call(this, descriptor);
        this._commands = new CommandSet_1.CommandSet();
    }
    /**
     * Get all supported commands
     * @return a list with all commands supported by component.
     */
    AbstractBusinessLogic.prototype.getCommands = function () {
        return this._commands.getCommands();
    };
    /**
     * Find a specific command by its name.
     * @param command the command name.
     * @return an object with command name.
     */
    AbstractBusinessLogic.prototype.findCommand = function (command) {
        return this._commands.findCommand(command);
    };
    /**
     * Adds a command to the command set.
     * @param command a command instance to be added
     */
    AbstractBusinessLogic.prototype.addCommand = function (command) {
        this._commands.addCommand(command);
    };
    /**
     * Adds commands from another command set to this one.
     * @param commands a command set that contains commands to be added
     */
    AbstractBusinessLogic.prototype.addCommandSet = function (commands) {
        this._commands.addCommandSet(commands);
    };
    /**
     * Delegates all commands to another functional component.
     * @param component a functional component to perform delegated commands.
     */
    AbstractBusinessLogic.prototype.delegateCommands = function (component) {
        this._commands.addCommands(component.getCommands());
    };
    /**
     * Adds intercepter to the command set.
     * @param interceptor an intercepter instance to be added.
     */
    AbstractBusinessLogic.prototype.addIntercepter = function (intercepter) {
        this._commands.addIntercepter(intercepter);
    };
    /**
     * Execute command by its name with specified arguments.
     * @param command the command name.
     * @param correlationId a unique correlation/transaction id
     * @param args a list of command arguments.
     * @param callback callback function that is called
     * with execution error or result
     * @throws MicroserviceError when execution fails for any reason.
     */
    AbstractBusinessLogic.prototype.execute = function (command, correlationId, args, callback) {
        this._commands.execute(command, correlationId, args, callback);
    };
    /**
     * Validates command arguments.
     * @param command the command name.
     * @param args a list of command arguments.
     * @return a list of validation errors or empty list when arguments are valid.
     */
    AbstractBusinessLogic.prototype.validate = function (command, args) {
        return this._commands.validate(command, args);
    };
    return AbstractBusinessLogic;
}(AbstractComponent_1.AbstractComponent));
exports.AbstractBusinessLogic = AbstractBusinessLogic;
