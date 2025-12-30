const { iata } = require( './templates.js' );
const createRadio = require( './createRadio.js' );
const trimDecimal = require( './trimDecimal.js' );
const dialog = require( './dialogs.js' );
const { translate } = require( './translate.js' );
const { getConfig } = require( './Config.js' );

const init = ( SisterSite, jsonObj, wikidataRecord ) => {
    const { wikidataClaim, wikidataWikipedia } = SisterSite;
    const { WIKIDATA_CLAIMS } = getConfig();

    let msg = `<form id="listing-editor-sync">${
    translate( 'wikidataSyncBlurb' )
}<p>
<fieldset>
    <span>
        <span class="wikidata-update"></span>
        <a href="javascript:" class="syncSelect" name="wd" title="${translate( 'selectAll' )}">Wikidata</a>
    </span>
    <a href="javascript:" id="autoSelect" class="listing-tooltip" title="${translate( 'selectAlternatives' )}">Auto</a>
    <span>
        <a href="javascript:" class="syncSelect" name="wv" title="${translate( 'selectAll' )}">Wikivoyage</a>
        <span class="wikivoyage-update"></span>
    </span>
</fieldset>
<div class="editor-fullwidth">`;

    const res = {};
    for (let key in WIKIDATA_CLAIMS) {
        res[key] = {};
        res[key].value = wikidataClaim(jsonObj, wikidataRecord, WIKIDATA_CLAIMS[key].p);
        res[key].guidObj = wikidataClaim(jsonObj, wikidataRecord,
            WIKIDATA_CLAIMS[key].p, true);
        if (key === 'iata') {
            if( res[key].value ) {
                res[key].value = iata.replace( '%s', res[key].value );
            }
            msg += createRadio(WIKIDATA_CLAIMS[key], [res[key].value], res[key].guidObj);
        } else if (key === 'email') {
            if( res[key].value ) {
                res[key].value = res[key].value.replace('mailto:', '');
            }
            msg += createRadio(WIKIDATA_CLAIMS[key], [res[key].value], res[key].guidObj);
        } else if (key === 'coords') {
            if ( res[key].value ) {
                res[key].value.latitude = trimDecimal(res[key].value.latitude, 6);
                res[key].value.longitude = trimDecimal(res[key].value.longitude, 6);
                msg += createRadio(WIKIDATA_CLAIMS[key],
                    [res[key].value.latitude, res[key].value.longitude], res[key].guidObj);
            } else {
                msg += createRadio(WIKIDATA_CLAIMS[key], [res[key].value], res[key].guidObj);
            }
        } else msg += createRadio(WIKIDATA_CLAIMS[key], [res[key].value], res[key].guidObj);
    }
    var wikipedia = wikidataWikipedia(jsonObj, wikidataRecord);
    msg += createRadio( {
            label: translate( 'sharedWikipedia' ),
            fields: ['wikipedia'],
            doNotUpload: true,
            'remotely_sync': true
        },
        [wikipedia],
        $('#input-wikidata-value').val()
    );

    msg += `</div><p><small><a href="javascript:" class="clear">${translate( 'cancelAll' )}</a></small>
</form>`;
    return $( msg );
};

const SYNC_FORM_SELECTOR = '#listing-editor-sync';
const destroy = () => {
    if ($(SYNC_FORM_SELECTOR).length > 0) {
        dialog.destroy(SYNC_FORM_SELECTOR);
    }
};

const $element = () => $( SYNC_FORM_SELECTOR );

module.exports = {
    init,
    destroy,
    $element
};
