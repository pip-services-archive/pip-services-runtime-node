let assert = require('chai').assert;

import { DynamicMap } from '../../src/portability/DynamicMap';

suite('DynamicMap', ()=> {

    test('Set Defaults', () => {
       let result = DynamicMap.fromValue({ value1: 123, value2: 234 });
       result = result.mergeDeep({ value2: 432, value3: 345 });  
        
       assert.equal(123, result.get("value1"));
       assert.equal(234, result.get("value2"));
       assert.equal(345, result.get("value3"));        
    });

    test('Set Defaults Recursive', () => {
       let result = DynamicMap.fromValue({ value1: 123, value2: { value21: 111, value22: 222 } });
       result = result.mergeDeep({ value2: { value22: 777, value23: 333 }, value3: 345 });
        
       assert.equal(123, result.get("value1"));
       assert.equal(345, result.get("value3"));        

       assert.equal(111, result.get("value2.value21"));
       assert.equal(222, result.get("value2.value22"));
       assert.equal(333, result.get("value2.value23"));
    });

    test('Set Defaults with Nulls', () => {
       let result = DynamicMap.fromValue({ value1: 123, value2: 234 });
       result = result.mergeDeep(null);
        
       assert.equal(123, result.get("value1"));
       assert.equal(234, result.get("value2"));
    });

    test('Get', () => {
       let config = DynamicMap.fromValue({
            value1: 123,
            value2: {
                value21: 111,
                value22: 222
            }
        });
        
       let value = config.get("");
       assert.isUndefined(value);
       
       value = config.get("value1");
       assert.equal(123, value);

       value = config.get("value2");
       assert.isDefined(value);

       value = config.get("value3");
       assert.isUndefined(value);

       value = config.get("value2.value21");
       assert.equal(111, value);

       value = config.get("value2.value31");
       assert.isUndefined(value);

       value = config.get("value2.value21.value211");
       assert.isUndefined(value);

       value = config.get("valueA.valueB.valueC");
       assert.isUndefined(value);
    });

    test('Has', () => {
       let config = DynamicMap.fromValue({
            value1: 123,
            value2: {
                value21: 111,
                value22: 222
            }
        });
        
       let has = config.has("");
       assert.isFalse(has);
       
       has = config.has("value1");
       assert.isTrue(has);

       has = config.has("value2");
       assert.isTrue(has);

       has = config.has("value3");
       assert.isFalse(has);

       has = config.has("value2.value21");
       assert.isTrue(has);

       has = config.has("value2.value31");
       assert.isFalse(has);

       has = config.has("value2.value21.value211");
       assert.isFalse(has);

       has = config.has("valueA.valueB.valueC");
       assert.isFalse(has);
    });

    test('Assign', () => {
		let value: any = {};
		let newValues = DynamicMap.fromValue({ value1: 123, value2: "ABC", value3: 456 });
		
		newValues.assignTo(value);
		assert.isNotNull(value.value1);
		assert.equal(123, value.value1);
		assert.isNotNull(value.value2);
		assert.equal("ABC", value.value2);
    });  
    
    test('Set', () => {
    	let config = new DynamicMap();
    	
    	config.set(null, 123);
    	
    	config.set("field1", 123);
    	assert.equal(123, config.get("field1"));

    	config.set("field2", "ABC");
    	assert.equal("ABC", config.get("field2"));

    	config.set("field2.field1", 123);
    	assert.equal("ABC", config.get("field2"));

    	config.set("field3.field31", 456);
    	let subConfig = config.getNullableMap("field3");
        assert.isNotNull(subConfig);
    	assert.equal(456, subConfig.get("field31"));
    	
    	config.set("field3.field32", "XYZ");
    	assert.equal("XYZ", config.get("field3.field32"));
    });
    
});