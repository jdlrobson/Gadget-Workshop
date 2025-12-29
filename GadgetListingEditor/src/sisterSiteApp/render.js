const autocompletes = require( '../autocompletes.js' );
const trimDecimal = require( '../trimDecimal.js' );
const dialog = require( '../dialogs.js' );
const parseDMS = require( '../parseDMS.js' );
const { iata } = require( '../templates.js' );
const htmlSisterSites = require( './html.js' );
const { WIKIPEDIA_URL, WIKIDATA_URL, COMMONS_URL, LANG } = require( '../globalConfig.js' );
const listingEditorSync = require( '../listingEditorSync.js' );
const updateFieldIfNotNull = require( './updateFieldIfNotNull.js' );
const {
    wikidataRemove,
    setWikidataInputFields,
    showWikidataFields,
    hideWikidataFields,
    updateWikidataInputLabel, sisterSiteLinkDisplay
} = require( './ui.js' );

const makeSubmitFunction = function(SisterSite, Config, commonsLink, wikipediaLink, $syncDialogElement) {
    return () => {
        const { WIKIDATA_CLAIMS, LISTING_TEMPLATES } = Config;
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

const updateWikidataSharedFields = function(
    wikidataRecord, SisterSite
) {
    const { API_WIKIDATA, ajaxSisterSiteSearch } = SisterSite;

    return ajaxSisterSiteSearch(
        API_WIKIDATA,
        {
            action: 'wbgetentities',
            ids: wikidataRecord,
            languages: LANG
        }
    );
}

const launchSyncDialog = function (jsonObj, wikidataRecord, SisterSite, Config, translate, commonsLink, wikipediaLink) {
    const $syncDialogElement = listingEditorSync.init(
        SisterSite, Config, translate, jsonObj, wikidataRecord
    );
    const submitFunction = makeSubmitFunction( SisterSite, Config, commonsLink, wikipediaLink, $syncDialogElement );
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

const getWikidataFromWikipedia = function(titles, SisterSite) {
    const { API_WIKIPEDIA, ajaxSisterSiteSearch, wikipediaWikidata } = SisterSite;
    return ajaxSisterSiteSearch(
        API_WIKIPEDIA,
        {
            action: 'query',
            prop: 'pageprops',
            ppprop: 'wikibase_item',
            indexpageids: 1,
            titles
        }
    ).then( ( jsonObj ) => wikipediaWikidata(jsonObj) );
};

const makeWikidataLink = ( translate ) => {
    return function(form, value) {
        const link = $("<a />", {
            target: "_new",
            href: `${WIKIDATA_URL}/wiki/${mw.util.wikiUrlencode(value)}`,
            title: translate( 'viewWikidataPage' ),
            text: value
        });
        $("#wikidata-value-link", form).html(link);
        $("#wikidata-value-display-container", form).show();
        $('#div_wikidata_update', form).show();
        const $listingEditorSync = listingEditorSync.$element();
        if ( $listingEditorSync.prev().find(".ui-dialog-title").length ) {
            $listingEditorSync.prev()
                .find(".ui-dialog-title")
                .append( ' &mdash; ' )
                .append(link.clone());
        } // add to title of Wikidata sync dialog, if it is open
    };
};

const makeWikipediaLink = ( translate ) => {
    return function(value, form) {
        const wikipediaSiteLinkData = {
            inputSelector: '#input-wikipedia',
            containerSelector: '#wikipedia-value-display-container',
            linkContainerSelector: '#wikipedia-value-link',
            href: `${WIKIPEDIA_URL}/wiki/${mw.util.wikiUrlencode(value)}`,
            linkTitle: translate( 'viewWikipediaPage' )
        };
        sisterSiteLinkDisplay(wikipediaSiteLinkData, form, translate);
        $("#wp-wd", form).show();
        if ( value === '' ) {
            $("#wp-wd").hide();
        }
    };
};

const makeCommonsLink = ( translate ) => {
    const commonsLink = function(value, form) {
        var commonsSiteLinkData = {
            inputSelector: '#input-image',
            containerSelector: '#image-value-display-container',
            linkContainerSelector: '#image-value-link',
            href: `${COMMONS_URL}/wiki/${mw.util.wikiUrlencode(`File:${value}`)}`,
            linkTitle: translate( 'viewCommonsPage' )
        };
        sisterSiteLinkDisplay(commonsSiteLinkData, form, translate);
    };
    return commonsLink;
};

const quickUpdateWikidataSharedFields = function(wikidataRecord, SisterSite, Config, translate) {
    const { API_WIKIDATA, wikidataClaim, wikidataWikipedia,
        ajaxSisterSiteSearch } = SisterSite;
    const { WIKIDATA_CLAIMS, LISTING_TEMPLATES } = Config;
    const ajaxData = {
        action: 'wbgetentities',
        ids: wikidataRecord,
        languages: LANG
    };
    const ajaxSuccess = function (jsonObj) {
        let msg = '';
        const res = [];
        for (let key in WIKIDATA_CLAIMS) {
            res[key] = wikidataClaim(jsonObj, wikidataRecord, WIKIDATA_CLAIMS[key].p);
            if (res[key]) {
                if (key === 'coords') { //WD coords already stored in DD notation; no need to apply any conversion
                    res[key].latitude = trimDecimal(res[key].latitude, 6);
                    res[key].longitude = trimDecimal(res[key].longitude, 6);
                    msg += `\n${WIKIDATA_CLAIMS[key].label}: ${res[key].latitude} ${res[key].longitude}`;
                } else if (key === 'iata') {
                    msg += `\n${WIKIDATA_CLAIMS[key].label}: ${res[key]}`;
                    res[key] = iata.replace( '%s', res[key] );
                } else if (key === 'email') {
                    res[key] = res[key].replace('mailto:', '');
                    msg += `\n${WIKIDATA_CLAIMS[key].label}: ${res[key]}`;
                } else {
                    msg += `\n${WIKIDATA_CLAIMS[key].label}: ${res[key]}`;
                }
            }
        }
        const wikipedia = wikidataWikipedia(jsonObj, wikidataRecord);
        if (wikipedia) {
            msg += `\n${translate( 'sharedWikipedia' )}: ${wikipedia}`;
        }

        if (msg) {
            const result = {
                wikipedia
            };
            if ( confirm( `${translate( 'wikidataShared' )}\n${msg}`) ) {
                for (let key in res) {
                    if (res[key]) {
                        var editorField = [];
                        for( var i = 0; i < WIKIDATA_CLAIMS[key].fields.length; i++ ) {
                            editorField[i] = `#${LISTING_TEMPLATES.listing[WIKIDATA_CLAIMS[key].fields[i]].id}`;
                        }

                        if ( (key !== 'iata') || ($('#input-alt').val() === '') ||
                            (/^IATA: ...$/.test($('#input-alt').val())) ) {
                            if (key === 'coords') {
                                updateFieldIfNotNull(editorField[0], res[key].latitude, WIKIDATA_CLAIMS[key].remotely_sync);
                                updateFieldIfNotNull(editorField[1], res[key].longitude, WIKIDATA_CLAIMS[key].remotely_sync);
                            }  else {
                                updateFieldIfNotNull(editorField[0], res[key], WIKIDATA_CLAIMS[key].remotely_sync);
                                if (key === 'image') {
                                    result.commons = res[ key ];
                                }
                            }
                        }
                    }
                }
                updateFieldIfNotNull('#input-wikipedia', wikipedia, true);
                return result;
            }
        }
        return false;
    };
    return ajaxSisterSiteSearch(API_WIKIDATA, ajaxData, ajaxSuccess);
};

const wikidataLookup = function(ids, SisterSite) {
    const {
        API_WIKIDATA,
        ajaxSisterSiteSearch,
        wikidataLabel
    } = SisterSite;
    // get the display value for the pre-existing wikidata record ID
    return ajaxSisterSiteSearch(
        API_WIKIDATA,
        {
            action: 'wbgetentities',
            ids,
            languages: LANG,
            props: 'labels'
        }
    ).then( ( jsonObj ) =>
        wikidataLabel( jsonObj, ids )
    );
};

module.exports = ( Config, translate, listingTemplateAsMap ) => {
    const SisterSite = require( '../SisterSite.js' )( Config );
    const wikidataLink = makeWikidataLink( translate );
    const wikipediaLink = makeWikipediaLink( translate );
    const commonsLink = makeCommonsLink( translate );

    return ( form ) => {
        const div = document.createElement( 'div' );
        div.innerHTML = htmlSisterSites( translate );
        form[ 0 ].querySelector( 'sistersites' ).replaceWith(div);
        ( () => {
            const { wikipedia, image, wikidata } = listingTemplateAsMap;
            $( '#input-wikipedia', form ).val( wikipedia );
            $( '#input-wikidata-value', form ).val( wikidata );
            $( '#input-wikidata-label', form ).val( wikidata );
            $( '#input-image', form ).val( image );
        } )();

        // get the display value for the pre-existing wikidata record ID
        const value = $("#input-wikidata-value", form).val();
        if (value) {
            wikidataLink(form, value);
            wikidataLookup( value, SisterSite ).then( ( label ) => {
                updateWikidataInputLabel( label );
            } )
        }
        $('#wikidata-shared-quick', form).on( 'click', function() {
            var wikidataRecord = $("#input-wikidata-value", form).val();
            quickUpdateWikidataSharedFields(wikidataRecord, SisterSite, Config, translate).then( ( { wikipedia, commons } ) => {
                if ( wikipedia || commons ) {
                    if (wikipedia) {
                        wikipediaLink(wikipedia);
                    }
                    if ( commons ) {
                        commonsLink( commons );
                    }
                } else {
                    alert( translate( 'wikidataSharedNotFound' ) );
                }
            } );
        });

        $('#wikidata-shared', form).on( 'click', function() {
            const wikidataRecord = $("#input-wikidata-value", form).val();
            updateWikidataSharedFields(
                wikidataRecord, SisterSite
            ).then(( jsonObj ) => {
                wikidataLink("", $("#input-wikidata-value").val()); // called to append the Wikidata link to the dialog title
                launchSyncDialog(
                    jsonObj, wikidataRecord, SisterSite, Config, translate, commonsLink, wikipediaLink
                );
            });
        });

        // add a listener to the "remove" button so that links can be deleted
        $('#wikidata-remove', form).on( 'click', function() {
            wikidataRemove(form);
        });
        $('#input-wikidata-label', form).change(function() {
            if (!$(this).val()) {
                wikidataRemove(form);
            }
        });
        $('#wp-wd', form).on( 'click', function() {
            getWikidataFromWikipedia(
                $("#input-wikipedia", form).val(),
                SisterSite
            ).then( ( wikidataID ) => {
                if( wikidataID ) {
                    setWikidataInputFields( wikidataID );
                    wikidataLink(form, wikidataID);
                }
            })
        });
        autocompletes(
            SisterSite,
            form,
            wikidataLink,
            wikipediaLink,
            commonsLink
        );
    };
}
