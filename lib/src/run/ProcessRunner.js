"use strict";
var ProcessRunner = (function () {
    function ProcessRunner(microservice) {
        this._microservice = microservice;
        this._microservice.enableExitOnError();
    }
    ProcessRunner.prototype.setConfig = function (config) {
        this._microservice.setConfig(config);
    };
    ProcessRunner.prototype.loadConfig = function (configPath) {
        this._microservice.loadConfig(configPath);
    };
    ProcessRunner.prototype.loadConfigWithDefault = function (defaultConfigPath) {
        var configPath = process.argv[2] || defaultConfigPath || '../config/config.yaml';
        this._microservice.loadConfig(configPath);
    };
    ProcessRunner.prototype.captureErrors = function () {
        var _this = this;
        process.on('uncaughtException', function (err) {
            _this._microservice.exit(err);
        });
    };
    ProcessRunner.prototype.captureExit = function () {
        var _this = this;
        this._microservice.info('Press Control-C to stop the microservice...');
        process.on('SIGINT', function () {
            _this._microservice.info('Goodbye!');
            _this._microservice.exit(null);
        });
    };
    ProcessRunner.prototype.start = function (callback) {
        this.captureErrors();
        this.captureExit();
        this._microservice.start(callback);
    };
    ProcessRunner.prototype.startWithConfig = function (config, callback) {
        this.captureErrors();
        this.captureExit();
        this._microservice.startWithConfig(config, callback);
    };
    ProcessRunner.prototype.startWithConfigFile = function (configPath, callback) {
        this.captureErrors();
        this.captureExit();
        this._microservice.startWithConfigFile(configPath, callback);
    };
    ProcessRunner.prototype.startWithDefaultConfig = function (defaultConfigPath, callback) {
        var configPath = process.argv[2] || defaultConfigPath || '../config/config.yaml';
        this.startWithConfigFile(configPath, callback);
    };
    ProcessRunner.prototype.stop = function (callback) {
        this._microservice.close(callback);
    };
    return ProcessRunner;
}());
exports.ProcessRunner = ProcessRunner;
