const dialog = require( './dialogs.js' );
const createForm = require( './createForm.js' );
const getListingInfo = require( './getListingInfo.js' );
const listingToStr = require( './listingToStr.js' );
const getListingWikitextBraces = require( './getListingWikitextBraces' );
const { EDITOR_FORM_SELECTOR, EDITOR_CLOSED_SELECTOR } = require( './selectors.js' );
const { MODE_ADD } = require( './mode.js' );
const validateForm = require( './validateForm.js' );
const stripComments = require( './stripComments.js' );
const formToText = require( './formToText.js' );
const wikiTextToListing = require( './wikiTextToListing.js' );
const { translate } = require( './translate.js' );
const { getSectionText, setSectionText } = require( './currentEdit' );
const { getCallbacks } = require( './Callbacks.js' );
const { getConfig } = require( './Config' );

const listingEditorSync = require( './listingEditorSync.js' );

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

var openListingEditorDialog = function(mode, sectionNumber, listingIndex, listingType, {
    telephoneCodes,
    NATL_CURRENCY
} ) {
    const {
        LISTING_TYPE_PARAMETER,
        REPLACE_NEW_LINE_CHARS,
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
    var listingParameters = getListingInfo(listingType);
    // if a listing editor dialog is already open, get rid of it
    if ($(EDITOR_FORM_SELECTOR).length > 0) {
        dialog.destroy( EDITOR_FORM_SELECTOR );
    }
    // if a sync editor dialog is already open, get rid of it
    listingEditorSync.destroy();
    var form = $(createForm(mode, listingParameters, listingTemplateAsMap, {
        telephoneCodes,
        NATL_CURRENCY
    }));
    // modal form - must submit or cancel
    const dialogTitleSuffix = window.__USE_LISTING_EDITOR_BETA__ ? 'Beta' : '';
    const buttons = [
        {
            text: '?',
            id: 'listing-help',
            // eslint-disable-next-line object-shorthand
            click: function() {
                window.open( translate( 'helpPage' ) );
            }
        },
        {
            text: translate( 'submit' ),
            // eslint-disable-next-line object-shorthand
            click: function() {
                if ($(EDITOR_CLOSED_SELECTOR).is(':checked')) {
                    // no need to validate the form upon deletion request
                    formToText(mode, listingTemplateWikiSyntax, listingTemplateAsMap, sectionNumber, dialog);
                    dialog.close(this);
                    // if a sync editor dialog is open, get rid of it
                    listingEditorSync.destroy();
                }
                else if (
                    validateForm(
                        getCallbacks( 'VALIDATE_FORM_CALLBACKS' ),
                        REPLACE_NEW_LINE_CHARS,
                        APPEND_FULL_STOP_TO_DESCRIPTION,
                        translate
                    )
                ) {
                    formToText(mode, listingTemplateWikiSyntax, listingTemplateAsMap, sectionNumber, dialog);
                    dialog.close(this);
                    // if a sync editor dialog is open, get rid of it
                    listingEditorSync.destroy();
                }
            }
        },
        {
            text: translate( 'cancel' ),
            // eslint-disable-next-line object-shorthand
            click: function() {
                dialog.destroy(this);
                // if a sync editor dialog is open, get rid of it
                listingEditorSync.destroy();
            }
        }
    ];
    let previewTimeout;
    $( form, 'textarea,input' ).on( 'change', () => {
        clearInterval( previewTimeout );
        mw.util.throttle( () => {
            previewTimeout = setTimeout( () => {
                showPreview(listingTemplateAsMap)
            }, 200 );
        }, 300 )();
    } );
    dialog.open(form, {
        modal: true,
        title: (mode == MODE_ADD) ?
            translate( `addTitle${dialogTitleSuffix}` ) : translate( `editTitle${dialogTitleSuffix}` ),
        dialogClass: 'listing-editor-dialog',
        // eslint-disable-next-line object-shorthand
        create: function() {
            // Make button pane
            const $dialog = form.parent();
            const $btnPane = $( '<div>' )
                .addClass( 'ui-dialog-buttonpane ui-widget-content ui-helper-clearfix' )
                .appendTo( $dialog );
            const $buttonSet = $( '<div>' ).addClass( 'ui-dialog-buttonset' ).appendTo( $btnPane );
            buttons.forEach( ( props ) => {
                const btn = document.createElement( 'button' );
                btn.classList.add( 'cdx-button', 'cdx-button--action-default' );
                if ( props.id ) {
                    btn.id = props.id;
                }
                if ( props.title ) {
                    btn.setAttribute( 'title', props.title );
                }
                if ( props.style ) {
                    btn.setAttribute( 'style', props.style );
                }
                btn.textContent = props.text;
                btn.addEventListener( 'click', () => {
                    props.click.apply( form );
                } );
                $buttonSet.append( btn );
            } );
            $btnPane.append(`<div class="listing-license">${translate( 'licenseText' )}</div>`);
            if ( window.__WIKIVOYAGE_LISTING_EDITOR_VERSION__ ) {
                $(
                    `<span class="listing-license">${translate('listing-editor-version', [ window.__WIKIVOYAGE_LISTING_EDITOR_VERSION__ ])}</span>`
                ).appendTo( $btnPane );
            }
            const bugUrl = 'https://github.com/jdlrobson/Gadget-Workshop/issues';
            $( `<span class="listing-license">&nbsp;<a href="${bugUrl}">${translate( 'report-bug' )}</a></span>` )
                .appendTo( $btnPane );
            $('body').on('dialogclose', EDITOR_FORM_SELECTOR, function() { //if closed with X buttons
                // if a sync editor dialog is open, get rid of it
                listingEditorSync.destroy();
            });
        }
    });
};

module.exports = openListingEditorDialog;
