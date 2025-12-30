const dialog = require( './dialogs.js' );
const IS_LOCALHOST = window.location.host.indexOf( 'localhost' ) > -1;
const listingEditorSync = require( './listingEditorSync.js' );
const renderSisterSiteApp = require( './sisterSiteApp/render.js' );
const currentEdit = require( './currentEdit.js' );
const { getSectionText, setSectionText } = currentEdit;
const listingToStr = require( './listingToStr.js' );

var Core = function( Callbacks, Config, PROJECT_CONFIG, translate ) {
    const {
        EDITOR_FORM_HTML,
        LISTING_TYPE_PARAMETER,
        SECTION_TO_TEMPLATE_TYPE,
        DEFAULT_LISTING_TEMPLATE,
        EDITOR_FORM_SELECTOR,
        EDITOR_CLOSED_SELECTOR
    } = Config;

    var api = new mw.Api();
    const { MODE_ADD, MODE_EDIT } = require( './mode.js' );
    var NATL_CURRENCY_SELECTOR = '#span_natl_currency';
    var NATL_CURRENCY = [];
    var CC_SELECTOR = '.input-cc'; // Country calling code
    var CC = '';
    var LC = '';

    /**
     * Generate the form UI for the listing editor. If editing an existing
     * listing, pre-populate the form input fields with the existing values.
     */
    var createForm = function(mode, listingParameters, listingTemplateAsMap) {
        var form = $(EDITOR_FORM_HTML);
        // make sure the select dropdown includes any custom "type" values
        var listingType = listingTemplateAsMap[LISTING_TYPE_PARAMETER];
        const $dropdown = $(`#${listingParameters[LISTING_TYPE_PARAMETER].id}`, form);
        const LISTING_TEMPLATES_OMIT = PROJECT_CONFIG.LISTING_TEMPLATES_OMIT;
        const SUPPORTED_SECTIONS = PROJECT_CONFIG.SUPPORTED_SECTIONS
            .filter( ( a ) => !LISTING_TEMPLATES_OMIT.includes( a ) );
        SUPPORTED_SECTIONS.forEach( ( value ) => {
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
        var phones = $(CC_SELECTOR, form);
        if (CC !== '' || LC !== '') {
            phones.each( function() {
                i = $(this).attr('data-for');
                if (CC !== '')
                    $(this).append( `<span class="listing-charinsert" data-for="${i}"><a href="javascript:">${CC} </a></span>` );
                if (LC !== '')
                    $(this).append( `<span class="listing-charinsert" data-for="${i}"><a href="javascript:">${LC} </a></span>` );
            });
        } else phones.hide();

        for (var i=0; i < Callbacks.CREATE_FORM_CALLBACKS.length; i++) {
            Callbacks.CREATE_FORM_CALLBACKS[i](form, mode);
        }
        // update SisterSite app values
        renderSisterSiteApp( Config, translate, listingTemplateAsMap )( form );
        return form;
    };

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
     * Given a listing index, return the full wikitext for that listing
     * ("{{listing|key=value|...}}"). An index of 0 returns the first listing
     * template invocation, 1 returns the second, etc.
     */
    var getListingWikitextBraces = require( './getListingWikitextBraces' );

    var wikiTextToListing = require( './wikiTextToListing' );

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

        NATL_CURRENCY = [];
        var dataSel = $( '.countryData' ).attr('data-currency');
        if ((dataSel !== undefined) && (dataSel !== '')) {
            NATL_CURRENCY = dataSel.split( ',' ).map( function( item ) {
                return item.trim();
            });
        }
        CC = '';
        dataSel = $( '.countryData' ).attr('data-country-calling-code');
        if ((dataSel !== undefined) && (dataSel !== '')) CC = dataSel;
        LC = '';
        dataSel = $( '.countryData' ).attr('data-local-dialing-code');
        if ((dataSel !== undefined) && (dataSel !== '')) LC = dataSel;

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
            openListingEditorDialog(mode, sectionIndex, listingIndex, listingType);
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
    var openListingEditorDialog = function(mode, sectionNumber, listingIndex, listingType) {
         setSectionText(
            stripComments(
                getSectionText()
            )
        );
        mw.loader.using( ['jquery.ui'], function () {
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
            var form = $(createForm(mode, listingParameters, listingTemplateAsMap));
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
                                Callbacks.VALIDATE_FORM_CALLBACKS,
                                PROJECT_CONFIG.REPLACE_NEW_LINE_CHARS,
                                PROJECT_CONFIG.APPEND_FULL_STOP_TO_DESCRIPTION,
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
        });
    };

    /**
     * Commented-out listings can result in the wrong listing being edited, so
     * strip out any comments and replace them with placeholders that can be
     * restored prior to saving changes.
     */
    var stripComments = require( './stripComments.js' );

    /**
     * Given a listing type, return the appropriate entry from the
     * LISTING_TEMPLATES array. This method returns the entry for the default
     * listing template type if not enty exists for the specified type.
     */
    var getListingInfo = require( './getListingInfo.js' );

    var isCustomListingType = require( './isCustomListingType.js' );

    var validateForm = require( './validateForm.js' );

    var formToText = require( './formToText.js' );

    var showPreview = function(listingTemplateAsMap) {
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

    // expose public members
    return {
        initListingEditorDialog,
        MODE_ADD,
        MODE_EDIT
    };
};

module.exports = Core;
