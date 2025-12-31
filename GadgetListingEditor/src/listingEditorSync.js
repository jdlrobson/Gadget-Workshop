const { iata } = require( './templates.js' );
const prepareRadio = require( './prepareRadio.js' );
const trimDecimal = require( './trimDecimal.js' );
const { getConfig } = require( './Config.js' );
const { translate } = require( './translate.js' );
const ListingSyncRow = require( './components/ListingSyncRow.js' );

// @todo move to Vue component
const ListingEditorSync = ( jsonObj, wikidataRecord ) => {
    const SisterSite = require( './SisterSite.js' )();
    const { wikidataClaim, wikidataWikipedia } = SisterSite;
    const { WIKIDATA_CLAIMS } = getConfig();

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
        } else if (key === 'email') {
            if( res[key].value ) {
                res[key].value = res[key].value.replace('mailto:', '');
            }
        } else if (key === 'coords') {
            if ( res[key].value ) {
                res[key].value.latitude = trimDecimal(res[key].value.latitude, 6);
                res[key].value.longitude = trimDecimal(res[key].value.longitude, 6);
            }
        }
    }
    const syncValues = [];
    for (let key in res) {
        const value = res[key].value;
        const guidObj = res[key].guidObj;
        if (key === 'coords' && value) {
            const radio = prepareRadio(
                WIKIDATA_CLAIMS[key],
                [ value.latitude, value.longitude],
                guidObj
            );
            if ( !radio.skip ) {
                syncValues.push(
                    radio
                );
            }
        } else {
            const radio = prepareRadio(
                WIKIDATA_CLAIMS[key],
                [ value ],
                guidObj
            );
            if ( !radio.skip ) {
                syncValues.push(
                    radio
                );
            }
        }
    }
    var wikipedia = wikidataWikipedia(jsonObj, wikidataRecord);
    syncValues.push(
        prepareRadio(
            {
                label: translate( "sharedWikipedia" ),
                fields: ['wikipedia'],
                doNotUpload: true,
                'remotely_sync': true
            },
            [wikipedia],
            $('#input-wikidata-value').val()
        )
    );

    return {
        name: 'ListingEditorSync',
        components: {
            ListingSyncRow
        },
        props: {
            syncValues: {
                type: Array,
                default: syncValues
            }
        },
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
    <listing-sync-row v-for="row in syncValues"
        :field="row.field"
        :guid="row.guid"
        :wikidataUrl="row.wikidataUrl"
        :localUrl="row.localUrl"
        :localText="row.localText"
        :wikidataText="row.wikidataText"
        :skip="row.skip"
        :remoteFlag="row.remoteFlag"
    ></listing-sync-row>
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
