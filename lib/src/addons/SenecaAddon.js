"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Category_1 = require('../config/Category');
var ComponentDescriptor_1 = require('../config/ComponentDescriptor');
var AbstractAddon_1 = require('./AbstractAddon');
/**
 * Addon to wrap global seneca reference for all microservice components
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-16
 */
var SenecaAddon = (function (_super) {
    __extends(SenecaAddon, _super);
    /**
     * Creates and initializes instance of the microservice addon
     * @param descriptor the unique descriptor that is used to identify and locate the component.
     */
    function SenecaAddon() {
        _super.call(this, SenecaAddon.Descriptor);
    }
    /**
     * Gets reference to the global seneca instance.
     * If seneca isn't created, the method creates it.
     * @return a global reference to seneca runtime.
     */
    SenecaAddon.prototype.getSeneca = function () {
        var _this = this;
        // Initialize seneca reference
        if (this._seneca == null) {
            this._seneca = require('seneca')();
            this._seneca.error(function (err) {
                _this.error(null, err);
            });
        }
        return this._seneca;
    };
    /**
     * Sets a global seneca reference to share it across all microservice components
     * @param seneca a seneca reference
     */
    SenecaAddon.prototype.setSeneca = function (seneca) {
        this._seneca = seneca;
    };
    /**
     * Unique descriptor for the Memory Cache component
     */
    SenecaAddon.Descriptor = new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Addons, "pip-services-runtime-seneca", "*", "*");
    return SenecaAddon;
}(AbstractAddon_1.AbstractAddon));
exports.SenecaAddon = SenecaAddon;
