const IS_LOCALHOST = window.location.host.indexOf( 'localhost' ) > -1;
const currentEdit = require( './currentEdit.js' );
const { setSectionText } = currentEdit;
const localData = require( './localData.js' );

var Core = function( Callbacks, Config, PROJECT_CONFIG, translate ) {
    const {
        SECTION_TO_TEMPLATE_TYPE,
        DEFAULT_LISTING_TEMPLATE
    } = Config;

    var api = new mw.Api();
    const { MODE_ADD, MODE_EDIT } = require( './mode.js' );

    var isInline = require( './isInline.js' );

    var findSectionHeading = require( './findSectionHeading.js' );

    var findSectionIndex = require( './findSectionIndex.js' );

    /**
     * Given an edit link that was clicked for a listing, determine what index
     * that listing is within a section. First listing is 0, second is 1, etc.
     */
    var findListingIndex = require( './findListingIndex.js' );

    /**
     * Return the listing template type appropriate for the section that
     * contains the provided DOM element (example: "see" for "See" sections,
     * etc). If no matching type is found then the default listing template
     * type is returned.
     */
    const _findListingTypeForSection = require( './findListingTypeForSection.js' );
    const findListingTypeForSection = function(entry ) {
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
        var listingIndex = (mode === MODE_ADD) ? -1 : findListingIndex(sectionHeading, clicked);
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

    /**
     * This method is called asynchronously after the initListingEditorDialog()
     * method has retrieved the existing wiki section content that the
     * listing is being added to (and that contains the listing wiki syntax
     * when editing).
     */
    var openListingEditorDialog = require( './openListingEditorDialog.js' );

    // expose public members
    return {
        initListingEditorDialog,
        MODE_ADD,
        MODE_EDIT
    };
};

module.exports = Core;
