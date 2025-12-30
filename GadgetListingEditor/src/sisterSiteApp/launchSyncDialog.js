
const { LANG } = require( '../globalConfig.js' );
const trimDecimal = require( '../trimDecimal.js' );
const dialog = require( '../dialogs.js' );
const parseDMS = require( '../parseDMS.js' );
const updateFieldIfNotNull = require( './updateFieldIfNotNull.js' );
const listingEditorSync = require( '../listingEditorSync.js' );
const { translate } = require( '../translate.js' );
const { getConfig } = require( '../Config.js' );
const {
    showWikidataFields,
    hideWikidataFields
} = require( './ui.js' );

const makeSubmitFunction = function(SisterSite, commonsLink, wikipediaLink, $syncDialogElement) {
    return () => {
        const { WIKIDATA_CLAIMS, LISTING_TEMPLATES } = getConfig();
        const { API_WIKIDATA, sendToWikidata, changeOnWikidata,
            removeFromWikidata, ajaxSisterSiteSearch } = SisterSite;

        listingEditorSync.$element().find('input[id]:radio:checked').each(function () {
            var label = $(`label[for="${$(this).attr('id')}"]`);
            var syncedValue = label.text().split('\n');
            var field = JSON.parse($(this).parents('.choose-row').find('#has-json > input:hidden:not(:radio)').val()); // not radio needed, remotely_synced values use hidden radio buttons
            var editorField = [];
            for( var i = 0; i < field.fields.length; i++ ) { editorField[i] = `#${LISTING_TEMPLATES.listing[field.fields[i]].id}`; }
            var guidObj = $(this).parents('.choose-row').find('#has-guid > input:hidden:not(:radio)').val();

            if ( field.p === WIKIDATA_CLAIMS.coords.p ) { //first latitude, then longitude
                var DDValue = [];
                for ( i = 0; i < editorField.length; i++) {
                    DDValue[i] = syncedValue[i] ?
                        trimDecimal(parseDMS(syncedValue[i]), 6) : '';
                    updateFieldIfNotNull(editorField[i], syncedValue[i], field.remotely_sync);
                }
                // TODO: make the find on map link work for placeholder coords
                if( (DDValue[0]==='') && (DDValue[1]==='') ) {
                    syncedValue = ''; // dummy empty value to removeFromWikidata
                } else if( !isNaN(DDValue[0]) && !isNaN(DDValue[1]) ){
                    var precision = Math.min(DDValue[0].toString().replace(/\d/g, "0").replace(/$/, "1"), DDValue[1].toString().replace(/\d/g, "0").replace(/$/, "1"));
                    syncedValue = `{ "latitude": ${DDValue[0]}, "longitude": ${DDValue[1]}, "precision": ${precision} }`;
                }
            } else {
                syncedValue = syncedValue[0]; // remove dummy newline
                updateFieldIfNotNull(editorField[0], syncedValue, field.remotely_sync);
                //After the sync with WD force the link to the WP & Common resource to be hidden as naturally happen in quickUpdateWikidataSharedFields
                //a nice alternative is to update the links in both functions
                if( $(this).attr('name') == 'wikipedia' ) {
                    wikipediaLink(syncedValue, $("#listing-editor"));
                }
                if( field.p === WIKIDATA_CLAIMS.image.p ) {
                    commonsLink(syncedValue, $("#listing-editor"));
                }
                if( syncedValue !== '') {
                    if( field.p === WIKIDATA_CLAIMS.email.p ) {
                        syncedValue = `mailto:${syncedValue}`;
                    }
                    syncedValue = `"${syncedValue}"`;
                }
            }

            if( (field.doNotUpload !== true) && ($(this).attr('id').search(/-wd$/) === -1) ) { // -1: regex not found
                ajaxSisterSiteSearch(
                    API_WIKIDATA,
                    {
                        action: 'wbgetentities',
                        ids: field.p,
                        props: 'datatype',
                    }
                ).then( ( jsonObj ) => {
                     //if ( TODO: add logic for detecting Wikipedia and not doing this test. Otherwise get an error trying to find undefined. Keep in mind that we would in the future call sitelink changing here maybe. Not urgent, error harmless ) { }
                    /*else*/ if ( jsonObj.entities[field.p].datatype === 'monolingualtext' ) {
                        syncedValue = `{"text": ${syncedValue}, "language": "${LANG}"}`;
                    }
                    if ( guidObj === "null" ) { // no value on Wikidata, string "null" gets saved in hidden field. There should be no cases in which there is no Wikidata item but this string does not equal "null"
                        if (syncedValue !== '') {
                            sendToWikidata(field.p , syncedValue, 'value');
                        }
                    } else {
                        if ( syncedValue !== "" ) {
                            // this is changing, for when guid is not null and neither is the value
                            // Wikidata silently ignores a request to change a value to its existing value
                            changeOnWikidata(guidObj, field.p, syncedValue, 'value');
                        } else if( (field.p !== WIKIDATA_CLAIMS.coords.p) || (DDValue[0] === '' && DDValue[1] === '') ) {
                            removeFromWikidata(guidObj);
                        }
                    }
                } );
            }
        });

        dialog.close( $syncDialogElement );
    }
};

