const getListingTypesRegex = require( './getListingTypesRegex.js' );
const { getSectionText, setSectionText } = require( './currentEdit.js' );
/**
 * Given a listing index, return the full wikitext for that listing
 * ("{{listing|key=value|...}}"). An index of 0 returns the first listing
 * template invocation, 1 returns the second, etc.
 */
const getListingWikitextBraces = function(listingIndex) {
    let sectionText = getSectionText();
    sectionText = setSectionText(
        sectionText.replace(/[^\S\n]+/g,' ')
    );
    // find the listing wikitext that matches the same index as the listing index
    var listingRegex = getListingTypesRegex();
    // look through all matches for "{{listing|see|do...}}" within the section
    // wikitext, returning the nth match, where 'n' is equal to the index of the
    // edit link that was clicked
    var listingSyntax, regexResult, listingMatchIndex;

    for (var i = 0; i <= listingIndex; i++) {
        regexResult = listingRegex.exec(sectionText);
        listingMatchIndex = regexResult.index;
        listingSyntax = regexResult[1];
    }
    // listings may contain nested templates, so step through all section
    // text after the matched text to find MATCHING closing braces
    // the first two braces are matched by the listing regex and already
    // captured in the listingSyntax variable
    var curlyBraceCount = 2;
    var endPos = sectionText.length;
    var startPos = listingMatchIndex + listingSyntax.length;
    var matchFound = false;
    for (var j = startPos; j < endPos; j++) {
        if (sectionText[j] === '{') {
            ++curlyBraceCount;
        } else if (sectionText[j] === '}') {
            --curlyBraceCount;
        }
        if (curlyBraceCount === 0 && (j + 1) < endPos) {
            listingSyntax = sectionText.substring(listingMatchIndex, j + 1);
            matchFound = true;
            break;
        }
    }
    if (!matchFound) {
        listingSyntax = sectionText.substring(listingMatchIndex);
    }
    return listingSyntax.trim();
};

module.exports = getListingWikitextBraces;
