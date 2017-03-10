"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ComponentFactory_1 = require('./ComponentFactory');
var NullLogger_1 = require('../logs/NullLogger');
var ConsoleLogger_1 = require('../logs/ConsoleLogger');
var NullCounters_1 = require('../counters/NullCounters');
var LogCounters_1 = require('../counters/LogCounters');
var NullCache_1 = require('../cache/NullCache');
var MemoryCache_1 = require('../cache/MemoryCache');
var FileBootConfig_1 = require('../boot/FileBootConfig');
var SenecaAddon_1 = require('../addons/SenecaAddon');
/**
 * Component factory that contains registrations of standard runtime components.
 * This factory is typically used as a base for microservice factories.
 *
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-06-09
 */
var DefaultFactory = (function (_super) {
    __extends(DefaultFactory, _super);
    /**
     * Creates an instance of default factory with standard runtime components
     */
    function DefaultFactory() {
        _super.call(this);
        this.register(NullLogger_1.NullLogger.Descriptor, NullLogger_1.NullLogger);
        this.register(ConsoleLogger_1.ConsoleLogger.Descriptor, ConsoleLogger_1.ConsoleLogger);
        this.register(NullCounters_1.NullCounters.Descriptor, NullCounters_1.NullCounters);
        this.register(LogCounters_1.LogCounters.Descriptor, LogCounters_1.LogCounters);
        this.register(NullCache_1.NullCache.Descriptor, NullCache_1.NullCache);
        this.register(MemoryCache_1.MemoryCache.Descriptor, MemoryCache_1.MemoryCache);
        this.register(FileBootConfig_1.FileBootConfig.Descriptor, FileBootConfig_1.FileBootConfig);
        this.register(SenecaAddon_1.SenecaAddon.Descriptor, SenecaAddon_1.SenecaAddon);
    }
    /**
     * The instance of default factory
     */
    DefaultFactory.Instance = new DefaultFactory();
    return DefaultFactory;
}(ComponentFactory_1.ComponentFactory));
exports.DefaultFactory = DefaultFactory;
