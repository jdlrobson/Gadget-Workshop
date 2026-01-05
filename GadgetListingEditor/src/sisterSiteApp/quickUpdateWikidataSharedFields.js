const { LANG } = require( '../globalConfig.js' );
const { translate } = require( '../translate.js' );
const { iata } = require( '../templates.js' );
const trimDecimal = require( '../trimDecimal.js' );
const { getConfig } = require( '../Config.js' );
const updateFieldIfNotNull = require( './updateFieldIfNotNull.js' );

module.exports = function(wikidataRecord, SisterSite) {
    const { API_WIKIDATA, wikidataClaim, wikidataWikipedia,
        ajaxSisterSiteSearch } = SisterSite;
    const { WIKIDATA_CLAIMS, LISTING_TEMPLATES } = getConfig();
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
    return ajaxSisterSiteSearch(API_WIKIDATA, ajaxData ).then(  ajaxSuccess );
};