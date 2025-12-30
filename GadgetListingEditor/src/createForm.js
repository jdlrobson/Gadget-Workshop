const isCustomListingType = require( './isCustomListingType.js' );
const renderSisterSiteApp = require( './sisterSiteApp/render.js' );
const { translate } = require( './translate.js' );
const { getCallbacks } = require( './Callbacks.js' );
const { getConfig } = require( './Config.js' );
const NATL_CURRENCY_SELECTOR = '#span_natl_currency';

const createForm = function(mode, listingParameters, listingTemplateAsMap, {
    telephoneCodes,
    NATL_CURRENCY
}) {
    const Config = getConfig();
    const {
        EDITOR_FORM_HTML,
        LISTING_TYPE_PARAMETER,
        SUPPORTED_SECTIONS,
        LISTING_TEMPLATES_OMIT
    } = Config;
    var form = $(EDITOR_FORM_HTML);
    // make sure the select dropdown includes any custom "type" values
    var listingType = listingTemplateAsMap[LISTING_TYPE_PARAMETER];
    const $dropdown = $(`#${listingParameters[LISTING_TYPE_PARAMETER].id}`, form);
    SUPPORTED_SECTIONS
        .filter( ( a ) => !LISTING_TEMPLATES_OMIT.includes( a ) )
        .forEach( ( value ) => {
            $( '<option>' ).val( value ).text( value ).appendTo( $dropdown );
        } );
    if (isCustomListingType(listingType)) {
        $dropdown.append( $( '<option></option>').attr( {value: listingType }).text( listingType ) );
    }
    // populate the empty form with existing values
    for (var parameter in listingParameters) {
        var parameterInfo = listingParameters[parameter];
        if (listingTemplateAsMap[parameter]) {
            $(`#${parameterInfo.id}`, form).val(listingTemplateAsMap[parameter]);
        } else if (parameterInfo.hideDivIfEmpty) {
            $(`#${parameterInfo.hideDivIfEmpty}`, form).hide();
        }
    }
    // Adding national currency symbols
    var natlCurrency = $(NATL_CURRENCY_SELECTOR, form);
    if (NATL_CURRENCY.length > 0) {
        for (i = 0; i < NATL_CURRENCY.length; i++) {
            natlCurrency.append(`<span class="listing-charinsert" data-for="input-price"> <a href="javascript:">${NATL_CURRENCY[i]}</a></span>`);
        }
        natlCurrency.append(' |');
    } else natlCurrency.hide();
    // Adding country calling code
    var phones = $('.input-cc', form);
    if ( telephoneCodes.length ) {
        phones.each( function() {
            i = $(this).attr('data-for');
            telephoneCodes.forEach( ( CC ) => {
                $(this).append( `<span class="listing-charinsert" data-for="${i}"><a href="javascript:">${CC} </a></span>` );
            } );
        });
    } else phones.hide();

    const callbacks = getCallbacks( 'CREATE_FORM_CALLBACKS' );
    for (var i=0; i < callbacks.length; i++) {
        callbacks[i]( form, mode );
    }
    // update SisterSite app values
    renderSisterSiteApp( Config, translate, listingTemplateAsMap )( form );
    return form;
};
module.exports = createForm;
