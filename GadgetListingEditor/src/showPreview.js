
const getListingInfo = require( './getListingInfo.js' );
const listingToStr = require( './listingToStr.js' );
const { getConfig } = require( './Config' );

const showPreview = function(listingTemplateAsMap) {
    const {
        LISTING_TYPE_PARAMETER,
        DEFAULT_LISTING_TEMPLATE
    } = getConfig();
    var listing = listingTemplateAsMap;
    var defaultListingParameters = getListingInfo(DEFAULT_LISTING_TEMPLATE);
    var listingTypeInput = defaultListingParameters[LISTING_TYPE_PARAMETER].id;
    var listingType = $(`#${listingTypeInput}`).val();
    var listingParameters = getListingInfo(listingType);
    for (var parameter in listingParameters) {
        listing[parameter] = $(`#${listingParameters[parameter].id}`).val();
    }
    var text = listingToStr(listing);
    $.ajax ({
        url: `${mw.config.get('wgScriptPath')}/api.php?${$.param({
            action: 'parse',
            prop: 'text',
            contentmodel: 'wikitext',
            format: 'json',
            text,
        })}`
    } ).then( ( data ) => {
        $('#listing-preview-text').html(data.parse.text['*']);
    } );
};

module.exports = showPreview;
