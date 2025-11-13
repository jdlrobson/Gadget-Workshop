const parseDMS = require( './parseDMS.js' );
const { LANG } = require( './globalConfig.js' );

const makeSyncLinks = function(value, mode, valBool, Config) {
    const { WIKIDATA_CLAIMS } = Config;
    var htmlPart = '<a target="_blank" rel="noopener noreferrer"';
    var i;
    switch(mode) {
        case WIKIDATA_CLAIMS.coords.p:
            htmlPart += 'href="https://geohack.toolforge.org/geohack.php?params=';
            for (i = 0; i < value.length; i++) { htmlPart += `${parseDMS(valBool ? $(value[i]).val() : value[i])};`; }
            htmlPart += '_type:landmark">'; // sets the default zoom
            break;
        case WIKIDATA_CLAIMS.url.p:
            htmlPart += 'href="';
            for (i = 0; i < value.length; i++) { htmlPart += (valBool ? $(value[i]).val() : value[i]); }
            htmlPart += '">';
            break;
        case WIKIDATA_CLAIMS.image.p:
            htmlPart += `href="https://${LANG}.wikivoyage.org/wiki/File:`;
            for (i = 0; i < value.length; i++) { htmlPart += (valBool ? $(value[i]).val() : value[i]); }
            htmlPart += '">';
            break;
    }
    return htmlPart;
};

module.exports = makeSyncLinks;
