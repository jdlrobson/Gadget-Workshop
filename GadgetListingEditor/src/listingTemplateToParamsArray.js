const findPatternMatch = require( './findPatternMatch.js' );

/**
 * Split the raw template wikitext into an array of params. The pipe
 * symbol delimits template params, but this method will also inspect the
 * content to deal with nested templates or wikilinks that might contain
 * pipe characters that should not be used as delimiters.
 */
const listingTemplateToParamsArray = function(listingTemplateWikiSyntax) {
    var results = [];
    var paramValue = '';
    var pos = 0;
    while (pos < listingTemplateWikiSyntax.length) {
        var remainingString = listingTemplateWikiSyntax.substr(pos);
        // check for a nested template or wikilink
        var patternMatch = findPatternMatch(remainingString, "{{", "}}");
        if (patternMatch.length === 0) {
            patternMatch = findPatternMatch(remainingString, "[[", "]]");
        }
        if (patternMatch.length > 0) {
            paramValue += patternMatch;
            pos += patternMatch.length;
        } else if (listingTemplateWikiSyntax.charAt(pos) === '|') {
            // delimiter - push the previous param and move on to the next
            results.push(paramValue);
            paramValue = '';
            pos++;
        } else {
            // append the character to the param value being built
            paramValue += listingTemplateWikiSyntax.charAt(pos);
            pos++;
        }
    }
    if (paramValue.length > 0) {
        // append the last param value
        results.push(paramValue);
    }
    return results;
};

module.exports = listingTemplateToParamsArray;
