const IS_LOCALHOST = window.location.host.indexOf( 'localhost' ) > -1;
const { MODE_ADD, MODE_EDIT } = require( './mode.js' );
const isInline = require( './isInline.js' );
const openListingEditorDialog = require( './openListingEditorDialog.js' );
const currentEdit = require( './currentEdit.js' );
const api = new mw.Api();
const { translate } = require( './translate.js' );
const findListingIndex = require( './findListingIndex.js' );
const findSectionIndex = require( './findSectionIndex.js' );
const findSectionHeading = require( './findSectionHeading.js' );
const localData = require( './localData.js' );
const { setSectionText } = require( './currentEdit.js' );
const { getConfig } = require( './Config.js' );

/**
 * Return the listing template type appropriate for the section that
 * contains the provided DOM element (example: "see" for "See" sections,
 * etc). If no matching type is found then the default listing template
 * type is returned.
 */
const _findListingTypeForSection = require( './findListingTypeForSection.js' );
const findListingTypeForSection = function(entry ) {
    const { SECTION_TO_TEMPLATE_TYPE,
        DEFAULT_LISTING_TEMPLATE } = getConfig();
    return _findListingTypeForSection( entry, SECTION_TO_TEMPLATE_TYPE, DEFAULT_LISTING_TEMPLATE );
};

/**
 * This method is invoked when an "add" or "edit" listing button is
 * clicked and will execute an Ajax request to retrieve all of the raw wiki
 * syntax contained within the specified section. This wiki text will
 * later be modified via the listing editor and re-submitted as a section
 * edit.
 */
var initListingEditorDialog = function(mode, clicked) {
    var listingType;
    if (mode === MODE_ADD) {
        listingType = findListingTypeForSection(clicked);
    }
    var sectionHeading = findSectionHeading(clicked);
    var sectionIndex = findSectionIndex(sectionHeading);
    var listingIndex = mode === MODE_ADD ? -1 : findListingIndex(sectionHeading, clicked);
    currentEdit.setInlineListing( mode === MODE_EDIT && isInline(clicked) );

    const {
        telephoneCodes,
        NATL_CURRENCY
    } = localData.loadFromCountryData( $( '.countryData' ) );

    api.ajax({
        prop: 'revisions',
        format: 'json',
        formatversion: 2,
        titles: IS_LOCALHOST ? mw.config.get( 'wgTitle' ) : mw.config.get('wgPageName'),
        action: 'query',
        rvprop: 'content',
        origin: '*',
        rvsection: sectionIndex
    }).then(function( data ) {
        try {
            setSectionText(
                data.query.pages[ 0 ].revisions[ 0 ].content
            );
        } catch ( e ) {
            alert( 'Error occurred loading content for this section.' );
            return;
        }
        openListingEditorDialog(
            mode, sectionIndex, listingIndex, listingType,
            {
                telephoneCodes,
                NATL_CURRENCY
            }
        );
    }, function( _jqXHR, textStatus, errorThrown ) {
        alert( `${translate( 'ajaxInitFailure' )}: ${textStatus} ${errorThrown}`);
    });
};

module.exports = initListingEditorDialog;
