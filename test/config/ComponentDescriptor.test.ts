let async = require('async');
let assert = require('chai').assert;

import { Category } from '../../src/config/Category';
import { ComponentDescriptor } from '../../src/config/ComponentDescriptor';

suite('ComponentDescriptor', () => {
    
    test('TestMatch', (done) => {
        var descriptor = new ComponentDescriptor(Category.Controllers, "pip-services-dummies", "default", "1.0");

        // Check match by individual fields
        assert.isTrue(descriptor.match(new ComponentDescriptor(Category.Controllers, null, null, null)));
        assert.isTrue(descriptor.match(new ComponentDescriptor(Category.Controllers, "pip-services-dummies", null, null)));
        assert.isTrue(descriptor.match(new ComponentDescriptor(Category.Controllers, null, "default", null)));
        assert.isTrue(descriptor.match(new ComponentDescriptor(Category.Controllers, null, null, "1.0")));

        // Check match by individual "*" fields
        assert.isTrue(descriptor.match(new ComponentDescriptor(Category.Controllers, "*", "*", "*")));
        assert.isTrue(descriptor.match(new ComponentDescriptor(Category.Controllers, "pip-services-dummies", "*", "*")));
        assert.isTrue(descriptor.match(new ComponentDescriptor(Category.Controllers, "*", "default", "*")));
        assert.isTrue(descriptor.match(new ComponentDescriptor(Category.Controllers, "*", "*", "1.0")));

        // Check match by all values
        assert.isTrue(descriptor.match(new ComponentDescriptor(Category.Controllers, "pip-services-dummies", "default", null)));
        assert.isTrue(descriptor.match(new ComponentDescriptor(Category.Controllers, null, "default", "1.0")));
        assert.isTrue(descriptor.match(new ComponentDescriptor(Category.Controllers, "pip-services-dummies", "default", "1.0")));

        // Check match by special BusinessLogic category
        assert.isTrue(descriptor.match(new ComponentDescriptor(Category.BusinessLogic, null, null, null)));
        
        // Check mismatch by individual fields
        assert.isFalse(descriptor.match(new ComponentDescriptor(Category.Cache, null, null, null)));
        assert.isFalse(descriptor.match(new ComponentDescriptor(Category.Controllers, "pip-services-runtime", null, null)));
        assert.isFalse(descriptor.match(new ComponentDescriptor(Category.Controllers, null, "special", null)));
        assert.isFalse(descriptor.match(new ComponentDescriptor(Category.Controllers, null, null, "2.0")));

        done();
    });

    test('TestToString', (done) => {
        var descriptor1 = new ComponentDescriptor(Category.Controllers, "pip-services-dummies", "default", "1.0");		
        assert.equal("controllers:pip-services-dummies:default:1.0", descriptor1.toString());

        var descriptor2 = new ComponentDescriptor(Category.Controllers, null, null, null);
        assert.equal("controllers:*:*:*", descriptor2.toString());    

        done();
    });

});