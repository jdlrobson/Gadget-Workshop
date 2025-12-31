const { iata } = require( './templates.js' );
const prepareRadio = require( './prepareRadio.js' );
const trimDecimal = require( './trimDecimal.js' );
const { getConfig } = require( './Config.js' );
const { translate } = require( './translate.js' );

module.exports = ( jsonObj, wikidataRecord ) => {
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
    return syncValues;
};
