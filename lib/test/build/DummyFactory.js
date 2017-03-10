"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ComponentFactory_1 = require('../../src/build/ComponentFactory');
var DefaultFactory_1 = require('../../src/build/DefaultFactory');
var DummyMongoDbPersistence_1 = require('../persistence/DummyMongoDbPersistence');
var DummyFilePersistence_1 = require('../persistence/DummyFilePersistence');
var DummyMemoryPersistence_1 = require('../persistence/DummyMemoryPersistence');
var DummyController_1 = require('../logic/DummyController');
var DummyRestClient_1 = require('../clients/DummyRestClient');
var DummySenecaClient_1 = require('../clients/DummySenecaClient');
var DummyLambdaClient_1 = require('../clients/DummyLambdaClient');
var DummyRestService_1 = require('../services/DummyRestService');
var DummySenecaService_1 = require('../services/DummySenecaService');
var DummyFactory = (function (_super) {
    __extends(DummyFactory, _super);
    function DummyFactory() {
        _super.call(this, DefaultFactory_1.DefaultFactory.Instance);
        this.register(DummyFilePersistence_1.DummyFilePersistence.Descriptor, DummyFilePersistence_1.DummyFilePersistence);
        this.register(DummyMemoryPersistence_1.DummyMemoryPersistence.Descriptor, DummyMemoryPersistence_1.DummyMemoryPersistence);
        this.register(DummyMongoDbPersistence_1.DummyMongoDbPersistence.Descriptor, DummyMongoDbPersistence_1.DummyMongoDbPersistence);
        this.register(DummyController_1.DummyController.Descriptor, DummyController_1.DummyController);
        this.register(DummyRestClient_1.DummyRestClient.Descriptor, DummyRestClient_1.DummyRestClient);
        this.register(DummySenecaClient_1.DummySenecaClient.Descriptor, DummySenecaClient_1.DummySenecaClient);
        this.register(DummyLambdaClient_1.DummyLambdaClient.Descriptor, DummyLambdaClient_1.DummyLambdaClient);
        this.register(DummyRestService_1.DummyRestService.Descriptor, DummyRestService_1.DummyRestService);
        this.register(DummySenecaService_1.DummySenecaService.Descriptor, DummySenecaService_1.DummySenecaService);
    }
    DummyFactory.Instance = new DummyFactory();
    return DummyFactory;
}(ComponentFactory_1.ComponentFactory));
exports.DummyFactory = DummyFactory;
