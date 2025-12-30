const parseDMS = require( './parseDMS.js' );
const { LANG } = require( './globalConfig.js' );
const { getConfig } = require( './Config.js' );

const prepareSyncValues = ( value, valBool ) => {
    return value.map( ( selectorOrValue ) => valBool ?
        $(selectorOrValue).val() : selectorOrValue );
};

const prepareSyncUrl = function(unprocessedValue, mode, valBool) {
    const value = prepareSyncValues( unprocessedValue, valBool );
    const { WIKIDATA_CLAIMS } = getConfig();
    let prefix = '';
    let suffix = '';
    switch(mode) {
        case WIKIDATA_CLAIMS.coords.p:
            prefix += 'https://geohack.toolforge.org/geohack.php?params=';
            prefix += value.map(v=>parseDMS(v)).join(';');
            suffix = ';_type:landmark'; // sets the default zoom
            break;
        case WIKIDATA_CLAIMS.image.p:
            prefix += `https://${LANG}.wikivoyage.org/wiki/File:`;
            prefix += value.map(v=>v).join('');
            break;
        default:
            prefix += value.map(v=>v).join('');
            break;
    }
    return `${prefix}${suffix}`;
};

const makeSyncLinks = function(unprocessedValue, mode, valBool) {
    const href = prepareSyncUrl( unprocessedValue, mode, valBool );
    return `<a target="_blank" rel="noopener noreferrer"href="${href}">`
};


module.exports = makeSyncLinks;
