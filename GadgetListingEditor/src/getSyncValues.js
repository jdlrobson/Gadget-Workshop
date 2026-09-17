const { iata } = require( './templates.js' );
const prepareRadio = require( './prepareRadio.js' );
const trimDecimal = require( './trimDecimal.js' );
const { getConfig } = require( './Config.js' );
const { translate } = require( './translate.js' );

/**
 * Gets sync values from Wikidata record.
 * @param {MwApiWikidataEntityResponseJSON} jsonObj - The Wikidata JSON object.
 * @param {string} wikidataRecord - The Wikidata record.
 * @return {RadioDefinition[]} The sync values array.
 */
module.exports = ( jsonObj, wikidataRecord ) => {
    const SisterSite = require( './SisterSite.js' )();
    const { wikidataClaim, wikidataWikipedia } = SisterSite;
    const { WIKIDATA_CLAIMS } = getConfig();

    /** @type {Record<string,WikidataClaimRecord>} */
    const res = {};
    for (let key in WIKIDATA_CLAIMS) {
        // @ts-ignore
        res[key] = {};
        // @ts-ignore
        res[key].value = wikidataClaim(jsonObj, wikidataRecord, WIKIDATA_CLAIMS[key].p);
        // @ts-ignore
        res[key].guidObj = wikidataClaim(jsonObj, wikidataRecord,
            WIKIDATA_CLAIMS[key].p, true);
        if (key === 'iata') {
            if( res[key].value ) {
                // @ts-ignore
                res[key].value = iata.replace( '%s', res[key].value );
            }
        } else if (key === 'email') {
            if( res[key].value ) {
                // @ts-ignore
                res[key].value = res[key].value.replace('mailto:', '');
            }
        } else if (key === 'coords') {
            if ( res[key].value ) {
                // @ts-ignore
                res[key].value.latitude = trimDecimal(res[key].value.latitude, 6);
                // @ts-ignore
                res[key].value.longitude = trimDecimal(res[key].value.longitude, 6);
            }
        }
    }
    const syncValues = [];
    for (let key in res) {
        let value = res[key].value;
        const guidObj = res[key].guidObj;
        if (key === 'coords' && value) {
            // eslint-disable-next-line no-self-assign
            value = /** @type {CoordValue} */( value );
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
            // eslint-disable-next-line no-self-assign
            value = /** @type {string|null} */( value );
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
            // @ts-ignore
            $('#input-wikidata-value').val()
        )
    );
    return syncValues;
};
