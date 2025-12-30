const autocompletes = require( '../autocompletes.js' );
const htmlSisterSites = require( './html.js' );
const { WIKIPEDIA_URL, WIKIDATA_URL, COMMONS_URL, LANG } = require( '../globalConfig.js' );
const listingEditorSync = require( '../listingEditorSync.js' );
const {
    wikidataRemove,
    setWikidataInputFields,
    updateWikidataInputLabel, sisterSiteLinkDisplay
} = require( './ui.js' );

const updateWikidataSharedFields = require( './updateWikidataSharedFields.js' );

const launchSyncDialog = require( './launchSyncDialog.js' );

const getWikidataFromWikipedia = require( './getWikidataFromWikipedia.js' );

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

const quickUpdateWikidataSharedFields = require( './quickUpdateWikidataSharedFields.js' );

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
