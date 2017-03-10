let assert = require('chai').assert;

import { Converter } from '../../src/portability/Converter';

suite('Converter', ()=> {

    test('To String', () => {
        assert.equal(null, Converter.toNullableString(null));
        assert.equal('xyz', Converter.toString('xyz'));
        assert.equal('123', Converter.toString(123));
        assert.equal('true', Converter.toString(true));
        assert.equal('[object Object]', Converter.toStringWithDefault({ prop: 'xyz' }, 'xyz'));

        assert.equal('xyz', Converter.toStringWithDefault(null, 'xyz'));
    });

    test('To Boolean', () => {
        assert.isTrue(Converter.toBoolean(true));
        assert.isTrue(Converter.toBoolean(1));
        assert.isTrue(Converter.toBoolean(123));
        assert.isTrue(Converter.toBoolean('True'));
        assert.isTrue(Converter.toBoolean('yes'));
        assert.isTrue(Converter.toBoolean('1'));
        assert.isTrue(Converter.toBoolean('Y'));

        assert.isFalse(Converter.toBoolean(false));
        assert.isFalse(Converter.toBoolean(0));
        assert.isFalse(Converter.toBoolean('False'));
        assert.isFalse(Converter.toBoolean('no'));
        assert.isFalse(Converter.toBoolean('0'));
        assert.isFalse(Converter.toBoolean('N'));
        
        assert.isTrue(Converter.toBooleanWithDefault('XYZ', true));
    });
    
    test('To Integer', () => {
        assert.equal(123, Converter.toInteger(123));
        assert.equal(124, Converter.toInteger(123.456));
        assert.equal(123, Converter.toInteger('123'));
        
        assert.equal(123, Converter.toIntegerWithDefault(null, 123));
        assert.equal(0, Converter.toIntegerWithDefault(false, 123));
        assert.equal(123, Converter.toIntegerWithDefault('ABC', 123));
    });  

    test('To Long', () => {
        assert.equal(123, Converter.toLong(123));
        assert.equal(124, Converter.toLong(123.456));
        assert.equal(123, Converter.toLong('123'));
        
        assert.equal(123, Converter.toLongWithDefault(null, 123));
        assert.equal(0, Converter.toLongWithDefault(false, 123));
        assert.equal(123, Converter.toLongWithDefault('ABC', 123));
    });  

    test('To Float', () => {
        assert.equal(123, Converter.toFloat(123));
        assert.equal(123.456, Converter.toFloat(123.456));
        assert.equal(123.456, Converter.toFloat('123.456'));
        
        assert.equal(123, Converter.toFloatWithDefault(null, 123));
        assert.equal(0, Converter.toFloatWithDefault(false, 123));
        assert.equal(123, Converter.toFloatWithDefault('ABC', 123));
    });  
    
    test('To Date', () => {
        assert.equal(null, Converter.toNullableDate(null));
        assert.equal(new Date(1975, 3, 8).toString(), Converter.toDateWithDefault(null, new Date(1975, 3, 8)).toString());   
        assert.equal(new Date(1975, 3, 8).toString(), Converter.toDate(new Date(1975, 3, 8)).toString());     
        assert.equal(new Date(123456).toString(), Converter.toDate(123456).toString());
        assert.equal(new Date(1975, 3, 8).toString(), Converter.toDate('1975/04/08').toString());
        assert.equal(null, Converter.toNullableDate('XYZ'));
    });
    
    test('To Array', () => {
        let value = Converter.listToArray(null);
        assert.isArray(value);
        assert.lengthOf(value, 0);
        
        value = Converter.listToArray(123);
        assert.isArray(value);
        assert.lengthOf(value, 1);
        assert.equal(123, value[0]); 

        value = Converter.listToArray([123]);
        assert.isArray(value);
        assert.lengthOf(value, 1);
        assert.equal(123, value[0]); 
 
        value = Converter.listToArray('123');
        assert.isArray(value);
        assert.lengthOf(value, 1);
        assert.equal('123', value[0]); 

        value = Converter.listToArray('123,456');
        assert.isArray(value);
        assert.lengthOf(value, 2);
        assert.equal('123', value[0]); 
        assert.equal('456', value[1]); 
   });
    
    test('From Multistring', () => {
        assert.equal(null, Converter.fromMultiString(null));
        assert.equal('Just a text', Converter.fromMultiString('Just a text')); 
        assert.equal('English text', Converter.fromMultiString({ en: 'English text', ru: 'Russian text' })); 
        assert.equal('Russian text', Converter.fromMultiString({ en: 'English text', ru: 'Russian text' }, 'ru')); 
        assert.equal('Russian text', Converter.fromMultiString({ ru: 'Russian text', sp: 'Spanish text' })); 
    });
});