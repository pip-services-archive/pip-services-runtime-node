"use strict";
var _ = require('lodash');
/**
 * Extracts from objects and processes search tags
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-05-01
 */
var TagsProcessor = (function () {
    function TagsProcessor() {
    }
    /**
     * Normalize a tag by replacing with REGEX: (_|#)
     *
     * @param tag The tag to normalize
     * @return A normalized tag
     */
    TagsProcessor.normalizeTag = function (tag) {
        return tag
            ? _.trim(tag.replace(/(_|#)+/g, ' '))
            : null;
    };
    /**
     * Compress a tag by replacing with REGEX: ( |_|#)
     *
     * @param tag The tag to compress
     * @return A compressed tag
     */
    TagsProcessor.compressTag = function (tag) {
        return tag
            ? tag.replace(/( |_|#)/g, '').toLocaleLowerCase()
            : null;
    };
    /**
     * Determines if two tags are equal based on length and contained characters
     *
     * @param tag1 The first tag
     * @param tag2 The second tag
     * @return True if tags are equal, false if tags are not equal
     */
    TagsProcessor.equalTags = function (tag1, tag2) {
        if (tag1 == null && tag2 == null)
            return true;
        if (tag1 == null || tag2 == null)
            return false;
        return TagsProcessor.compressTag(tag1)
            == TagsProcessor.compressTag(tag2);
    };
    /**
     * Normalize multiple tags contained in a single String using {@link org.pipservices.runtime.data.TagProcessor#normalizeTag(String)}
     *
     * @param tags The tags to normalize
     * @return A String array of normalized tags
     */
    TagsProcessor.normalizeTags = function (tags) {
        if (_.isString(tags))
            tags = tags.split(/( |,|;)+/);
        tags = _.map(tags, function (tag) { return TagsProcessor.normalizeTag(tag); });
        return tags;
    };
    /**
     * Compress multiple tags contained in a single String using {@link org.pipservices.runtime.data.TagProcessor#compressTag(String)}
     *
     * @param tags The tags to compress
     * @return A String array of compressed tags
     */
    TagsProcessor.compressTags = function (tags) {
        if (_.isString(tags))
            tags = tags.split(/( |,|;)+/);
        tags = _.map(tags, function (tag) { return TagsProcessor.compressTag(tag); });
        return tags;
    };
    TagsProcessor.extractString = function (field) {
        if (field == null)
            return '';
        if (_.isString(field))
            return field;
        if (!_.isObject(field))
            return '';
        var result = '';
        for (var prop in field) {
            if (field.hasOwnProperty(prop))
                result += ' ' + TagsProcessor.extractString(field[prop]);
        }
        return result;
    };
    /**
     * Extracts hash tags from a JSON object based on user defined tag search fields
     *
     * @param jsonObject   The JSON object to parse
     * @param searchFields The user defined tag search fields
     * @return String array of compressed tags based on the user defined tag search fields
     */
    TagsProcessor.extractHashTags = function (obj, searchFields) {
        var tags = TagsProcessor.compressTags(obj.tags);
        _.each(searchFields, function (field) {
            var text = TagsProcessor.extractString(obj[field]);
            if (text != '') {
                var hashTags = text.match(TagsProcessor.HASHTAG_REGEX);
                tags = tags.concat(TagsProcessor.compressTags(hashTags));
            }
        });
        return _.uniq(tags);
    };
    TagsProcessor.HASHTAG_REGEX = /#\w+/g;
    return TagsProcessor;
}());
exports.TagsProcessor = TagsProcessor;
