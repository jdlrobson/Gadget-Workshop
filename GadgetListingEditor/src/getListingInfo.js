const isCustomListingType = require( './isCustomListingType.js' );
const { getConfig, getListingTemplateConfiguration } = require( './Config.js' );

/**
 * Given a listing type, return the appropriate entry from the
 * LISTING_TEMPLATES array. This method returns the entry for the default
 * listing template type if not enty exists for the specified type.
 *
 * @param {string} type
 * @return {ListingInfo}
 */
const getListingInfo = function(type) {
    const { DEFAULT_LISTING_TEMPLATE } = getConfig();
    const LISTING_TEMPLATES = getListingTemplateConfiguration();
    return (isCustomListingType(type)) ? LISTING_TEMPLATES[DEFAULT_LISTING_TEMPLATE] : LISTING_TEMPLATES[type];
};

module.exports = getListingInfo;
