"use strict";
var assert = require('chai').assert;
var Converter_1 = require('../../src/portability/Converter');
suite('Converter', function () {
    test('To String', function () {
        assert.equal(null, Converter_1.Converter.toNullableString(null));
        assert.equal('xyz', Converter_1.Converter.toString('xyz'));
        assert.equal('123', Converter_1.Converter.toString(123));
        assert.equal('true', Converter_1.Converter.toString(true));
        assert.equal('[object Object]', Converter_1.Converter.toStringWithDefault({ prop: 'xyz' }, 'xyz'));
        assert.equal('xyz', Converter_1.Converter.toStringWithDefault(null, 'xyz'));
    });
    test('To Boolean', function () {
        assert.isTrue(Converter_1.Converter.toBoolean(true));
        assert.isTrue(Converter_1.Converter.toBoolean(1));
        assert.isTrue(Converter_1.Converter.toBoolean(123));
        assert.isTrue(Converter_1.Converter.toBoolean('True'));
        assert.isTrue(Converter_1.Converter.toBoolean('yes'));
        assert.isTrue(Converter_1.Converter.toBoolean('1'));
        assert.isTrue(Converter_1.Converter.toBoolean('Y'));
        assert.isFalse(Converter_1.Converter.toBoolean(false));
        assert.isFalse(Converter_1.Converter.toBoolean(0));
        assert.isFalse(Converter_1.Converter.toBoolean('False'));
        assert.isFalse(Converter_1.Converter.toBoolean('no'));
        assert.isFalse(Converter_1.Converter.toBoolean('0'));
        assert.isFalse(Converter_1.Converter.toBoolean('N'));
        assert.isTrue(Converter_1.Converter.toBooleanWithDefault('XYZ', true));
    });
    test('To Integer', function () {
        assert.equal(123, Converter_1.Converter.toInteger(123));
        assert.equal(124, Converter_1.Converter.toInteger(123.456));
        assert.equal(123, Converter_1.Converter.toInteger('123'));
        assert.equal(123, Converter_1.Converter.toIntegerWithDefault(null, 123));
        assert.equal(0, Converter_1.Converter.toIntegerWithDefault(false, 123));
        assert.equal(123, Converter_1.Converter.toIntegerWithDefault('ABC', 123));
    });
    test('To Long', function () {
        assert.equal(123, Converter_1.Converter.toLong(123));
        assert.equal(124, Converter_1.Converter.toLong(123.456));
        assert.equal(123, Converter_1.Converter.toLong('123'));
        assert.equal(123, Converter_1.Converter.toLongWithDefault(null, 123));
        assert.equal(0, Converter_1.Converter.toLongWithDefault(false, 123));
        assert.equal(123, Converter_1.Converter.toLongWithDefault('ABC', 123));
    });
    test('To Float', function () {
        assert.equal(123, Converter_1.Converter.toFloat(123));
        assert.equal(123.456, Converter_1.Converter.toFloat(123.456));
        assert.equal(123.456, Converter_1.Converter.toFloat('123.456'));
        assert.equal(123, Converter_1.Converter.toFloatWithDefault(null, 123));
        assert.equal(0, Converter_1.Converter.toFloatWithDefault(false, 123));
        assert.equal(123, Converter_1.Converter.toFloatWithDefault('ABC', 123));
    });
    test('To Date', function () {
        assert.equal(null, Converter_1.Converter.toNullableDate(null));
        assert.equal(new Date(1975, 3, 8).toString(), Converter_1.Converter.toDateWithDefault(null, new Date(1975, 3, 8)).toString());
        assert.equal(new Date(1975, 3, 8).toString(), Converter_1.Converter.toDate(new Date(1975, 3, 8)).toString());
        assert.equal(new Date(123456).toString(), Converter_1.Converter.toDate(123456).toString());
        assert.equal(new Date(1975, 3, 8).toString(), Converter_1.Converter.toDate('1975/04/08').toString());
        assert.equal(null, Converter_1.Converter.toNullableDate('XYZ'));
    });
    test('To Array', function () {
        var value = Converter_1.Converter.listToArray(null);
        assert.isArray(value);
        assert.lengthOf(value, 0);
        value = Converter_1.Converter.listToArray(123);
        assert.isArray(value);
        assert.lengthOf(value, 1);
        assert.equal(123, value[0]);
        value = Converter_1.Converter.listToArray([123]);
        assert.isArray(value);
        assert.lengthOf(value, 1);
        assert.equal(123, value[0]);
        value = Converter_1.Converter.listToArray('123');
        assert.isArray(value);
        assert.lengthOf(value, 1);
        assert.equal('123', value[0]);
        value = Converter_1.Converter.listToArray('123,456');
        assert.isArray(value);
        assert.lengthOf(value, 2);
        assert.equal('123', value[0]);
        assert.equal('456', value[1]);
    });
    test('From Multistring', function () {
        assert.equal(null, Converter_1.Converter.fromMultiString(null));
        assert.equal('Just a text', Converter_1.Converter.fromMultiString('Just a text'));
        assert.equal('English text', Converter_1.Converter.fromMultiString({ en: 'English text', ru: 'Russian text' }));
        assert.equal('Russian text', Converter_1.Converter.fromMultiString({ en: 'English text', ru: 'Russian text' }, 'ru'));
        assert.equal('Russian text', Converter_1.Converter.fromMultiString({ ru: 'Russian text', sp: 'Spanish text' }));
    });
});
