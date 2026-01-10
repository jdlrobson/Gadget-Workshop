
const { LANG } = require( '../globalConfig.js' );
const trimDecimal = require( '../trimDecimal.js' );
const dialog = require( '../dialogs.js' );
const parseDMS = require( '../parseDMS.js' );
const updateFieldIfNotNull = require( './updateFieldIfNotNull.js' );
const ListingEditorSyncDialog = require( '../components/ListingEditorSyncDialog.js' );
const getSyncValues = require( '../../src/getSyncValues.js' );
const { translate } = require( '../translate.js' );
const { getConfig } = require( '../Config.js' );
const SisterSite = require( '../SisterSite.js' );

const makeSubmitFunction = function( updateModel, ss, closeFn ) {
    return ( close ) => {
        if ( !closeFn ) {
            closeFn = () => close();
        }
        const { WIKIDATA_CLAIMS, LISTING_TEMPLATES } = getConfig();
        const { API_WIKIDATA, sendToWikidata, changeOnWikidata,
            removeFromWikidata, ajaxSisterSiteSearch } = ss;

        $('#listing-editor-sync input[id]:radio:checked').each(function () {
            var label = $(`label[for="${$(this).attr('id')}"]`);
            // @todo: Do not rely on label.text for something so important
            // Switch this to data attribute.
            var syncedValue = label.text().split('\n');
            var field = JSON.parse($(this).parents('.choose-row').find('#has-json > input:hidden:not(:radio)').val()); // not radio needed, remotely_synced values use hidden radio buttons
            var editorField = [];
            for( var i = 0; i < field.fields.length; i++ ) {
                editorField[i] = `#${LISTING_TEMPLATES.listing[field.fields[i]].id}`;
            }
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
                    updateModel( { wikipedia: syncedValue } );
                }
                if( field.p === WIKIDATA_CLAIMS.image.p ) {
                    updateModel( { commons: syncedValue } );
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
                } ).then( closeFn );
            } else {
                closeFn();
            }
        });
    }
};

module.exports = function (jsonObj, wikidataRecord, updateModel, ss, close ) {
    const syncValues = getSyncValues(
        jsonObj, wikidataRecord
    );
    const submitFunction = makeSubmitFunction( updateModel, ss || SisterSite(), close );
    dialog.render( ListingEditorSyncDialog, {
        title: translate( 'syncTitle' ),
        syncValues,
        dialogClass: 'listing-editor-dialog listing-editor-dialog--wikidata-shared',
        onSubmit: submitFunction
    }, translate );

    const $syncDialogElement = $('#listing-editor-sync');
    if($syncDialogElement.find('.sync_label').length === 0) { // if no choices, close the dialog and display a message
        submitFunction();
        alert( translate( 'wikidataSharedMatch' ) );
    }

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