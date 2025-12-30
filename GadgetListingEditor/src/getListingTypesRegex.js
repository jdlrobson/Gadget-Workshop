const { getConfig } = require( './Config.js' );
/**
 * Return a regular expression that can be used to find all listing
 * template invocations (as configured via the LISTING_TEMPLATES map)
 * within a section of wikitext. Note that the returned regex simply
 * matches the start of the template ("{{listing") and not the full
 * template ("{{listing|key=value|...}}").
 */
const getListingTypesRegex = function() {
    const { LISTING_TEMPLATES, listingTypeRegExp } = getConfig();
    if ( !listingTypeRegExp ) {
        throw new Error( 'please define listingTypeRegExp in [[MediaWiki:Gadget-ListingEditor.json]]' );
    }
    var regex = [];
    for (var key in LISTING_TEMPLATES) {
        regex.push(key);
    }
    return new RegExp( listingTypeRegExp.replace( '%s', regex.join( '|' ) ), 'ig' );
};

module.exports = getListingTypesRegex;
