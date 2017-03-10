"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var AbstractService_1 = require('./AbstractService');
var DynamicMap_1 = require('../portability/DynamicMap');
var State_1 = require('../State');
var ResponseSender_1 = require('./ResponseSender');
var ConfigError_1 = require('../errors/ConfigError');
var ConnectionError_1 = require('../errors/ConnectionError');
/**
 * Interoperable REST service that exposes a specific version of
 * a microservice API via HTTP/HTTPS endpoint to consumers.
 *
 * This implementation uses restify library to define RESTful API.
 * Authors of specific REST services must register in descendant classes
 * API routes using <b>registerRoute</b> in overriden <b>link</b>
 * or <b/>register</b> methods.
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-06
 */
var RestService = (function (_super) {
    __extends(RestService, _super);
    /**
     * Creates instance of abstract REST service.
     * @param descriptor the unique descriptor that is used to identify and locate the component.
     */
    function RestService(descriptor) {
        _super.call(this, descriptor);
    }
    /**
     * Sets component configuration parameters and switches component
     * to 'Configured' state. The configuration is only allowed once
     * right after creation. Attempts to perform reconfiguration will
     * cause an exception.
     * @param config the component configuration parameters.
     * @throws MicroserviceError when component is in illegal state
     * or configuration validation fails.
     */
    RestService.prototype.configure = function (config) {
        this.checkNewStateAllowed(State_1.State.Configured);
        config = config.withDefaults(RestService.DefaultConfig);
        var endpoint = config.getEndpoint();
        if (endpoint == null)
            throw new ConfigError_1.ConfigError(this, 'NoEndpoint', 'Endpoint is not configured');
        var protocol = endpoint.getProtocol();
        if (protocol != 'http')
            throw new ConfigError_1.ConfigError(this, 'UnsupportedProtocol', protocol + ' protocol is not supported by REST transport')
                .withDetails(protocol);
        if (endpoint.getPort() == null)
            throw new ConfigError_1.ConfigError(this, 'NoPort', 'No port is configured in REST transport');
        _super.prototype.configure.call(this, config);
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
    RestService.prototype.link = function (context, components) {
        this.checkNewStateAllowed(State_1.State.Linked);
        // Create instance of express application   
        var restify = require('restify');
        var options = this._config.getOptions();
        this._server = restify.createServer({}); // options);
        // Configure express application
        this._server.use(restify.acceptParser(this._server.acceptable));
        //this._server.use(restify.authorizationParser());
        this._server.use(restify.CORS());
        this._server.use(restify.dateParser());
        this._server.use(restify.queryParser());
        this._server.use(restify.jsonp());
        this._server.use(restify.gzipResponse());
        this._server.use(restify.bodyParser());
        //this._server.use(restify.requestExpiry());
        if (options.get("throttle") != null)
            this._server.use(restify.throttle(options.get("throttle")));
        this._server.use(restify.conditionalRequest());
        // Register (add) express routes
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
    RestService.prototype.open = function (callback) {
        var _this = this;
        this.checkNewStateAllowed(State_1.State.Opened);
        var endpoint = this._config.getEndpoint();
        this._server.listen(endpoint.getPort(), endpoint.getHost(), function (err) {
            if (err == null) {
                _this.info(null, 'REST service started listening at ' + endpoint.getUri());
                _super.prototype.open.call(_this, callback);
            }
            else {
                err = new ConnectionError_1.ConnectionError(_this, 'ConnectFailed', 'Opening REST service failed', err);
                callback(err);
            }
        });
    };
    /**
     * Closes the component and all open connections, performs deinitialization
     * steps. Closure can only be done from opened state. Attempts to close
     * already closed component or in wrong order will cause exception.
     * @param callback a callback to report success or error in closing
     */
    RestService.prototype.close = function (callback) {
        this.checkNewStateAllowed(State_1.State.Closed);
        if (this._server == null) {
            _super.prototype.close.call(this, callback);
            return;
        }
        // Todo: callback is not fired        
        // this._server.close((err) => {
        //     this._server = null; // Shall we loose reference when error happen?
        //     callback(err); 
        // });
        this._server.close();
        this._server = null;
        callback(null);
    };
    /**
     * Sends results with 200 status codes
     * and <b>nulls</b> with 404 statuses.
     * @param req a request object
     * @param res a response object
     *
     */
    RestService.prototype.sendResult = function (req, res) {
        return ResponseSender_1.ResponseSender.sendResult(req, res);
    };
    RestService.prototype.sendCreatedResult = function (req, res) {
        return ResponseSender_1.ResponseSender.sendCreatedResult(req, res);
    };
    RestService.prototype.sendDeletedResult = function (req, res) {
        return ResponseSender_1.ResponseSender.sendDeletedResult(req, res);
    };
    RestService.prototype.sendError = function (req, res, error) {
        ResponseSender_1.ResponseSender.sendError(req, res, error);
    };
    RestService.prototype.registerRoute = function (method, route, handler, intercept) {
        method = method.toLowerCase();
        if (method == 'delete')
            method = 'del';
        // Wrapping to preserve "this"
        var self = this;
        if (intercept) {
            this._server[method](route, function (req, res, next) {
                return intercept.call(self, req, res, next);
            }, function (req, res, next) {
                handler.call(self, req, res);
                return next();
            });
        }
        else {
            this._server[method](route, function (req, res, next) {
                handler.call(self, req, res);
                return next();
            });
        }
    };
    RestService.prototype.register = function () { };
    RestService.DefaultConfig = DynamicMap_1.DynamicMap.fromTuples("endpoint.protocol", "http", "endpoint.host", "0.0.0.0", 
    //"endpoint.port", 3000,
    "options.request_max_size", 1024 * 1024, "options.connect_timeout", 60000, "options.debug", true);
    return RestService;
}(AbstractService_1.AbstractService));
exports.RestService = RestService;
