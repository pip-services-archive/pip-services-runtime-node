"use strict";
var UnknownError_1 = require('../errors/UnknownError');
/**
 * Events to receive notifications on command execution results and failures.
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-13
 */
var Event = (function () {
    /**
     * Creates a command instance
     * @param component a component this command belongs to
     * @param name the name of the command
     * @param schema a validation schema for command arguments
     * @param function an execution function to be wrapped into this command.
     */
    function Event(component, name) {
        this._listeners = [];
        if (name == null)
            throw new Error("Command name is not set");
        this._component = component;
        this._name = name;
    }
    /**
     * Gets the event name.
     * @return the event name
     */
    Event.prototype.getName = function () {
        return this._name;
    };
    /**
     * Gets the listeners that receive notifications for this event
     */
    Event.prototype.getListeners = function () {
        return this._listeners;
    };
    /**
     * Adds listener to receive notifications
     * @param name a listener reference to be added
     */
    Event.prototype.addListener = function (listener) {
        this._listeners.push(listener);
    };
    /**
     * Removes a listener for event notifications
     * @param listener a listener reference to be removed
     */
    Event.prototype.removeListener = function (listener) {
        var index = this._listeners.indexOf(listener);
        if (index >= 0)
            this._listeners.splice(index, 1);
    };
    /**
     * Notifies all listeners about the event
     * @param correlatonId a nique correlation/transacton id
     * @param value an event value
     */
    Event.prototype.notify = function (correlationId, value) {
        for (var index = 0; index < this._listeners.length; index++) {
            var listener = this._listeners[index];
            try {
                listener.onEvent(this, correlationId, value);
            }
            catch (ex) {
                // Wrap the error
                var error = new UnknownError_1.UnknownError(this._component, "EventFailed", "Rasing event " + this._name + " failed: " + ex)
                    .withDetails(this._name)
                    .withCorrelationId(correlationId)
                    .wrap(ex);
                // Output the error
                var component = this._component;
                if (component != null) {
                    component.error(correlationId, error);
                }
            }
        }
    };
    return Event;
}());
exports.Event = Event;
