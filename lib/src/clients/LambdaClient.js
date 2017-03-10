"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var AbstractClient_1 = require('./AbstractClient');
var DynamicMap_1 = require('../portability/DynamicMap');
var IdGenerator_1 = require('../data/IdGenerator');
var ConfigError_1 = require('../errors/ConfigError');
var UnknownError_1 = require('../errors/UnknownError');
var CallError_1 = require('../errors/CallError');
var LambdaClient = (function (_super) {
    __extends(LambdaClient, _super);
    function LambdaClient(descriptor) {
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
    LambdaClient.prototype.configure = function (config) {
        config = config.withDefaults(LambdaClient.DefaultConfig);
        var endpoint = config.getEndpoint();
        var options = config.getOptions();
        this._protocol = endpoint.getProtocol();
        if (this._protocol != 'aws')
            throw new ConfigError_1.ConfigError(this, 'UnsupportedProtocol', 'Protocol type is not supported by Lambda transport')
                .withDetails(this._protocol);
        this._function = endpoint.getRawContent().getNullableString('function');
        if (this._function == '')
            throw new ConfigError_1.ConfigError(this, 'NoFunction', 'Function is missing in lamda transport configuration');
        this._region = endpoint.getRawContent().getNullableString('region');
        if (this._region == '')
            throw new ConfigError_1.ConfigError(this, 'NoRegion', 'Region is missing in lamda transport configuration');
        this._accessKeyId = options.getNullableString('access_key_id');
        if (this._accessKeyId == '')
            throw new ConfigError_1.ConfigError(this, 'NoAccessKeyId', 'AccessKeyId is missing in lamda transport configuration');
        this._secretAccessKey = options.getNullableString('secret_access_key');
        if (this._secretAccessKey == '')
            throw new ConfigError_1.ConfigError(this, 'NoSecretAccessKey', 'SecretAccessKey is missing  in lamda transport configuration');
        _super.prototype.configure.call(this, config);
        this._timeout = options.getInteger('timeout');
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
    LambdaClient.prototype.link = function (context, components) {
        var aws = require('aws-sdk');
        aws.config.update({
            accessKeyId: this._accessKeyId,
            secretAccessKey: this._secretAccessKey,
            region: this._region
        });
        aws.config.httpOptions = {
            timeout: this._timeout
        };
        this._lambda = new aws.Lambda();
        _super.prototype.link.call(this, context, components);
    };
    LambdaClient.prototype.invoke = function (invocationType, cmd, correlationId, args, callback) {
        var _this = this;
        args = _.clone(args);
        args.cmd = cmd;
        if (args.cmd == null)
            throw new UnknownError_1.UnknownError(this, 'NoCommand', 'Missing pattern cmd');
        correlationId = correlationId || IdGenerator_1.IdGenerator.short();
        args.correlation_id = correlationId;
        var params = {
            FunctionName: this._function,
            InvocationType: invocationType,
            LogType: 'None',
            Payload: JSON.stringify(args)
        };
        this._lambda.invoke(params, function (err, data) {
            if (callback == null) {
                if (err)
                    _this.error(null, err);
                return;
            }
            if (err) {
                err = new CallError_1.CallError(_this, 'CallFailed', 'Failed to invoke lambda function')
                    .withCause(err);
                callback(err, null);
            }
            else {
                var result = data.Payload;
                if (_.isString(result)) {
                    try {
                        result = JSON.parse(result);
                    }
                    catch (err) {
                        err = new CallError_1.CallError(_this, 'SerializationFailed', 'Failed to deserialize result')
                            .withCause(err);
                        callback(err, null);
                        return;
                    }
                }
                callback(null, result);
            }
        });
    };
    LambdaClient.prototype.call = function (cmd, correlationId, params, callback) {
        if (params === void 0) { params = {}; }
        this.invoke('RequestResponse', cmd, correlationId, params, callback);
    };
    LambdaClient.prototype.callOneWay = function (cmd, correlationId, params, callback) {
        if (params === void 0) { params = {}; }
        this.invoke('Event', cmd, correlationId, params, callback);
    };
    LambdaClient.DefaultConfig = DynamicMap_1.DynamicMap.fromTuples('endpoint.protocol', 'aws', 'endpoint.function', null, 'endpoint.region', null, 'options.access_key_id', null, 'options.secret_access_key', null, 'options.timeout', 30000);
    return LambdaClient;
}(AbstractClient_1.AbstractClient));
exports.LambdaClient = LambdaClient;
