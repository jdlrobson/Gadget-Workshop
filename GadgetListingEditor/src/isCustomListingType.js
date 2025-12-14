const { getConfig } = require( './Config.js' );

/**
 * Determine if the specified listing type is a custom type - for example "go"
 * instead of "see", "do", "listing", etc.
 */
const isCustomListingType = function(listingType) {
    const { LISTING_TEMPLATES } = getConfig();
    return !(listingType in LISTING_TEMPLATES);
};

module.exports = isCustomListingType;
