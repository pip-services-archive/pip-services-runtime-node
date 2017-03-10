"use strict";
var _ = require('lodash');
var Category_1 = require('../config/Category');
var ComponentDescriptor_1 = require('../config/ComponentDescriptor');
var MicroserviceConfig_1 = require('../config/MicroserviceConfig');
var ComponentConfig_1 = require('../config/ComponentConfig');
var SenecaAddon_1 = require('../addons/SenecaAddon');
var SenecaPlugin = (function () {
    function SenecaPlugin(name, microservice) {
        this._name = name;
        this._microservice = microservice;
    }
    SenecaPlugin.prototype.build = function (seneca, config, callback) {
        var _this = this;
        // Configure microservice
        var mconfig = MicroserviceConfig_1.MicroserviceConfig.fromValue(config);
        this._microservice.setConfig(mconfig);
        // Set global seneca reference
        this._microservice.getContext().set("seneca", seneca);
        // Start with provided configuration options
        this._microservice.build(function (err) {
            if (err) {
                callback(err);
                return;
            }
            // Todo: Remove this seneca reference. Use the global one
            // Get seneca addons
            _this._seneca = _this._microservice.getComponents().getOneOptional(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Addons, 'pip-services-runtime-seneca', '*', '*'));
            // Create a new instance if it is not found
            if (_this._seneca == null) {
                _this._seneca = new SenecaAddon_1.SenecaAddon();
                _this._seneca.configure(new ComponentConfig_1.ComponentConfig());
                _this._microservice.getComponents().add(_this._seneca);
            }
            _this._seneca.setSeneca(seneca);
            callback(null);
        });
    };
    SenecaPlugin.prototype.link = function (callback) {
        this._microservice.link(callback);
    };
    SenecaPlugin.prototype.open = function (callback) {
        this._microservice.open(callback);
    };
    SenecaPlugin.prototype.close = function (callback) {
        this._microservice.close(callback);
    };
    SenecaPlugin.prototype.run = function (seneca, config) {
        var _this = this;
        // Open microservice on seneca init
        seneca.add({ init: this._name }, function (args, done) {
            // Build and initialize the plugin
            _this.build(seneca, config, function (err) {
                if (err)
                    done(err);
                else {
                    _this.link(function (err) {
                        if (err)
                            done(err);
                        else
                            _this.open(done);
                    });
                }
            });
        });
        // Close microservice on seneca close
        seneca.on('close', function () { _this.close(null); });
        return {
            name: this._name
        };
    };
    SenecaPlugin.prototype.entry = function (config) {
        var self = this;
        // Return plugin function
        return function (options) {
            var seneca = this;
            // Calling run with changed context
            return self.run.call(self, seneca, config || options);
        };
    };
    return SenecaPlugin;
}());
exports.SenecaPlugin = SenecaPlugin;
