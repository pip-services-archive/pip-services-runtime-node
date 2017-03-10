let _ = require('lodash');

/**
 * Extracts from objects and processes search tags
 * @author Sergey Seroukhov
 * @version 1.0
 * @since 2016-05-01
 */
export class TagsProcessor {
    private static HASHTAG_REGEX = /#\w+/g;

    /**
     * Normalize a tag by replacing with REGEX: (_|#)
     *
     * @param tag The tag to normalize
     * @return A normalized tag
     */
    public static normalizeTag(tag: string) {
        return tag 
            ? _.trim(tag.replace(/(_|#)+/g, ' ')) 
            : null;
    }

    /**
     * Compress a tag by replacing with REGEX: ( |_|#)
     *
     * @param tag The tag to compress
     * @return A compressed tag
     */
    public static compressTag(tag: string) {
        return tag
            ? tag.replace(/( |_|#)/g, '').toLocaleLowerCase()
            : null;
    }

    /**
     * Determines if two tags are equal based on length and contained characters
     *
     * @param tag1 The first tag
     * @param tag2 The second tag
     * @return True if tags are equal, false if tags are not equal
     */
    public static equalTags(tag1, tag2) {
        if (tag1 == null && tag2 == null)
            return true;
        if (tag1 == null || tag2 == null)
            return false;
        return TagsProcessor.compressTag(tag1) 
            == TagsProcessor.compressTag(tag2);
    }

    /**
     * Normalize multiple tags contained in a single String using {@link org.pipservices.runtime.data.TagProcessor#normalizeTag(String)}
     *
     * @param tags The tags to normalize
     * @return A String array of normalized tags
     */
    public static normalizeTags(tags) {
        if (_.isString(tags))
            tags = tags.split(/( |,|;)+/);

        tags = _.map(tags, (tag) => TagsProcessor.normalizeTag(tag));

        return tags;
    }

    /**
     * Compress multiple tags contained in a single String using {@link org.pipservices.runtime.data.TagProcessor#compressTag(String)}
     *
     * @param tags The tags to compress
     * @return A String array of compressed tags
     */
    public static compressTags(tags) {
        if (_.isString(tags))
            tags = tags.split(/( |,|;)+/);

        tags = _.map(tags, (tag) => TagsProcessor.compressTag(tag));

        return tags;
    }

    private static extractString(field) {
        if (field == null) return '';
        if (_.isString(field)) return field;
        if (!_.isObject(field)) return '';
        
        let result = '';
        for (let prop in field) {
            if (field.hasOwnProperty(prop))
                result += ' ' + TagsProcessor.extractString(field[prop]);
        }
        return result;
    }

    /**
     * Extracts hash tags from a JSON object based on user defined tag search fields
     *
     * @param jsonObject   The JSON object to parse
     * @param searchFields The user defined tag search fields
     * @return String array of compressed tags based on the user defined tag search fields
     */
    public static extractHashTags(obj, searchFields) {
        let tags = TagsProcessor.compressTags(obj.tags);

        _.each(searchFields, (field) => {
            let text = TagsProcessor.extractString(obj[field]);

            if (text != '') {
                let hashTags = text.match(TagsProcessor.HASHTAG_REGEX);
                tags = tags.concat(TagsProcessor.compressTags(hashTags));
            }
        });

        return _.uniq(tags);
    }
}
