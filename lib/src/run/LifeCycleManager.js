"use strict";
var _ = require('lodash');
var async = require('async');
var ComponentSet_1 = require('../ComponentSet');
var State_1 = require('../State');
var LogWriter_1 = require('./LogWriter');
var LifeCycleManager = (function () {
    function LifeCycleManager() {
    }
    LifeCycleManager.getState = function (components) {
        var state = State_1.State.Undefined; // Fake state
        for (var i = 0; i < components.length; i++) {
            var component = components[i];
            if (state == State_1.State.Undefined || component.getState() < state)
                state = component.getState();
        }
        return state;
    };
    LifeCycleManager.linkComponents = function (context, components, callback) {
        LifeCycleManager.link(context, new ComponentSet_1.ComponentSet(components), callback);
    };
    LifeCycleManager.link = function (context, components, callback) {
        var error = null;
        // Link all components
        try {
            var orderedList = components.getAllOrdered();
            for (var i = 0; i < orderedList.length; i++) {
                var component = orderedList[i];
                if (component.getState() == State_1.State.Configured)
                    component.link(context, components);
            }
        }
        // Capture occured error 
        catch (err) {
            error = err;
        }
        // If callback is defined then return error
        if (callback)
            callback(error);
        else if (error)
            throw error;
    };
    LifeCycleManager.linkAndOpenComponents = function (context, components, callback) {
        LifeCycleManager.linkAndOpen(context, new ComponentSet_1.ComponentSet(components), callback);
    };
    LifeCycleManager.linkAndOpen = function (context, components, callback) {
        LifeCycleManager.link(context, components, function (err) {
            if (err)
                callback(err);
            else
                LifeCycleManager.open(components, callback);
        });
    };
    LifeCycleManager.openComponents = function (components, callback) {
        var opened = [];
        async.eachSeries(components, function (component, callback) {
            if (component.getState() != State_1.State.Opened)
                component.open(function (err) {
                    if (err == null)
                        opened.push(component);
                    callback(err);
                });
            else
                callback();
        }, function (err) {
            if (err) {
                LogWriter_1.LogWriter.trace(components, 'Microservice opening failed with error ' + err);
                LifeCycleManager.forceCloseComponents(opened, function () { return callback(err); });
            }
            else
                callback(null);
        });
    };
    LifeCycleManager.open = function (components, callback) {
        LifeCycleManager.openComponents(components.getAllOrdered(), callback);
    };
    LifeCycleManager.closeComponents = function (components, callback) {
        // Close in reversed order
        components = _.reverse(components);
        // Close components on by one
        async.eachSeries(components, function (component, callback) {
            if (component.getState() == State_1.State.Opened)
                component.close(callback);
            else
                callback();
        }, function (err) {
            if (err)
                LogWriter_1.LogWriter.trace(components, 'Microservice closure failed with error ' + err);
            callback(err);
        });
    };
    LifeCycleManager.close = function (components, callback) {
        LifeCycleManager.closeComponents(components.getAllOrdered(), callback);
    };
    LifeCycleManager.forceCloseComponents = function (components, callback) {
        // Close in reversed order
        components = _.reverse(components);
        var firstError = null;
        // Close components one by one
        async.eachSeries(components, function (component, callback) {
            if (component.getState() == State_1.State.Opened)
                component.close(function (err) {
                    // Capture the error and continue
                    firstError = firstError || err;
                    callback(null);
                });
            else
                callback();
        }, function (err) {
            // Print and return the first error
            firstError = firstError || err;
            if (firstError)
                LogWriter_1.LogWriter.trace(components, 'Microservice closure failed with error ' + firstError);
            callback(firstError);
        });
    };
    LifeCycleManager.forceClose = function (components, callback) {
        LifeCycleManager.forceCloseComponents(components.getAllOrdered(), callback);
    };
    return LifeCycleManager;
}());
exports.LifeCycleManager = LifeCycleManager;
