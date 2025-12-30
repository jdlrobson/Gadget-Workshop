module.exports = function( titles, SisterSite ) {
    const { API_WIKIPEDIA, ajaxSisterSiteSearch, wikipediaWikidata } = SisterSite;
    return ajaxSisterSiteSearch(
        API_WIKIPEDIA,
        {
            action: 'query',
            prop: 'pageprops',
            ppprop: 'wikibase_item',
            indexpageids: 1,
            titles
        }
    ).then( ( jsonObj ) => wikipediaWikidata(jsonObj) );
};
