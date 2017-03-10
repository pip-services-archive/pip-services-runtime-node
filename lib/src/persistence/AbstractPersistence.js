"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractComponent_1 = require('../AbstractComponent');
var IdGenerator_1 = require('../data/IdGenerator');
/**
 * Abstract implementation of microservice persistence components
 * that store and retrieve persistent data.
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-05-01
 */
var AbstractPersistence = (function (_super) {
    __extends(AbstractPersistence, _super);
    /**
     * Creates instance of abstract persistence component.
     * @param descriptor the unique descriptor that is used to identify and locate the component.
     */
    function AbstractPersistence(descriptor) {
        _super.call(this, descriptor);
    }
    /**
     * Generates globally unique string GUID to identify stored object.
     * Usage of string GUIDs for object ids is one of the key Pip.Services
     * patterns that helps to ensure portability across all persistence storages
     * and language implementations.
     * @return a globally unique GUID
     */
    AbstractPersistence.prototype.createUuid = function () {
        return IdGenerator_1.IdGenerator.uuid();
    };
    /**
     * Clears persistence storage. This method shall only be used in testing
     * and shall never be called in production.
     * @throws MicroserviceError when clearing has some problems.
     */
    AbstractPersistence.prototype.clearTestData = function (callback) {
        if (callback)
            callback(null);
    };
    return AbstractPersistence;
}(AbstractComponent_1.AbstractComponent));
exports.AbstractPersistence = AbstractPersistence;
