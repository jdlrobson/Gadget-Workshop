const getListingInfo = require( './getListingInfo.js' );
const { getConfig } = require( './Config' );

const createListingFromForm = ( listing ) => {
    const {
        LISTING_TYPE_PARAMETER,
        DEFAULT_LISTING_TEMPLATE
    } = getConfig();
    var defaultListingParameters = getListingInfo(DEFAULT_LISTING_TEMPLATE);
    var listingTypeInput = defaultListingParameters[LISTING_TYPE_PARAMETER].id;
    var listingType = $(`#${listingTypeInput}`).val();
    var listingParameters = getListingInfo(listingType);
    for (var parameter in listingParameters) {
        listing[parameter] = $(`#${listingParameters[parameter].id}`).val();
    }
    return listing;
};

module.exports = createListingFromForm;
