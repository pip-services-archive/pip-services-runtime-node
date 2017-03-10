"use strict";
var DynamicMap_1 = require('./portability/DynamicMap');
var Category_1 = require('./config/Category');
var ComponentDescriptor_1 = require('./config/ComponentDescriptor');
var ComponentConfig_1 = require('./config/ComponentConfig');
var StateError_1 = require('./errors/StateError');
var ComponentSet_1 = require('./ComponentSet');
var State_1 = require('./State');
var LogLevel_1 = require('./LogLevel');
/**
 * Abstract implementation for all microservice components.
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
var AbstractComponent = (function () {
    /**
     * Creates and initializes the component instance
     * @param descriptor the unique descriptor that is used to identify and locate the component.
     */
    function AbstractComponent(descriptor) {
        this._state = State_1.State.Initial;
        this._loggers = [];
        this._descriptor = descriptor;
    }
    /**
     * Gets the unique component descriptor that can identify
     * and locate the component inside the microservice.
     * @return the unique component descriptor.
     */
    AbstractComponent.prototype.getDescriptor = function () {
        return this._descriptor;
    };
    /* Life cycle management */
    /**
     * Gets the current state of the component.
     * @return the current component state.
     */
    AbstractComponent.prototype.getState = function () {
        return this._state;
    };
    /**
     * Checks if specified state matches to the current one.
     * @param state the expected state
     * @throws MicroserviceError when current and expected states don't match
     */
    AbstractComponent.prototype.checkCurrentState = function (state) {
        if (this._state != state)
            throw new StateError_1.StateError(this, "InvalidState", "Component is in wrong state")
                .withDetails(this._state, state);
    };
    /**
     * Checks if transition to the specified state is allowed from the current one.
     * @param newState the new state to make transition
     * @throws MicroserviceError when transition is not allowed.
     */
    AbstractComponent.prototype.checkNewStateAllowed = function (newState) {
        if (newState == State_1.State.Configured && this._state != State_1.State.Initial)
            throw new StateError_1.StateError(this, "InvalidState", "Component cannot be configured")
                .withDetails(this._state, State_1.State.Configured);
        if (newState == State_1.State.Linked && this._state != State_1.State.Configured)
            throw new StateError_1.StateError(this, "InvalidState", "Component cannot be linked")
                .withDetails(this._state, State_1.State.Linked);
        if (newState == State_1.State.Opened && this._state != State_1.State.Linked && this._state != State_1.State.Closed)
            throw new StateError_1.StateError(this, "InvalidState", "Component cannot be opened")
                .withDetails(this._state, State_1.State.Opened);
        if (newState == State_1.State.Closed && this._state != State_1.State.Opened)
            throw new StateError_1.StateError(this, "InvalidState", "Component cannot be closed")
                .withDetails(this._state, State_1.State.Closed);
    };
    /**
     * Sets component configuration parameters and switches component
     * to 'Configured' state. The configuration is only allowed once
     * right after creation. Attempts to perform reconfiguration will
     * cause an exception.
     * @param config the component configuration parameters.
     * @throws MicroserviceError when component is in illegal state
     * or configuration validation fails.
     */
    AbstractComponent.prototype.configure = function (config) {
        this.checkNewStateAllowed(State_1.State.Configured);
        this._config = config;
        this._state = State_1.State.Configured;
    };
    /**
     * Skips configuration step. Usually this method is used in testing.
     */
    AbstractComponent.prototype.skipConfigure = function () {
        this.configure(new ComponentConfig_1.ComponentConfig());
    };
    /**
     * Sets references to other microservice components to enable their
     * collaboration. It is recommended to locate necessary components
     * and cache their references to void performance hit during
     * normal operations.
     * Linking can only be performed once after configuration
     * and will cause an exception when it is called second time
     * or out of order.
     * @param context application context
     * @param components references to microservice components.
     * @throws MicroserviceError when requires components are not found.
     */
    AbstractComponent.prototype.link = function (context, components) {
        this.checkNewStateAllowed(State_1.State.Linked);
        // Get reference to discovery component
        this._discovery = components.getOneOptional(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Discovery, '*', '*', '*'));
        // Get reference to logger(s)
        this._loggers = components.getAllOptional(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Logs, '*', '*', '*'));
        // Get reference to counters component
        this._counters = components.getOneOptional(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Counters, '*', '*', '*'));
        this._state = State_1.State.Linked;
    };
    /**
     * Skips link step. Usually this method is used in testing.
     */
    AbstractComponent.prototype.skipLink = function () {
        this.link(new DynamicMap_1.DynamicMap(), new ComponentSet_1.ComponentSet());
    };
    /**
     * Opens the component, performs initialization, opens connections
     * to external services and makes the component ready for operations.
     * Opening can be done multiple times: right after linking
     * or reopening after closure.
     * @param callback a callback to report success or error in opening
     */
    AbstractComponent.prototype.open = function (callback) {
        this.checkNewStateAllowed(State_1.State.Opened);
        this._state = State_1.State.Opened;
        this.trace(null, "Component " + this._descriptor.toString() + " opened");
        callback(null);
    };
    /**
     * Closes the component and all open connections, performs deinitialization
     * steps. Closure can only be done from opened state. Attempts to close
     * already closed component or in wrong order will cause exception.
     * @param callback a callback to report success or error in closing
     */
    AbstractComponent.prototype.close = function (callback) {
        this.checkNewStateAllowed(State_1.State.Closed);
        this._state = State_1.State.Closed;
        this.trace(null, "Component " + this._descriptor.toString() + " closed");
        callback(null);
    };
    /* Logging */
    /**
     * Writes message to log
     * @param correlationId a unique id to identify distributed transacton
     * @param message a message objects
     */
    AbstractComponent.prototype.writeLog = function (level, correlationId, message) {
        if (this._loggers == null || this._loggers.length == 0)
            return;
        var component = this._descriptor.toString();
        for (var i = 0; i < this._loggers.length; i++) {
            var logger = this._loggers[i];
            logger.log(level, component, correlationId, message);
        }
    };
    /**
     * Logs fatal error that causes microservice to shutdown
     * @param correlationId a unique id to identify distributed transaction
     * @param message a list with message values
     */
    AbstractComponent.prototype.fatal = function (correlationId) {
        var message = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            message[_i - 1] = arguments[_i];
        }
        this.writeLog(LogLevel_1.LogLevel.Fatal, correlationId, message);
    };
    /**
     * Logs recoverable error
     * @param correlationId a unique id to identify distributed transaction
     * @param message a list with message values
     */
    AbstractComponent.prototype.error = function (correlationId) {
        var message = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            message[_i - 1] = arguments[_i];
        }
        this.writeLog(LogLevel_1.LogLevel.Error, correlationId, message);
    };
    /**
     * Logs warning messages
     * @param correlationId a unique id to identify distributed transaction
     * @param message a list with message values
     */
    AbstractComponent.prototype.warn = function (correlationId) {
        var message = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            message[_i - 1] = arguments[_i];
        }
        this.writeLog(LogLevel_1.LogLevel.Warn, correlationId, message);
    };
    /**
     * Logs important information message
     * @param message a list with message values
     */
    AbstractComponent.prototype.info = function (correlationId) {
        var message = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            message[_i - 1] = arguments[_i];
        }
        this.writeLog(LogLevel_1.LogLevel.Info, correlationId, message);
    };
    /**
     * Logs high-level debugging messages
     * @param correlationId a unique id to identify distributed transaction
     * @param message a list with message values
     */
    AbstractComponent.prototype.debug = function (correlationId) {
        var message = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            message[_i - 1] = arguments[_i];
        }
        this.writeLog(LogLevel_1.LogLevel.Debug, correlationId, message);
    };
    /**
     * Logs fine-granular debugging message
     * @param correlationId a unique id to identify distributed transaction
     * @param message a list with message values
     */
    AbstractComponent.prototype.trace = function (correlationId) {
        var message = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            message[_i - 1] = arguments[_i];
        }
        this.writeLog(LogLevel_1.LogLevel.Trace, correlationId, message);
    };
    /* Performance monitoring */
    /**
     * Starts measurement of execution time interval.
     * The method returns ITiming object that provides endTiming()
     * method that shall be called when execution is completed
     * to calculate elapsed time and update the counter.
     * @param name the name of interval counter.
     * @return callback interface with endTiming() method
     * that shall be called at the end of execution.
     */
    AbstractComponent.prototype.beginTiming = function (name) {
        if (this._counters)
            return this._counters.beginTiming(name);
        else
            return { endTiming: function () { } };
    };
    /**
     * Calculates rolling statistics: minimum, maximum, average
     * and updates Statistics counter.
     * This counter can be used to measure various non-functional
     * characteristics, such as amount stored or transmitted data,
     * customer feedback, etc.
     * @param name the name of statistics counter.
     * @param value the value to add to statistics calculations.
     */
    AbstractComponent.prototype.stats = function (name, value) {
        if (this._counters)
            this._counters.stats(name, value);
    };
    /**
     * Records the last reported value.
     * This counter can be used to store performance values reported
     * by clients or current numeric characteristics such as number
     * of values stored in cache.
     * @param name the name of last value counter
     * @param value the value to be stored as the last one
     */
    AbstractComponent.prototype.last = function (name, value) {
        if (this._counters)
            this._counters.last(name, value);
    };
    /**
     * Records the current time.
     * This counter can be used to track timing of key
     * business transactions.
     * @param name the name of timing counter
     */
    AbstractComponent.prototype.timestampNow = function (name) {
        this.timestamp(name, new Date());
    };
    /**
     * Records specified time.
     * This counter can be used to tack timing of key
     * business transactions as reported by clients.
     * @param name the name of timing counter.
     * @param value the reported timing to be recorded.
     */
    AbstractComponent.prototype.timestamp = function (name, value) {
        if (this._counters)
            this._counters.timestamp(name, value);
    };
    /**
     * Increments counter by value of 1.
     * This counter is often used to calculate
     * number of client calls or performed transactions.
     * @param name the name of counter counter.
     */
    AbstractComponent.prototype.incrementOne = function (name) {
        this.increment(name, 1);
    };
    /**
     * Increments counter by specified value.
     * This counter can be used to track various
     * numeric characteristics
     * @param name the name of the increment value.
     * @param value number to increase the counter.
     */
    AbstractComponent.prototype.increment = function (name, value) {
        if (this._counters)
            this._counters.increment(name, value);
    };
    /**** Utility Methods ******/
    /**
     * Generates a string representation for this component
     * @return a component descriptor in string format
     */
    AbstractComponent.prototype.toString = function () {
        return this._descriptor.toString();
    };
    return AbstractComponent;
}());
exports.AbstractComponent = AbstractComponent;
