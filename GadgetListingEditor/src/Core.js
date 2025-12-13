var DB_NAME = mw.config.get( 'wgDBname' );
const dialog = require( './dialogs.js' );
const IS_LOCALHOST = window.location.host.indexOf( 'localhost' ) > -1;
const listingEditorSync = require( './listingEditorSync.js' );
const renderSisterSiteApp = require( './sisterSiteApp/render.js' );

var Core = function( Callbacks, Config, PROJECT_CONFIG, translate ) {
    const {
        ALLOW_UNRECOGNIZED_PARAMETERS,
        EDITOR_FORM_HTML,
        LISTING_TYPE_PARAMETER,
        SECTION_TO_TEMPLATE_TYPE,
        DEFAULT_LISTING_TEMPLATE,
        EDITOR_SUMMARY_SELECTOR,
        EDITOR_MINOR_EDIT_SELECTOR,
        LISTING_CONTENT_PARAMETER,
        LISTING_TEMPLATES,
        EDITOR_FORM_SELECTOR,
        EDITOR_CLOSED_SELECTOR
    } = Config;

    var api = new mw.Api();
    const { MODE_ADD, MODE_EDIT } = require( './mode.js' );
    // selector that identifies the edit link as created by the
    // addEditButtons() function
    var EDIT_LINK_SELECTOR = '.vcard-edit-button';
    var SAVE_FORM_SELECTOR = '#progress-dialog';
    var CAPTCHA_FORM_SELECTOR = '#captcha-dialog';
    var sectionText, inlineListing, replacements = {};
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

    /**
     * Determine whether a listing entry is within a paragraph rather than
     * an entry in a list; inline listings will be formatted slightly
     * differently than entries in lists (no newlines in the template syntax,
     * skip empty fields).
     */
    var isInline = function(entry) {
        // if the edit link clicked is within a paragraph AND, since
        // newlines in a listing description will cause the Mediawiki parser
        // to close an HTML list (thus triggering the "is edit link within a
        // paragraph" test condition), also verify that the listing is
        // within the expected listing template span tag and thus hasn't
        // been incorrectly split due to newlines.
        return (entry.closest('p').length !== 0 && entry.closest('span.vcard').length !== 0);
    };

    /**
     * Given a DOM element, find the nearest editable section (h2 or h3) that
     * it is contained within.
     */
    var findSectionHeading = function(element) {
        // mw-h3section and mw-h2section can be removed when useparsoid=1 is everywhere.
        return element.closest('div.mw-h3section, div.mw-h2section, section');
    };

    /**
     * Given an editable heading, examine it to determine what section index
     * the heading represents. First heading is 1, second is 2, etc.
     */
    var findSectionIndex = function(heading) {
        if (heading === undefined) {
            return 0;
        }
        var link = heading.find('.mw-editsection a').attr('href');
        return (link !== undefined) ? link.split('=').pop() : 0;
    };

    /**
     * Given an edit link that was clicked for a listing, determine what index
     * that listing is within a section. First listing is 0, second is 1, etc.
     */
    var findListingIndex = function(sectionHeading, clicked) {
        var count = 0;
        $(EDIT_LINK_SELECTOR, sectionHeading).each(function() {
            if (clicked.is($(this))) {
                return false;
            }
            count++;
        });
        return count;
    };

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

    var replaceSpecial = require( './replaceSpecial.js' );

    /**
     * Return a regular expression that can be used to find all listing
     * template invocations (as configured via the LISTING_TEMPLATES map)
     * within a section of wikitext. Note that the returned regex simply
     * matches the start of the template ("{{listing") and not the full
     * template ("{{listing|key=value|...}}").
     */
    var getListingTypesRegex = function() {
        var regex = [];
        for (var key in LISTING_TEMPLATES) {
            regex.push(key);
        }
        return new RegExp( PROJECT_CONFIG.listingTypeRegExp.replace( '%s', regex.join( '|' ) ), 'ig' );
    };

    /**
     * Given a listing index, return the full wikitext for that listing
     * ("{{listing|key=value|...}}"). An index of 0 returns the first listing
     * template invocation, 1 returns the second, etc.
     */
    var getListingWikitextBraces = function(listingIndex) {

        sectionText = sectionText.replace(/[^\S\n]+/g,' ');
        // find the listing wikitext that matches the same index as the listing index
        var listingRegex = getListingTypesRegex();
        // look through all matches for "{{listing|see|do...}}" within the section
        // wikitext, returning the nth match, where 'n' is equal to the index of the
        // edit link that was clicked
        var listingSyntax, regexResult, listingMatchIndex;

        for (var i = 0; i <= listingIndex; i++) {
            regexResult = listingRegex.exec(sectionText);
            listingMatchIndex = regexResult.index;
            listingSyntax = regexResult[1];
        }
        // listings may contain nested templates, so step through all section
        // text after the matched text to find MATCHING closing braces
        // the first two braces are matched by the listing regex and already
        // captured in the listingSyntax variable
        var curlyBraceCount = 2;
        var endPos = sectionText.length;
        var startPos = listingMatchIndex + listingSyntax.length;
        var matchFound = false;
        for (var j = startPos; j < endPos; j++) {
            if (sectionText[j] === '{') {
                ++curlyBraceCount;
            } else if (sectionText[j] === '}') {
                --curlyBraceCount;
            }
            if (curlyBraceCount === 0 && (j + 1) < endPos) {
                listingSyntax = sectionText.substring(listingMatchIndex, j + 1);
                matchFound = true;
                break;
            }
        }
        if (!matchFound) {
            listingSyntax = sectionText.substring(listingMatchIndex);
        }
        return listingSyntax.trim();
    };

    /**
     * Convert raw wiki listing syntax into a mapping of key-value pairs
     * corresponding to the listing template parameters.
     */
    var wikiTextToListing = function(listingTemplateWikiSyntax) {
        var typeRegex = getListingTypesRegex();
        // convert "{{see" to {{listing|type=see"
        listingTemplateWikiSyntax = listingTemplateWikiSyntax.replace(typeRegex,`{{listing| ${LISTING_TYPE_PARAMETER}=$2$3`);
        // remove the trailing braces
        listingTemplateWikiSyntax = listingTemplateWikiSyntax.slice(0,-2);
        var listingTemplateAsMap = {};
        var lastKey;
        var listParams = listingTemplateToParamsArray(listingTemplateWikiSyntax);
        for (var j=1; j < listParams.length; j++) {
            var param = listParams[j];
            var index = param.indexOf('=');
            if (index > 0) {
                // param is of the form key=value
                var key = param.substr(0, index).trim();
                var value = param.substr(index+1).trim();
                listingTemplateAsMap[key] = value;
                lastKey = key;
            } else if (lastKey && listingTemplateAsMap[lastKey].length) {
                // there was a pipe character within a param value, such as
                // "key=value1|value2", so just append to the previous param
                listingTemplateAsMap[lastKey] += `|${param}`;
            }
        }
        for (var loopKey1 in listingTemplateAsMap) {
            // if the template value contains an HTML comment that was
            // previously converted to a placehold then it needs to be
            // converted back to a comment so that the placeholder is not
            // displayed in the edit form
            listingTemplateAsMap[loopKey1] = restoreComments(listingTemplateAsMap[loopKey1], false);
        }
        if (listingTemplateAsMap[LISTING_CONTENT_PARAMETER]) {
            // convert paragraph tags to newlines so that the content is more
            // readable in the editor window
            listingTemplateAsMap[LISTING_CONTENT_PARAMETER] = listingTemplateAsMap[LISTING_CONTENT_PARAMETER].replace(/\s*<p>\s*/g, '\n\n');
            listingTemplateAsMap[LISTING_CONTENT_PARAMETER] = listingTemplateAsMap[LISTING_CONTENT_PARAMETER].replace(/\s*<br\s*\/?>\s*/g, '\n');
        }
        // sanitize the listing type param to match the configured values, so
        // if the listing contained "Do" it will still match the configured "do"
        for (var loopKey2 in LISTING_TEMPLATES) {
            if (listingTemplateAsMap[LISTING_TYPE_PARAMETER].toLowerCase() === loopKey2.toLowerCase()) {
                listingTemplateAsMap[LISTING_TYPE_PARAMETER] = loopKey2;
                break;
            }
        }
        return listingTemplateAsMap;
    };

    /**
     * Split the raw template wikitext into an array of params. The pipe
     * symbol delimits template params, but this method will also inspect the
     * content to deal with nested templates or wikilinks that might contain
     * pipe characters that should not be used as delimiters.
     */
    var listingTemplateToParamsArray = require( './listingTemplateToParamsArray.js' );

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
        inlineListing = (mode === MODE_EDIT && isInline(clicked));

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
                sectionText = data.query.pages[ 0 ].revisions[ 0 ].content;
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
        sectionText = stripComments(sectionText);
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
    var stripComments = function(text) {
        var comments = text.match(/<!--[\s\S]*?-->/mig);
        if (comments !== null ) {
            for (var i = 0; i < comments.length; i++) {
                var comment = comments[i];
                var rep = `<<<COMMENT${i}>>>`;
                text = text.replace(comment, rep);
                replacements[rep] = comment;
            }
        }
        return text;
    };

    /**
     * Search the text provided, and if it contains any text that was
     * previously stripped out for replacement purposes, restore it.
     */
    var restoreComments = function(text, resetReplacements) {
        for (var key in replacements) {
            var val = replacements[key];
            text = text.replace(key, val);
        }
        if (resetReplacements) {
            replacements = {};
        }
        return text;
    };

    /**
     * Given a listing type, return the appropriate entry from the
     * LISTING_TEMPLATES array. This method returns the entry for the default
     * listing template type if not enty exists for the specified type.
     */
    var getListingInfo = function(type) {
        return (isCustomListingType(type)) ? LISTING_TEMPLATES[DEFAULT_LISTING_TEMPLATE] : LISTING_TEMPLATES[type];
    };

    /**
     * Determine if the specified listing type is a custom type - for example "go"
     * instead of "see", "do", "listing", etc.
     */
    var isCustomListingType = function(listingType) {
        return !(listingType in LISTING_TEMPLATES);
    };

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
    var editSummarySection = function() {
        var sectionName = getSectionName();
        return (sectionName.length) ? `/* ${sectionName} */ ` : "";
    };

    var getSectionName = function() {
        var HEADING_REGEX = /^=+\s*([^=]+)\s*=+\s*\n/;
        var result = HEADING_REGEX.exec(sectionText);
        return (result !== null) ? result[1].trim() : "";
    };

    /**
     * After the listing has been converted to a string, add additional
     * processing required for adds (as opposed to edits), returning an
     * appropriate edit summary string.
     */
    var updateSectionTextWithAddedListingDefault = function(originalEditSummary, listingWikiText) {
        var summary = originalEditSummary;
        summary += translate( 'added' );
        // add the new listing to the end of the section. if there are
        // sub-sections, add it prior to the start of the sub-sections.
        var index = sectionText.indexOf('===');
        if (index === 0) {
            index = sectionText.indexOf('====');
        }
        if (index > 0) {
            sectionText = `${sectionText.substr(0, index)}* ${listingWikiText
                     }\n${sectionText.substr(index)}`;
        } else {
            sectionText += `\n* ${listingWikiText}`;
        }
        sectionText = restoreComments(sectionText, true);
        return summary;
    };

    var updateSectionTextWithAddedListingIt = function (originalEditSummary, listingWikiText, listing) {
        var summary = originalEditSummary;
        sectionText = restoreComments(sectionText, true);
        summary += translate( 'added' );
        //Creo un listing commentato dello stesso tipo di quello che aggiungerò.
        //Se nella sezione in cui andrò a scrivere troverò questo listing commentato, lo rimpiazzerò col nuovo.
        var commentedListing = `<!--* {{${listing[LISTING_TYPE_PARAMETER]}\n| nome= | alt= | sito= | email=\n| indirizzo= | lat= | long= | indicazioni=\n| tel= | numero verde= | fax=\n|`;
        if (listing[LISTING_TYPE_PARAMETER] !== 'sleep') {
            commentedListing += " orari= | prezzo=\n";
        } else {
            commentedListing += " checkin= | checkout= | prezzo=\n";
        }
        commentedListing += "| descrizione=\n}}-->\n";
        var index = 0;
        var index1 = sectionText.indexOf('===');
        var index2 = sectionText.indexOf('<!--===');
        var index3 = sectionText.indexOf('====');
        var index4 = sectionText.indexOf(`=== ${translate( 'budget' )} ===`);
        var index5 = sectionText.indexOf(`<!--=== ${translate( 'midrange' )} ===-->`);
        var index6 = sectionText.indexOf(`=== ${translate( 'splurge' )} ===`);
        var index7 = sectionText.indexOf(`<!--=== ${translate( 'splurge' )} ===`);
        var splurgeOffset = 0;
        if (index7 > 0) {
            splurgeOffset = 4;
        }
        if ( (index1 === 0) && (index2 === 0) ) {
            index = index3;
        } else if (index1 === 0) {
            index = index2;
        } else if (index2 === 0) {
            index = index1;
        } else if (index1 < index2) {
            index = index1;
        } else if (index6 > 0) {
            index = index6;
        } else {
            index = index2;
        }
        if (index > 0) {
            var strApp = sectionText.substr(0, index).replace(/(\r\n|\n|\r)/gm," ").trim();
            if (strApp.substring(strApp.length-5) == '{{-}}') {
                var indexApp = sectionText.lastIndexOf('{{-}}');
                sectionText = `${sectionText.substr(0, indexApp).replace(commentedListing,'')}* ${listingWikiText}\n{{-}}${sectionText.substr(indexApp+5)}`;
            } else {
                if( (index4 > 0) && (index6 > 0) ) {
                    //Mi assicuro di essere in Dove mangiare/dormire (le uniche divise per fascia di prezzo)
                    if ( index5 > 0) {
                        //Il primo elemento viene aggiunto nella sottosezione "Prezzi medi" (rimuovendone il commento)
                        sectionText = `${sectionText.substr(0, index6-splurgeOffset).replace(`<!--=== ${translate( 'midrange' )} ===-->\n${commentedListing}`,`=== ${translate( 'midrange' )} ===\n`)}* ${listingWikiText}\n\n${sectionText.substr(index6-splurgeOffset)}`;
                    } else {
                        //I successivi elementi vengono accodati nella sottosezione "Prezzi medi" (già priva di commento)
                        sectionText = `${sectionText.substr(0, index6-splurgeOffset).replace(/\n+$/,'\n')}* ${listingWikiText}\n\n${sectionText.substr(index6-splurgeOffset)}`;
                    }
                } else {
                    var addbr = '';
                    if( sectionText.substr(index-2, 1).charCodeAt(0) != 10 )
                        addbr = '\n';
                    sectionText = `${sectionText.substr(0, index-1).replace(commentedListing,'') + addbr}* ${listingWikiText}\n${sectionText.substr(index-1)}`;
                }
            }
        } else {
            var strApp2 = sectionText.replace(/(\r\n|\n|\r)/gm," ").trim();
            if (strApp2.substring(strApp2.length-5) == '{{-}}') {
                var indexApp2 = sectionText.lastIndexOf('{{-}}');
                sectionText = `${sectionText.substr(0, indexApp2).replace(commentedListing,'')}* ${listingWikiText}\n{{-}}`;
            } else {
                sectionText = `${sectionText.replace(commentedListing,'')}\n* ${listingWikiText}`;
            }
        }
        return summary;
    };

    var updateSectionTextWithAddedListing = function (originalEditSummary, listingWikiText, listing) {
        switch ( DB_NAME ) {
            case 'itwikivoyage':
                return updateSectionTextWithAddedListingIt(originalEditSummary, listingWikiText, listing);
            default:
                return updateSectionTextWithAddedListingDefault(originalEditSummary, listingWikiText, listing);
        }
    };

    /**
     * After the listing has been converted to a string, add additional
     * processing required for edits (as opposed to adds), returning an
     * appropriate edit summary string.
     */
    var updateSectionTextWithEditedListing = function(editSummary, listingWikiText, listingTemplateWikiSyntax) {
        // escaping '$&' since in replace regex it means "substitute the whole content"
        listingWikiText = listingWikiText.replace( /\$&/g, '&#36;&');
        if ($(EDITOR_CLOSED_SELECTOR).is(':checked')) {
            listingWikiText = '';
            editSummary += translate( 'removed' );
            // TODO: RegEx change to delete the complete row when listing is preceeded by templates showing just icons
            var listRegex = new RegExp(`(\\n+[\\:\\*\\#]*)?\\s*${replaceSpecial(listingTemplateWikiSyntax)}`);
            sectionText = sectionText.replace(listRegex, listingWikiText);
        } else {
            editSummary += translate( 'updated' );
            sectionText = sectionText.replace(listingTemplateWikiSyntax, listingWikiText);
        }
        sectionText = restoreComments(sectionText, true);
        sectionText = sectionText.replace( /&#36;/g, '$' ); // '&#36;'->'$' restore on global sectionText var
        return editSummary;
    };

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

    const savePayload = ( editPayload ) => {
        const delayedPromise = ( res ) =>
            new Promise( ( resolve ) => {
                setTimeout(() => {
                    resolve( res )
                }, 5000 );
            } );
        switch ( window.__save_debug ) {
            case -1:
                return delayedPromise( { error: 'error' } );
            case -2:
                return delayedPromise( {
                    edit: {
                        captcha: {
                            id: 1,
                            url: 'foo.gif'
                        }
                    }
                } );
            case 0:
                return delayedPromise( {
                    edit: {
                        nochange: true,
                        result: 'Success'
                    }
                } );
            case 1:
                return delayedPromise( {
                    edit: {
                        result: 'Success'
                    }
                } );
            default:
                return api.postWithToken(
                    "csrf",
                    editPayload
                )
        }
    }

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
            text: sectionText,
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

    /**
     * Convert the listing map back to a wiki text string.
     */
    var listingToStr = function(listing) {
        var listingType = listing[LISTING_TYPE_PARAMETER];
        var listingParameters = getListingInfo(listingType);
        var saveStr = '{{';
        if( isCustomListingType(listingType) ) { // type parameter specified explicitly only on custom type
            saveStr += DEFAULT_LISTING_TEMPLATE;
            saveStr += ` | ${LISTING_TYPE_PARAMETER}=${listingType}`;
        } else {
            saveStr += listingType;
        }
        if (!inlineListing && listingParameters[LISTING_TYPE_PARAMETER].newline) {
            saveStr += '\n';
        }
        for (var parameter in listingParameters) {
            var l = listingParameters[parameter];
            if (parameter === LISTING_TYPE_PARAMETER) {
                // "type" parameter was handled previously
                continue;
            }
            if (parameter === LISTING_CONTENT_PARAMETER) {
                // processed last
                continue;
            }
            if (listing[parameter] !== '' || (!l.skipIfEmpty && !inlineListing)) {
                saveStr += `| ${parameter}=${listing[parameter]}`;
            }
            if (!saveStr.match(/\n$/)) {
                if (!inlineListing && l.newline) {
                    saveStr = `${rtrim(saveStr)}\n`;
                } else if (!saveStr.match(/ $/)) {
                    saveStr += ' ';
                }
            }
        }
        if (ALLOW_UNRECOGNIZED_PARAMETERS) {
            // append any unexpected values
            for (var key in listing) {
                if (listingParameters[key]) {
                    // this is a known field
                    continue;
                }
                if (listing[key] === '') {
                    // skip unrecognized fields without values
                    continue;
                }
                saveStr += `| ${key}=${listing[key]}`;
                saveStr += (inlineListing) ? ' ' : '\n';
            }
        }
        saveStr += `| ${LISTING_CONTENT_PARAMETER}=${listing[LISTING_CONTENT_PARAMETER]}`;
        saveStr += (inlineListing || !listingParameters[LISTING_CONTENT_PARAMETER].newline) ? ' ' : '\n';
        saveStr += '}}';
        return saveStr;
    };

    /**
     * Trim whitespace at the end of a string.
     */
    var rtrim = function(str) {
        return str.replace(/\s+$/, '');
    };

    // expose public members
    return {
        initListingEditorDialog,
        MODE_ADD,
        MODE_EDIT
    };
};

module.exports = Core;
