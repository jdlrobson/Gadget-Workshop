const dialog = require( './dialogs.js' );
const ListingEditorFormDialog = require( './components/ListingEditorFormDialog.js' );
const getListingInfo = require( './getListingInfo.js' );
const listingToStr = require( './listingToStr.js' );
const getListingWikitextBraces = require( './getListingWikitextBraces' );
const saveForm = require( './saveForm' );
const { EDITOR_CLOSED_SELECTOR } = require( './selectors.js' );
const { MODE_ADD, MODE_EDIT } = require( './mode.js' );
const validateForm = require( './validateForm.js' );
const stripComments = require( './stripComments.js' );
const isCustomListingType = require( './isCustomListingType.js' );
const formToText = require( './formToText.js' );
const wikiTextToListing = require( './wikiTextToListing.js' );
const { translate } = require( './translate.js' );
const { getSectionText, setSectionText } = require( './currentEdit' );
const { getCallbacks } = require( './Callbacks.js' );
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
        REPLACE_NEW_LINE_CHARS,
        SPECIAL_CHARS,
        LISTING_TEMPLATES_OMIT,
        SUPPORTED_SECTIONS,
        SHOW_LAST_EDITED_FIELD,
        APPEND_FULL_STOP_TO_DESCRIPTION,
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
        }
        else if (
            validateForm(
                getCallbacks( 'VALIDATE_FORM_CALLBACKS' ),
                REPLACE_NEW_LINE_CHARS,
                APPEND_FULL_STOP_TO_DESCRIPTION,
                translate
            )
        ) {
            formToText(mode, listingTemplateWikiSyntax, listingTemplateAsMap, sectionNumber)
                .then( closeDialog, teardown );
        } else {
            // form validation failed.
            reset();
        }
    };

    const customListingType = isCustomListingType(listingType) ? listingType : undefined;
    const { wikipedia, wikidata, image } = listingTemplateAsMap;

    dialog.render( ListingEditorFormDialog, {
        wikipedia, wikidata, image,
        listingType,
        listingTemplateAsMap,
        nationalCurrencies: [ NATL_CURRENCY ],
        listingTypes: (
                customListingType ? SUPPORTED_SECTIONS.concat( listingType ) : SUPPORTED_SECTIONS
            ).filter( ( a ) => !LISTING_TEMPLATES_OMIT.includes( a ) ),
        mode,
        onCaptchaSubmit,
        onSubmit,
        telephoneCodes,
        characters: SPECIAL_CHARS,
        showLastEditedField: mode === MODE_EDIT && SHOW_LAST_EDITED_FIELD,
        onMount: ( form ) => {
            let previewTimeout;
            $( form, 'textarea,input' ).on( 'change', () => {
                clearInterval( previewTimeout );
                mw.util.throttle( () => {
                    previewTimeout = setTimeout( () => {
                        showPreview(listingTemplateAsMap)
                    }, 200 );
                }, 300 )();
            } );
            if (mode !== MODE_ADD) {
                showPreview(listingTemplateAsMap);
            }
        },
        onHelp: () => {
            window.open( translate( 'helpPage' ) );
        },
        title: (mode == MODE_ADD) ?
            translate( `addTitle${dialogTitleSuffix}` ) : translate( `editTitle${dialogTitleSuffix}` ),
        dialogClass: 'listing-editor-dialog'
    } );
};

module.exports = openListingEditorDialog;
