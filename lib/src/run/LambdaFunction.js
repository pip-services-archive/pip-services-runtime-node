"use strict";
var _ = require('lodash');
var DynamicMap_1 = require('../portability/DynamicMap');
var BadRequestError_1 = require('../errors/BadRequestError');
var LambdaFunction = (function () {
    function LambdaFunction(microservice) {
        this._actionMap = {};
        this._microservice = microservice;
    }
    LambdaFunction.prototype.setConfig = function (config) {
        this._microservice.setConfig(config);
    };
    LambdaFunction.prototype.loadConfig = function (configPath) {
        this._microservice.loadConfig(configPath);
    };
    LambdaFunction.prototype.loadConfigWithDefault = function (defaultConfigPath) {
        var configPath = process.argv[2] || defaultConfigPath || '../config/config.yaml';
        this._microservice.loadConfig(configPath);
    };
    LambdaFunction.prototype.link = function (context, components) {
        this.register();
    };
    /**
     * Registers individual lambda action
     * @param cmd a unique command identifier
     * @param pattern definition of action parameters
     * @param action an action callback
     */
    LambdaFunction.prototype.registerAction = function (cmd, action) {
        // Hack to prevent wrong this
        var self = this;
        var actionCurl = function (params, callback) {
            action.call(self, params, callback);
        };
        this._actionMap[cmd] = actionCurl;
    };
    /**
     * Registers commands as lambda actions
     * @param commands a list of command to register
     */
    LambdaFunction.prototype.registerCommands = function (commands) {
        for (var i = 0; i < commands.length; i++) {
            var command = commands[i];
            // Use closure to prevent argument erasure
            var actionCurl = function (command) {
                return function (params, callback) {
                    // Get correlation id from the parameters
                    var correlationId = params.correlation_id;
                    // Cut system parameters and convert them to DynamicMap
                    var args = DynamicMap_1.DynamicMap.fromValue(_.omit(params, 'cmd', 'correlation_id'));
                    // Call the command
                    command.execute(correlationId, args, callback);
                };
            };
            var action = actionCurl(command);
            this.registerAction(command.getName(), action);
        }
    };
    /**
     * Registers a command set as lambda actions
     * @param commands a command set to be registered
     */
    LambdaFunction.prototype.registerCommandSet = function (commands) {
        this.registerCommands(commands.getCommands());
    };
    LambdaFunction.prototype.register = function () { };
    LambdaFunction.prototype.execute = function (event, context) {
        var cmd = event.cmd;
        if (cmd == null) {
            var err = new BadRequestError_1.BadRequestError(this, 'NoCommand', 'Cmd parameter is missing').forComponent(this._microservice.getName());
            context.done(err, null);
            return;
        }
        var action = this._actionMap[cmd];
        if (action == null) {
            var err = new BadRequestError_1.BadRequestError(this, 'NoAction', 'Action ' + cmd + ' was not found')
                .forComponent(this._microservice.getName())
                .withDetails(cmd);
            context.done(err, null);
            return;
        }
        action(event, context.done);
    };
    LambdaFunction.prototype.handler = function (event, context) {
        var _this = this;
        // If already started then execute
        if (this._actionMap != null) {
            this.execute(event, context);
        }
        else {
            this.start(function (err) {
                if (err)
                    context.done(err, null);
                else
                    _this.execute(event, context);
            });
        }
    };
    LambdaFunction.prototype.getHandler = function () {
        var self = this;
        // Return plugin function
        return function (event, context) {
            // Calling run with changed context
            return self.handler.call(self, event, context);
        };
    };
    LambdaFunction.prototype.start = function (callback) {
        var _this = this;
        this._microservice.start(function (err) {
            if (err == null)
                _this.link(_this._microservice.getContext(), _this._microservice.getComponents());
            if (callback)
                callback(err);
        });
    };
    LambdaFunction.prototype.startWithConfig = function (config, callback) {
        var _this = this;
        this._microservice.startWithConfig(config, function (err) {
            if (err == null)
                _this.link(_this._microservice.getContext(), _this._microservice.getComponents());
            if (callback)
                callback(err);
        });
    };
    LambdaFunction.prototype.startWithConfigFile = function (configPath, callback) {
        var _this = this;
        this._microservice.startWithConfigFile(configPath, function (err) {
            if (err == null)
                _this.link(_this._microservice.getContext(), _this._microservice.getComponents());
            if (callback)
                callback(err);
        });
    };
    LambdaFunction.prototype.startWithDefaultConfig = function (defaultConfigPath, callback) {
        var configPath = process.argv[2] || defaultConfigPath || '../config/config.yaml';
        this.startWithConfigFile(configPath, callback);
    };
    LambdaFunction.prototype.stop = function (callback) {
        this._microservice.close(callback);
    };
    return LambdaFunction;
}());
exports.LambdaFunction = LambdaFunction;
