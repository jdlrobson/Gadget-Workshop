const { iata } = require( './templates.js' );
const createRadio = require( './createRadio.js' );
const trimDecimal = require( './trimDecimal.js' );
const { getConfig } = require( './Config.js' );
const { translate } = require( './translate.js' );

const ListingEditorSync = ( SisterSite, jsonObj, wikidataRecord ) => {
    const { wikidataClaim, wikidataWikipedia } = SisterSite;
    const { WIKIDATA_CLAIMS } = getConfig();

    const res = {};
    // @todo move to Vue component
    let msg = '';
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
    const wmsg = createRadio( {
            label: translate( "sharedWikipedia" ),
            fields: ['wikipedia'],
            doNotUpload: true,
            'remotely_sync': true
        },
        [wikipedia],
        $('#input-wikidata-value').val()
    );
    msg += wmsg;

    return {
        name: 'ListingEditorSync',
        template: `<form id="listing-editor-sync">
<p>{{
    $translate( 'wikidataSyncBlurb' )
}}</p>
<fieldset>
    <span>
        <span class="wikidata-update"></span>
        <a href="javascript:" class="syncSelect" name="wd"
            :title="$translate( 'selectAll' )">Wikidata</a>
    </span>
    <a href="javascript:" id="autoSelect" class="listing-tooltip"
        :title="$translate( 'selectAlternatives' )">Auto</a>
    <span>
        <a href="javascript:" class="syncSelect"
            name="wv"
            :title="$translate( 'selectAll' )">Wikivoyage</a>
        <span class="wikivoyage-update"></span>
    </span>
</fieldset>
<div class="editor-fullwidth">
${msg}
</div>
<small>
    <a href="javascript:" class="clear">{{ $translate( 'cancelAll' ) }}</a>
</small>
</form>
`,
        setup() {

        }
    };
};

module.exports = ListingEditorSync;
