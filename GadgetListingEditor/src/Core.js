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
        EDITOR_SUMMARY_SELECTOR,
        EDITOR_MINOR_EDIT_SELECTOR,
        EDITOR_FORM_SELECTOR,
        EDITOR_CLOSED_SELECTOR
    } = Config;

    var api = new mw.Api();
    const { MODE_ADD, MODE_EDIT } = require( './mode.js' );
    var SAVE_FORM_SELECTOR = '#progress-dialog';
    var CAPTCHA_FORM_SELECTOR = '#captcha-dialog';
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
        if (isCustomListingType(listingType)) {
            $(`#${listingParameters[LISTING_TYPE_PARAMETER].id}`, form).append( $( '<option></option>').attr( {value: listingType }).text( listingType ) );
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
                            formToText(mode, listingTemplateWikiSyntax, listingTemplateAsMap, sectionNumber);
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
                            formToText(mode, listingTemplateWikiSyntax, listingTemplateAsMap, sectionNumber);
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

    /**
     * Convert the listing editor form entry fields into wiki text. This
     * method converts the form entry fields into a listing template string,
     * replaces the original template string in the section text with the
     * updated entry, and then submits the section text to be saved on the
     * server.
     */
    var formToText = function(mode, listingTemplateWikiSyntax, listingTemplateAsMap, sectionNumber) {
        var listing = listingTemplateAsMap;
        var defaultListingParameters = getListingInfo(DEFAULT_LISTING_TEMPLATE);
        var listingTypeInput = defaultListingParameters[LISTING_TYPE_PARAMETER].id;
        var listingType = $(`#${listingTypeInput}`).val();
        var listingParameters = getListingInfo(listingType);
        for (var parameter in listingParameters) {
            listing[parameter] = $(`#${listingParameters[parameter].id}`).val();
        }
        for (var i=0; i < Callbacks.SUBMIT_FORM_CALLBACKS.length; i++) {
            Callbacks.SUBMIT_FORM_CALLBACKS[i](listing, mode);
        }
        var text = listingToStr(listing);
        var summary = editSummarySection();
        if (mode == MODE_ADD) {
            summary = updateSectionTextWithAddedListing(summary, text, listing);
        } else {
            summary = updateSectionTextWithEditedListing(summary, text, listingTemplateWikiSyntax);
        }
        summary += $("#input-name").val();
        if ($(EDITOR_SUMMARY_SELECTOR).val() !== '') {
            summary += ` - ${$(EDITOR_SUMMARY_SELECTOR).val()}`;
        }
        var minor = $(EDITOR_MINOR_EDIT_SELECTOR).is(':checked') ? true : false;
        saveForm(summary, minor, sectionNumber, '', '');
        return;
    };

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

    /**
     * Begin building the edit summary by trying to find the section name.
     */
    var editSummarySection = require( './editSummarySection.js' );
    var getSectionName = require( './getSectionName.js' );
    var updateSectionTextWithAddedListing = require( './updateSectionTextWithAddedListing' );
    var updateSectionTextWithEditedListing = require( './updateSectionTextWithEditedListing' );

    /**
     * Render a dialog that notifies the user that the listing editor changes
     * are being saved.
     */
    var savingForm = function() {
        // if a progress dialog is already open, get rid of it
        if ($(SAVE_FORM_SELECTOR).length > 0) {
            dialog.destroy(SAVE_FORM_SELECTOR);
        }
        var progress = $(`<div id="progress-dialog">${translate( 'saving' )}</div>`);
        dialog.open(progress, {
            modal: true,
            height: 100,
            width: 300,
            title: ''
        });
        $(".ui-dialog-titlebar").hide();
    };

    const savePayload = require( './savePayload.js' );

    /**
     * Execute the logic to post listing editor changes to the server so that
     * they are saved. After saving the page is refreshed to show the updated
     * article.
     */
    var saveForm = function(summary, minor, sectionNumber, cid, answer) {
        var editPayload = {
            action: "edit",
            title: mw.config.get( "wgPageName" ),
            section: sectionNumber,
            text: getSectionText(),
            summary,
            captchaid: cid,
            captchaword: answer
        };
        if (minor) {
            $.extend( editPayload, { minor: 'true' } );
        }
        savePayload( editPayload).then(function(data) {
            if (data && data.edit && data.edit.result == 'Success') {
                if ( data.edit.nochange !== undefined ) {
                    alert( 'Save skipped as there was no change to the content!' );
                    dialog.destroy(SAVE_FORM_SELECTOR);
                    return;
                }
                // since the listing editor can be used on diff pages, redirect
                // to the canonical URL if it is different from the current URL
                var canonicalUrl = $("link[rel='canonical']").attr("href");
                var currentUrlWithoutHash = window.location.href.replace(window.location.hash, "");
                if (canonicalUrl && currentUrlWithoutHash != canonicalUrl) {
                    var sectionName = mw.util.escapeIdForLink(getSectionName());
                    if (sectionName.length) {
                        canonicalUrl += `#${sectionName}`;
                    }
                    window.location.href = canonicalUrl;
                } else {
                    window.location.reload();
                }
            } else if (data && data.error) {
                saveFailed(`${translate( 'submitApiError' )} "${data.error.code}": ${data.error.info}` );
            } else if (data && data.edit.spamblacklist) {
                saveFailed(`${translate( 'submitBlacklistError' )}: ${data.edit.spamblacklist}` );
            } else if (data && data.edit.captcha) {
                dialog.destroy(SAVE_FORM_SELECTOR);
                captchaDialog(summary, minor, sectionNumber, data.edit.captcha.url, data.edit.captcha.id);
            } else {
                saveFailed(translate( 'submitUnknownError' ));
            }
        }, function(code, result) {
            if (code === "http") {
                saveFailed(`${translate( 'submitHttpError' )}: ${result.textStatus}` );
            } else if (code === "ok-but-empty") {
                saveFailed(translate( 'submitEmptyError' ));
            } else {
                saveFailed(`${translate( 'submitUnknownError' )}: ${code}` );
            }
        });
        savingForm();
    };

    /**
     * If an error occurs while saving the form, remove the "saving" dialog,
     * restore the original listing editor form (with all user content), and
     * display an alert with a failure message.
     */
    var saveFailed = function(msg) {
        dialog.destroy(SAVE_FORM_SELECTOR);
        dialog.open($(EDITOR_FORM_SELECTOR));
        alert(msg);
    };

    /**
     * If the result of an attempt to save the listing editor content is a
     * Captcha challenge then display a form to allow the user to respond to
     * the challenge and resubmit.
     */
    var captchaDialog = function(summary, minor, sectionNumber, captchaImgSrc, captchaId) {
        // if a captcha dialog is already open, get rid of it
        if ($(CAPTCHA_FORM_SELECTOR).length > 0) {
            dialog.destroy(CAPTCHA_FORM_SELECTOR);
        }
        var captcha = $('<div id="captcha-dialog">').text(translate( 'externalLinks' ));
        $('<img class="fancycaptcha-image">')
                .attr('src', captchaImgSrc)
                .appendTo(captcha);
        $('<label for="input-captcha">').text(translate( 'enterCaptcha' )).appendTo(captcha);
        $('<input id="input-captcha" type="text">').appendTo(captcha);
        dialog.open(captcha, {
            modal: true,
            title: translate( 'enterCaptcha' ),
            buttons: [
                {
                    text: translate( 'submit' ),
                    // eslint-disable-next-line object-shorthand
                    click: function() {
                        saveForm(summary, minor, sectionNumber, captchaId, $('#input-captcha').val());
                        dialog.destroy(this);
                    }
                },
                {
                    text: translate( 'cancel' ),
                    // eslint-disable-next-line object-shorthand
                    click: function() {
                        dialog.destroy(this);
                    }
                }
            ]
        });
    };

    // expose public members
    return {
        initListingEditorDialog,
        MODE_ADD,
        MODE_EDIT
    };
};

module.exports = Core;
