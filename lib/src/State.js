"use strict";
/**
 * State in lifecycle of components or the entire microservice
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
(function (State) {
    /**
     * Undefined state
     */
    State[State["Undefined"] = -1] = "Undefined";
    /**
     * Initial state right after creation
     */
    State[State["Initial"] = 0] = "Initial";
    /**
     * Configuration was successfully completed
     */
    State[State["Configured"] = 1] = "Configured";
    /**
     * Links between components were successfully set
     */
    State[State["Linked"] = 2] = "Linked";
    /**
     * Ready to perform operations
     */
    State[State["Opened"] = 3] = "Opened";
    /**
     * Ready to perform operations.
     * This is a duplicate for Opened.
     */
    State[State["Ready"] = 3] = "Ready";
    /**
     * Closed but can be reopened
     */
    State[State["Closed"] = 4] = "Closed";
})(exports.State || (exports.State = {}));
var State = exports.State;
