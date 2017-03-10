"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var AbstractService_1 = require('./AbstractService');
var DynamicMap_1 = require('../portability/DynamicMap');
var UnknownError_1 = require('../errors/UnknownError');
var SenecaAddon_1 = require('../addons/SenecaAddon');
var SenecaService = (function (_super) {
    __extends(SenecaService, _super);
    function SenecaService(descriptor) {
        _super.call(this, descriptor);
    }
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
    SenecaService.prototype.link = function (context, components) {
        // Get global seneca wrapper        
        var senecaAddon = components.getOneRequired(SenecaAddon_1.SenecaAddon.Descriptor);
        // Set seneca reference    
        this._seneca = senecaAddon.getSeneca();
        // Register (add) seneca actions
        this.register();
        _super.prototype.link.call(this, context, components);
    };
    /**
     * Opens the component, performs initialization, opens connections
     * to external services and makes the component ready for operations.
     * Opening can be done multiple times: right after linking
     * or reopening after closure.
     * @param callback a callback to report success or error in opening
     */
    SenecaService.prototype.open = function (callback) {
        var _this = this;
        var endpoint = this._config.getEndpoint();
        if (endpoint == null || endpoint.getProtocol() == null) {
            _super.prototype.open.call(this, callback);
            return;
        }
        this._seneca.ready(function (err) {
            if (err) {
                callback(err);
                return;
            }
            // Launch seneca without waiting            
            var transport = {
                type: endpoint.getProtocol(),
                host: endpoint.getHost(),
                port: endpoint.getPort()
            };
            if (transport && transport.type) {
                _this.info(null, 'Seneca service started listening at ' + endpoint.getUri());
                _this._seneca.listen(transport);
            }
            // This code blocks plugin!!
            //super.open(callback);
        });
        _super.prototype.open.call(this, callback);
    };
    /**
     * Closes the component and all open connections, performs deinitialization
     * steps. Closure can only be done from opened state. Attempts to close
     * already closed component or in wrong order will cause exception.
     * @param callback a callback to report success or error in closing
     */
    SenecaService.prototype.close = function (callback) {
        _super.prototype.close.call(this, callback);
        // Close seneca listening
        // this._seneca.close((err) => {
        //     if (err) callback(err);
        //     else super.close(callback);
        // });
    };
    /**
     * Registers individual seneca action
     * @param role an action role. Usually it shall correspond to the microservice name
     * @param cmd a unique command identifier
     * @param pattern definition of action parameters
     * @param action an action callback
     */
    SenecaService.prototype.registerAction = function (role, cmd, pattern, action) {
        var _this = this;
        if (role == '')
            throw new UnknownError_1.UnknownError(this, 'NoRole', 'Missing seneca pattern role');
        if (cmd == '')
            throw new UnknownError_1.UnknownError(this, 'NoCommand', 'Missing seneca pattern cmd');
        if (action == null)
            throw new UnknownError_1.UnknownError(this, 'NoAction', 'Missing seneca action');
        if (!_.isFunction(action))
            throw new UnknownError_1.UnknownError(this, 'ActionNotFunction', 'Seneca action is not a function');
        pattern = _.clone(pattern || {});
        pattern.role = role;
        pattern.cmd = cmd;
        // Adding default parameters required for every action
        pattern.correlation_id = { type$: 'string' };
        // Hack!!! Wrapping action to preserve prototyping context
        var actionCurl = function (params, callback) { action.call(_this, params, callback); };
        this._seneca.add(pattern, actionCurl);
    };
    /**
     * Registers commands as seneca actions
     * @param role an action role. Usually it shall correspond to the microservice name
     * @param commands a list of command to register
     */
    SenecaService.prototype.registerCommands = function (role, commands) {
        if (role == '')
            throw new UnknownError_1.UnknownError(this, 'NoRole', 'Missing seneca pattern role');
        for (var i = 0; i < commands.length; i++) {
            var command = commands[i];
            // Use closure to prevent argument erasure
            var actionCurl = function (command) {
                return function (params, callback) {
                    // Get correlation id from the parameters
                    var correlationId = params.correlation_id;
                    // Cut system parameters and convert them to DynamicMap
                    var args = DynamicMap_1.DynamicMap.fromValue(_.omit(params, 'role', 'cmd', 'correlation_id'));
                    // Call the command
                    command.execute(correlationId, args, callback);
                };
            };
            var action = actionCurl(command);
            this.registerAction(role, command.getName(), {}, action);
        }
    };
    /**
     * Registers a command set as seneca actions
     * @param role an action role. Usually it shall correspond to the microservice name
     * @param commands a command set to be registered
     */
    SenecaService.prototype.registerCommandSet = function (role, commands) {
        this.registerCommands(role, commands.getCommands());
    };
    /**
     * Registration of all actions that is called after successful linking.
     * This method shall be overridden in descendant classes to make all
     * required registrations
     */
    SenecaService.prototype.register = function () { };
    return SenecaService;
}(AbstractService_1.AbstractService));
exports.SenecaService = SenecaService;
