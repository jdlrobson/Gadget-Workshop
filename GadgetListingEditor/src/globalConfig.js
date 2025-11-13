const PAGE_VIEW_LANGUAGE = mw.config.get( 'wgPageViewLanguage' );
const COMMONS_URL = '//commons.wikimedia.org';
const WIKIDATA_URL = '//www.wikidata.org';
const WIKIPEDIA_URL = `//${PAGE_VIEW_LANGUAGE}.wikipedia.org`;
const WIKIDATA_SITELINK_WIKIPEDIA = `${PAGE_VIEW_LANGUAGE}wiki`;

module.exports = {
    WIKIDATA_SITELINK_WIKIPEDIA,
    WIKIPEDIA_URL,
    WIKIDATA_URL,
    COMMONS_URL
};
