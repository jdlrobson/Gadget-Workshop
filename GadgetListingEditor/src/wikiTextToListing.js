const getListingTypesRegex = require( './getListingTypesRegex' );
const listingTemplateToParamsArray = require( './listingTemplateToParamsArray' );
const restoreComments = require( './restoreComments.js' );
const { getConfig } = require( './Config.js' );

/**
 * Convert raw wiki listing syntax into a mapping of key-value pairs
 * corresponding to the listing template parameters.
 */
const wikiTextToListing = function(listingTemplateWikiSyntax) {
    const { LISTING_TYPE_PARAMETER,
        LISTING_CONTENT_PARAMETER, LISTING_TEMPLATES } = getConfig();
    var typeRegex = getListingTypesRegex();
    // convert "{{see" to {{listing|type=see"
    listingTemplateWikiSyntax = listingTemplateWikiSyntax.replace(typeRegex,`{{listing| ${LISTING_TYPE_PARAMETER}=$2$3`);
    // remove the trailing braces
    listingTemplateWikiSyntax = listingTemplateWikiSyntax.slice(0,-2);
    var listingTemplateAsMap = {};
    var lastKey;
    var listParams = listingTemplateToParamsArray(listingTemplateWikiSyntax);
    for (var j=1; j < listParams.length; j++) {
        var param = listParams[j];
        var index = param.indexOf('=');
        if (index > 0) {
            // param is of the form key=value
            var key = param.substr(0, index).trim();
            var value = param.substr(index+1).trim();
            listingTemplateAsMap[key] = value;
            lastKey = key;
        } else if (lastKey && listingTemplateAsMap[lastKey].length) {
            // there was a pipe character within a param value, such as
            // "key=value1|value2", so just append to the previous param
            listingTemplateAsMap[lastKey] += `|${param}`;
        }
    }
    for (var loopKey1 in listingTemplateAsMap) {
        // if the template value contains an HTML comment that was
        // previously converted to a placehold then it needs to be
        // converted back to a comment so that the placeholder is not
        // displayed in the edit form
        listingTemplateAsMap[loopKey1] = restoreComments(listingTemplateAsMap[loopKey1], false);
    }
    if (listingTemplateAsMap[LISTING_CONTENT_PARAMETER]) {
        // convert paragraph tags to newlines so that the content is more
        // readable in the editor window
        listingTemplateAsMap[LISTING_CONTENT_PARAMETER] = listingTemplateAsMap[LISTING_CONTENT_PARAMETER].replace(/\s*<p>\s*/g, '\n\n');
        listingTemplateAsMap[LISTING_CONTENT_PARAMETER] = listingTemplateAsMap[LISTING_CONTENT_PARAMETER].replace(/\s*<br\s*\/?>\s*/g, '\n');
    }
    // sanitize the listing type param to match the configured values, so
    // if the listing contained "Do" it will still match the configured "do"
    for (var loopKey2 in LISTING_TEMPLATES) {
        if (listingTemplateAsMap[LISTING_TYPE_PARAMETER].toLowerCase() === loopKey2.toLowerCase()) {
            listingTemplateAsMap[LISTING_TYPE_PARAMETER] = loopKey2;
            break;
        }
    }
    return listingTemplateAsMap;
};

module.exports = wikiTextToListing;
