const getListingInfo = require( './getListingInfo.js' );

/**
 * @param {Record<string,string>} listingData
 * @return {Record<string,string>}
 */
const createListingFromForm = ( listingData ) => {
    const listingParameters = getListingInfo(listingData.type);
    /** @type {Record<string,string>} */
    const listing = {};
    for (var parameter in listingParameters) {
        const parameterId = listingParameters[parameter].id;
        let key = parameterId.indexOf( 'input-' ) === 0 ?
            parameterId.split('input-')[1] : parameterId;
        key = parameterId.indexOf('-value') > -1 ? key.split('-value')[0] : key;
        listing[parameter] = listingData[key];
    }
    return listing;
};

module.exports = createListingFromForm;
