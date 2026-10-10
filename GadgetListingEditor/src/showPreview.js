
const listingToStr = require( './listingToStr.js' );
const createListingFromForm = require( './createListingFromForm.js' );
const fetchPath = require( './fetchPath.js' );

/**
 * @param {Record<string,string>} listingData
 * @return {Promise<string>}
 */
const showPreview = function(listingData) {
    const text = listingToStr(createListingFromForm(listingData));
    const params = $.param({
        origin: '*',
        action: 'parse',
        prop: 'text',
        contentmodel: 'wikitext',
        format: 'json',
        text,
    });
    return fetchPath(`${mw.config.get('wgScriptPath')}/api.php?${params}` )
        .then( ( response ) => response.json() )
        .then( ( data ) => data.parse.text['*'] );
};

module.exports = showPreview;
