const isCustomListingType = require( './isCustomListingType.js' );
const currentEdit = require( './currentEdit.js' );
const getListingInfo = require( './getListingInfo' );
const { getConfig } = require( './Config.js' );

/**
 * Trim whitespace at the end of a string.
 */
const rtrim = function(str) {
    return str.replace(/\s+$/, '');
};

/**
 * Convert the listing map back to a wiki text string.
 */
const listingToStr = function(listing) {
    const { LISTING_TYPE_PARAMETER,
        ALLOW_UNRECOGNIZED_PARAMETERS,
        LISTING_CONTENT_PARAMETER,
        DEFAULT_LISTING_TEMPLATE } = getConfig();
    const inlineListing = currentEdit.isInlineListing();
    var listingType = listing[LISTING_TYPE_PARAMETER];
    var listingParameters = getListingInfo(listingType);
    var saveStr = '{{';
    if( isCustomListingType(listingType) ) { // type parameter specified explicitly only on custom type
        saveStr += DEFAULT_LISTING_TEMPLATE;
        saveStr += ` | ${LISTING_TYPE_PARAMETER}=${listingType}`;
    } else {
        saveStr += listingType;
    }
    if (!inlineListing && listingParameters[LISTING_TYPE_PARAMETER].newline) {
        saveStr += '\n';
    }
    for (var parameter in listingParameters) {
        var l = listingParameters[parameter];
        if (parameter === LISTING_TYPE_PARAMETER) {
            // "type" parameter was handled previously
            continue;
        }
        if (parameter === LISTING_CONTENT_PARAMETER) {
            // processed last
            continue;
        }
        if (listing[parameter] !== '' || (!l.skipIfEmpty && !inlineListing)) {
            saveStr += `| ${parameter}=${listing[parameter] || ''}`;
        }
        if (!saveStr.match(/\n$/)) {
            if (!inlineListing && l.newline) {
                saveStr = `${rtrim(saveStr)}\n`;
            } else if (!saveStr.match(/ $/)) {
                saveStr += ' ';
            }
        }
    }
    if (ALLOW_UNRECOGNIZED_PARAMETERS) {
        // append any unexpected values
        for (var key in listing) {
            if (listingParameters[key]) {
                // this is a known field
                continue;
            }
            if (listing[key] === '') {
                // skip unrecognized fields without values
                continue;
            }
            saveStr += `| ${key}=${listing[key] || ''}`;
            saveStr += (inlineListing) ? ' ' : '\n';
        }
    }
    saveStr += `| ${LISTING_CONTENT_PARAMETER}=${listing[LISTING_CONTENT_PARAMETER] || ''}`;
    saveStr += (inlineListing || !listingParameters[LISTING_CONTENT_PARAMETER].newline) ? ' ' : '\n';
    saveStr += '}}';
    return saveStr;
};

module.exports = listingToStr;