module.exports = function (jsonObj, wikidataRecord, SisterSite, commonsLink, wikipediaLink) {
    const $syncDialogElement = listingEditorSync.init(
        SisterSite, jsonObj, wikidataRecord
    );
    const submitFunction = makeSubmitFunction( SisterSite, commonsLink, wikipediaLink, $syncDialogElement );
    dialog.open($syncDialogElement, {
        title: translate( 'syncTitle' ),
        dialogClass: 'listing-editor-dialog listing-editor-dialog--wikidata-shared',

        buttons: [
            {
                text: translate( 'submit' ),
                click: submitFunction,
            },
            {
                text: translate( 'cancel' ),
                // eslint-disable-next-line object-shorthand
                click: function() {
                    dialog.close(this);
                }
            },
        ],
        // eslint-disable-next-line object-shorthand
        open: function() {
            hideWikidataFields();
        },
        // eslint-disable-next-line object-shorthand
        close: function() {
            showWikidataFields();
            //listingEditorSync.destroy();
            document.getElementById("listing-editor-sync").outerHTML = ""; // delete the dialog. Direct DOM manipulation so the model gets updated. This is to avoid issues with subsequent dialogs no longer matching labels with inputs because IDs are already in use.
        }
    });
    if($syncDialogElement.find('.sync_label').length === 0) { // if no choices, close the dialog and display a message
        submitFunction();
        listingEditorSync.destroy();
        alert( translate( 'wikidataSharedMatch' ) );
    }

    $syncDialogElement.find('.clear').on( 'click',  function() {
        $syncDialogElement.find('input:radio:not([id]):enabled').prop('checked', true);
    });
    $syncDialogElement.find('.syncSelect').on( 'click',  function() {
        const field = $(this).attr('name'); // wv or wd
        $syncDialogElement.find('input[type=radio]').prop('checked', false);
        $syncDialogElement.find(`input[id$=${field}]`).prop('checked', true);
    });
    $syncDialogElement.find('#autoSelect').on( 'click',  function() { // auto select non-empty values
        $syncDialogElement.find('.choose-row').each(function () {
            var WD_value = $(this).find('label:first').text().trim().length;
            var WV_value = $(this).find('label:last').text().trim().length;
            $(this).find('input[type="radio"]:eq(1)').prop('checked', true); // init with no preferred value
            if (WD_value) {
                if (!WV_value) {
                    $(this).find('input[type="radio"]:first').prop('checked', true); //if WD label has text while WV don't, select WD
                }
            } else if (WV_value) {
                $(this).find('input[type="radio"]:last').prop('checked', true); //if WD label has no text while WV do, select WV
            }
        });
    });
};