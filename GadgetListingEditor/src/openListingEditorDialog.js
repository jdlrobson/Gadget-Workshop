const dialog = require( './dialogs.js' );
const ListingEditorFormDialog = require( './components/ListingEditorFormDialog.js' );
const getListingWikitextBraces = require( './getListingWikitextBraces' );
const saveForm = require( './saveForm' );
const { EDITOR_CLOSED_SELECTOR } = require( './selectors.js' );
const { MODE_ADD, MODE_EDIT } = require( './mode.js' );
const fixupFormValues = require( './fixupFormValues.js' );
const stripComments = require( './stripComments.js' );
const isCustomListingType = require( './isCustomListingType.js' );
const formToText = require( './formToText.js' );
const wikiTextToListing = require( './wikiTextToListing.js' );
const { translate } = require( './translate.js' );
const { getSectionText, setSectionText } = require( './currentEdit' );
const { getConfig } = require( './Config' );

/**
 * This method is called asynchronously after the initListingEditorDialog()
 * method has retrieved the existing wiki section content that the
 * listing is being added to (and that contains the listing wiki syntax
 * when editing).
 */
var openListingEditorDialog = function(mode, sectionNumber, listingIndex, listingType, {
    telephoneCodes,
    NATL_CURRENCY
}) {
     const {
        LISTING_TYPE_PARAMETER,
        SPECIAL_CHARS,
        LISTING_TEMPLATES_OMIT,
        SUPPORTED_SECTIONS,
        SHOW_LAST_EDITED_FIELD
    } = getConfig();

    setSectionText(
        stripComments(
            getSectionText()
        )
    );

    var listingTemplateAsMap, listingTemplateWikiSyntax;
    if (mode == MODE_ADD) {
        listingTemplateAsMap = {};
        listingTemplateAsMap[LISTING_TYPE_PARAMETER] = listingType;
    } else {
        listingTemplateWikiSyntax = getListingWikitextBraces(listingIndex);
        listingTemplateAsMap = wikiTextToListing(listingTemplateWikiSyntax);
        listingType = listingTemplateAsMap[LISTING_TYPE_PARAMETER];
    }
    // modal form - must submit or cancel
    const dialogTitleSuffix = window.__USE_LISTING_EDITOR_BETA__ ? 'Beta' : '';

    let captchaSaveArgs;

    const handleCaptchaError = ( setCaptcha, reset ) => {
        return ( { edit, args } ) => {
            if ( edit && edit.captcha ) {
                captchaSaveArgs = args;
                setCaptcha( edit.captcha.url );
            } else {
                reset();
            }
        }
    };

    const onCaptchaSubmit = ( setCaptcha, closeAction ) => {
        if ( captchaSaveArgs ) {
            captchaSaveArgs.push( $('#input-captcha').val() );
            setCaptcha( '' );
            saveForm.apply( null, captchaSaveArgs ).then( () => {
                captchaSaveArgs = null;
                closeAction();
            }, handleCaptchaError( setCaptcha, closeAction ) );
        }
    };
    const onSubmit = ( closeDialog, reset, setCaptcha ) => {
        const teardown = handleCaptchaError( setCaptcha, reset );

        if ($(EDITOR_CLOSED_SELECTOR).is(':checked')) {
            // no need to validate the form upon deletion request
            formToText(mode, listingTemplateWikiSyntax, listingTemplateAsMap, sectionNumber)
                .then(
                    closeDialog,
                    handleCaptchaError()
                );
        } else {
            fixupFormValues();
            formToText(mode, listingTemplateWikiSyntax, listingTemplateAsMap, sectionNumber)
                .then( closeDialog, teardown );
        }
    };

    const customListingType = isCustomListingType(listingType) ? listingType : undefined;
    const { wikipedia, wikidata, image, lat, long,
        alt, address, email, directions, phone, tollfree, fax,
        hours, checkin, checkout, price,
        name, content, lastedit, url } = listingTemplateAsMap;

    dialog.render( ListingEditorFormDialog, {
        wikipedia, wikidata, image,
        lat, url, long, content,
        lastedit,
        address,
        email,
        directions,
        phone,
        tollfree,
        fax,
        hours,
        checkin, checkout,
        price,
        aka: alt,
        listingName: name,
        listingType,
        nationalCurrencies: NATL_CURRENCY,
        listingTypes: (
                customListingType ? SUPPORTED_SECTIONS.concat( listingType ) : SUPPORTED_SECTIONS
            ).filter( ( a ) => !LISTING_TEMPLATES_OMIT.includes( a ) ),
        mode,
        onCaptchaSubmit,
        onSubmit,
        telephoneCodes,
        characters: SPECIAL_CHARS,
        showLastEditedField: mode === MODE_EDIT && SHOW_LAST_EDITED_FIELD,
        onHelp: () => {
            window.open( translate( 'helpPage' ) );
        },
        title: (mode == MODE_ADD) ?
            translate( `addTitle${dialogTitleSuffix}` ) : translate( `editTitle${dialogTitleSuffix}` ),
        dialogClass: 'listing-editor-dialog'
    } );
};

module.exports = openListingEditorDialog;
