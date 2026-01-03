
const listingToStr = require( './listingToStr.js' );
const createListingFromForm = require( './createListingFromForm.js' );

const showPreview = function(listingTemplateAsMap) {
    var listing = createListingFromForm( listingTemplateAsMap );
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
