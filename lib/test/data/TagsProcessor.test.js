"use strict";
var assert = require('chai').assert;
var TagsProcessor_1 = require('../../src/data/TagsProcessor');
suite('TagsProcessor', function () {
    test('Extract Hash Tags', function () {
        var tags = TagsProcessor_1.TagsProcessor.extractHashTags({
            tags: ['Tag 1', 'tag_2', 'TAG3'],
            name: 'Text with tag1 #Tag1',
            description: 'Text with #tag_2,#tag3-#tag4 and #TAG__5'
        }, ['name', 'description']);
        assert.sameMembers(['tag1', 'tag2', 'tag3', 'tag4', 'tag5'], tags);
    });
    test('Extract Hash Tags from Object', function () {
        var tags = TagsProcessor_1.TagsProcessor.extractHashTags({
            tags: ['Tag 1', 'tag_2', 'TAG3'],
            name: {
                short: 'Just a name',
                full: 'Text with tag1 #Tag1'
            },
            description: {
                en: 'Text with #tag_2,#tag4 and #TAG__5',
                ru: 'Текст с #tag_2,#tag3 и #TAG__5'
            }
        }, ['name', 'description']);
        assert.sameMembers(['tag1', 'tag2', 'tag3', 'tag4', 'tag5'], tags);
    });
});
