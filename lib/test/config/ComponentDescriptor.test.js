"use strict";
var async = require('async');
var assert = require('chai').assert;
var Category_1 = require('../../src/config/Category');
var ComponentDescriptor_1 = require('../../src/config/ComponentDescriptor');
suite('ComponentDescriptor', function () {
    test('TestMatch', function (done) {
        var descriptor = new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Controllers, "pip-services-dummies", "default", "1.0");
        // Check match by individual fields
        assert.isTrue(descriptor.match(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Controllers, null, null, null)));
        assert.isTrue(descriptor.match(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Controllers, "pip-services-dummies", null, null)));
        assert.isTrue(descriptor.match(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Controllers, null, "default", null)));
        assert.isTrue(descriptor.match(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Controllers, null, null, "1.0")));
        // Check match by individual "*" fields
        assert.isTrue(descriptor.match(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Controllers, "*", "*", "*")));
        assert.isTrue(descriptor.match(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Controllers, "pip-services-dummies", "*", "*")));
        assert.isTrue(descriptor.match(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Controllers, "*", "default", "*")));
        assert.isTrue(descriptor.match(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Controllers, "*", "*", "1.0")));
        // Check match by all values
        assert.isTrue(descriptor.match(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Controllers, "pip-services-dummies", "default", null)));
        assert.isTrue(descriptor.match(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Controllers, null, "default", "1.0")));
        assert.isTrue(descriptor.match(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Controllers, "pip-services-dummies", "default", "1.0")));
        // Check match by special BusinessLogic category
        assert.isTrue(descriptor.match(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.BusinessLogic, null, null, null)));
        // Check mismatch by individual fields
        assert.isFalse(descriptor.match(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Cache, null, null, null)));
        assert.isFalse(descriptor.match(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Controllers, "pip-services-runtime", null, null)));
        assert.isFalse(descriptor.match(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Controllers, null, "special", null)));
        assert.isFalse(descriptor.match(new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Controllers, null, null, "2.0")));
        done();
    });
    test('TestToString', function (done) {
        var descriptor1 = new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Controllers, "pip-services-dummies", "default", "1.0");
        assert.equal("controllers:pip-services-dummies:default:1.0", descriptor1.toString());
        var descriptor2 = new ComponentDescriptor_1.ComponentDescriptor(Category_1.Category.Controllers, null, null, null);
        assert.equal("controllers:*:*:*", descriptor2.toString());
        done();
    });
});
