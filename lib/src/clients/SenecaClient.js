"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var AbstractClient_1 = require('./AbstractClient');
var UnknownError_1 = require('../errors/UnknownError');
var SenecaAddon_1 = require('../addons/SenecaAddon');
var IdGenerator_1 = require('../data/IdGenerator');
var SenecaClient = (function (_super) {
    __extends(SenecaClient, _super);
    function SenecaClient(descriptor) {
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
    SenecaClient.prototype.link = function (context, components) {
        // Get global seneca wrapper        
        var senecaAddon = components.getOneRequired(SenecaAddon_1.SenecaAddon.Descriptor);
        // Set seneca reference    
        this._seneca = senecaAddon.getSeneca();
        _super.prototype.link.call(this, context, components);
    };
    /**
     * Opens the component, performs initialization, opens connections
     * to external services and makes the component ready for operations.
     * Opening can be done multiple times: right after linking
     * or reopening after closure.
     * @param callback a callback to report success or error in opening
     */
    SenecaClient.prototype.open = function (callback) {
        var _this = this;
        this._seneca.ready(function (err) {
            if (err) {
                callback(err);
                return;
            }
            // Connect to seneca without waiting
            // Todo: How to wait until connection is successful?
            var endpoint = _this._config.getEndpoint();
            if (endpoint && endpoint.getProtocol()) {
                _this.info(null, 'Connecting seneca service to ' + endpoint.getUri());
                var transport = {
                    type: endpoint.getProtocol(),
                    host: endpoint.getHost(),
                    port: endpoint.getPort()
                };
                // ?? Why do we need that?
                // transport.pin = {
                //     role: this._role
                // };
                _this._seneca.client(transport);
            }
            _super.prototype.open.call(_this, callback);
        });
    };
    /**
     * Closes the component and all open connections, performs deinitialization
     * steps. Closure can only be done from opened state. Attempts to close
     * already closed component or in wrong order will cause exception.
     * @param callback a callback to report success or error in closing
     */
    SenecaClient.prototype.close = function (callback) {
        _super.prototype.close.call(this, callback);
        // Close seneca listening
        // this._seneca.close((err) => {
        //     if (err) callback(err);
        //     else super.close(callback);
        // });
    };
    SenecaClient.prototype.call = function (role, cmd, correlationId, params, callback) {
        if (params === void 0) { params = {}; }
        if (role == null)
            throw new UnknownError_1.UnknownError(this, 'NoRole', 'Missing pattern role');
        if (cmd == null)
            throw new UnknownError_1.UnknownError(this, 'NoCommand', 'Missing pattern cmd');
        params = _.clone(params);
        params.role = role;
        params.cmd = cmd;
        correlationId = correlationId || IdGenerator_1.IdGenerator.short();
        params.correlation_id = correlationId;
        this._seneca.act(params, callback);
    };
    return SenecaClient;
}(AbstractClient_1.AbstractClient));
exports.SenecaClient = SenecaClient;
