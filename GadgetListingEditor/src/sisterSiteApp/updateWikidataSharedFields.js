const { LANG } = require( '../globalConfig.js' );

module.exports = function(
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
