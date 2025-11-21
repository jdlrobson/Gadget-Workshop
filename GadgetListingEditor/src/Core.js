const dialog = require( './dialogs.js' );
const IS_LOCALHOST = window.location.host.indexOf( 'localhost' ) > -1;
const sistersites = require( './components/SisterSites.js' );
const ListingEditorDialog = require( './components/ListingEditorDialog.js' );
const currentEdit = require( './currentEdit.js' );
const { getSectionText, setSectionText } = currentEdit;
const { onMounted, ref } = require( 'vue' );
const { CdxTextInput, CdxTextArea, CdxTabs, CdxTab } = require( '@wikimedia/codex' );
const listingToStr = require( './listingToStr.js' );

var Core = function( Callbacks, Config, PROJECT_CONFIG, translate ) {
    const {
        LISTING_TYPE_PARAMETER,
        SECTION_TO_TEMPLATE_TYPE,
        DEFAULT_LISTING_TEMPLATE,
        EDITOR_SUMMARY_SELECTOR,
        EDITOR_MINOR_EDIT_SELECTOR,
        EDITOR_CLOSED_SELECTOR
    } = Config;

    var api = new mw.Api();
    const { MODE_ADD, MODE_EDIT } = require( './mode.js' );
    var NATL_CURRENCY = [];
    var CC = '';
    var LC = '';

    /**
     * Generate the form UI for the listing editor. If editing an existing
     * listing, pre-populate the form input fields with the existing values.
     */
    // @todo: move to template
    const onFormMounted = ( form, listingParameters, listingTemplateAsMap ) => {
        // populate the empty form with existing values
        for (var parameter in listingParameters) {
            var parameterInfo = listingParameters[parameter];
            if (listingTemplateAsMap[parameter]) {
                $(`#${parameterInfo.id}`, form).val(listingTemplateAsMap[parameter]);
            } else if (parameterInfo.hideDivIfEmpty) {
                $(`#${parameterInfo.hideDivIfEmpty}`, form).hide();
            }
        }
    };

    // @todo: Move to ListingEditorForm.js when onFormMounted removed.
    const createForm = function(listingParameters, listingTemplateAsMap) {
        return {
            name: 'ListingEditorForm',
            props: {
                customListingType: {
                    type: String
                },
                wikipedia: {
                    type: String
                },
                wikidata: {
                    type: String
                },
                image: {
                    type: String
                },
                mode: {
                    type: String
                },
                telephoneCodes: {
                    type: Array
                },
                nationalCurrencies: {
                    type: Array,
                    default: NATL_CURRENCY
                },
                showLastEditedField: {
                    type: Boolean
                },
                currencies: {
                    type: Array,
                    default: [ '€', '$', '£', '¥', '₩' ]
                },
                characters: {
                    type: Array
                }
            },
            template: require( './html.js' ),
            components: {
                CdxTabs,
                CdxTab,
                TelephoneCharInsert: require( './components/TelephoneCharInsert.js' ),
                CdxTextInput,
                CdxTextArea,
                SpecialCharactersString: require( './components/specialCharactersString.js' ),
                sistersites
            },
            setup( { showLastEditedField, mode } ) {
                const tabsData = ref( [
                    {
                        name: 'edit',
                        label: 'edit'
                    }, {
                        name: 'preview',
                        label: 'preview'
                    }
                ] );
                const form = ref(null);
                onMounted( () => {
                    if ( form.value ) {
                        // @todo: move into template
                        onFormMounted( form.value, listingParameters, listingTemplateAsMap );
                        for (var i=0; i < Callbacks.CREATE_FORM_CALLBACKS.length; i++) {
                            Callbacks.CREATE_FORM_CALLBACKS[i]( form.value, mode );
                        }
                    }
                } );

                return {
                    tabsData,
                    form,
                    showLastEditedField
                };
            }
        };
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
        var listingIndex = mode === MODE_ADD ? -1 : findListingIndex(sectionHeading, clicked);
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
                    Callbacks.VALIDATE_FORM_CALLBACKS,
                    PROJECT_CONFIG.REPLACE_NEW_LINE_CHARS,
                    PROJECT_CONFIG.APPEND_FULL_STOP_TO_DESCRIPTION,
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

        const telephoneCodes = [];
        if ( CC ) {
            telephoneCodes.push( CC );
        }
        if ( LC ) {
            telephoneCodes.push( LC );
        }

        const customListingType = isCustomListingType(listingType) ? listingType : undefined;
        const ListingEditorFormDialog = {
            name: 'ListingEditorFormDialog',
            template: `<ListingEditorDialog>
            <ListingForm
                :custom-listing-type="customListingType"
                :wikidata="wikidata"
                :wikipedia="wikipedia"
                :image="image"
                :mode="mode"
                :telephoneCodes="telephoneCodes"
                :characters="characters"
                :show-last-edited-field="showLastEditedField" />
</ListingEditorDialog>`,
            props: {
                customListingType: {
                    type: String
                },
                wikipedia: {
                    type: String
                },
                wikidata: {
                    type: String
                },
                image: {
                    type: String
                },
                mode: {
                    type: String
                },
                telephoneCodes: {
                    type: Array
                },
                characters: {
                    type: Array
                },
                showLastEditedField: {
                    type: Boolean
                }
            },
            components: {
                ListingEditorDialog,
                // @todo: move to props
                ListingForm: createForm( listingParameters, listingTemplateAsMap )
            }
        }
        const { wikipedia, wikidata, image } = listingTemplateAsMap;
        dialog.render( ListingEditorFormDialog, {
            wikipedia, wikidata, image,
            customListingType,
            mode,
            onCaptchaSubmit,
            onSubmit,
            telephoneCodes,
            characters: PROJECT_CONFIG.SPECIAL_CHARS,
            showLastEditedField: mode === MODE_EDIT && PROJECT_CONFIG.SHOW_LAST_EDITED_FIELD,
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
        }, translate);
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
        return saveForm(summary, minor, sectionNumber, '', '');
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
        return savePayload( editPayload ).then(function(data) {
            if (data && data.edit && data.edit.result == 'Success') {
                if ( data.edit.nochange !== undefined ) {
                    alert( 'Save skipped as there was no change to the content!' );
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
                return Promise.reject( {} );
            } else if (data && data.edit.spamblacklist) {
                saveFailed(`${translate( 'submitBlacklistError' )}: ${data.edit.spamblacklist}` );
                return Promise.reject( {} );
            } else if (data && data.edit.captcha) {
                return Promise.reject( {
                    edit: data.edit,
                        args: [
                        summary,
                        minor,
                        sectionNumber,
                        data.edit.captcha.id
                    ]
                } );
            } else {
                saveFailed(translate( 'submitUnknownError' ));
                return Promise.reject( {} );
            }
        }, function(code, result) {
            if (code === "http") {
                saveFailed(`${translate( 'submitHttpError' )}: ${result.textStatus}` );
            } else if (code === "ok-but-empty") {
                saveFailed(translate( 'submitEmptyError' ));
            } else {
                saveFailed(`${translate( 'submitUnknownError' )}: ${code}` );
            }
            return Promise.reject( {} );
        });
    };

    /**
     * If an error occurs while saving the form, remove the "saving" dialog,
     * restore the original listing editor form (with all user content), and
     * display an alert with a failure message.
     */
    var saveFailed = function(msg) {
        alert(msg);
    };

    // expose public members
    return {
        initListingEditorDialog,
        MODE_ADD,
        MODE_EDIT
    };
};

module.exports = Core;
