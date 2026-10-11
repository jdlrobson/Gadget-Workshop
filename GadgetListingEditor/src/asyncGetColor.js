const { getConfig } = require( './Config.js' );
const fetchPath = require( './fetchPath.js' );

/**
 * Invokes the TypeToColor module to get the color for a given listing type.
 * Returns wikitext that must be parsed.
 *
 * @param {string} listingType
 * @return {Promise<string>}
 */
const asyncGetColor = ( listingType ) => {
    const { DEFAULT_LISTING_COLOR } = getConfig();
    const colorKey = `listingeditor-color-${listingType}`;
    const cachedColor = mw.storage.get(colorKey);
    if ( cachedColor ) {
        return Promise.resolve( cachedColor );
    }
    const query = $.param({
        origin: '*',
        action: 'parse',
        prop: 'text',
        contentmodel: 'wikitext',
        format: 'json',
        disablelimitreport: true,
        'text': `{{#invoke:TypeToColor|convert|${listingType}}}`,
    });
    return fetchPath(`${mw.config.get('wgScriptPath')}/api.php?${query}`)
        .then( ( response ) => response.json() )
        .then( ( data ) => {
            console.log( 'Fetched color data:', data, data.parse.text['*'] );
            const nodeFragment = document.createElement( 'div' );
            nodeFragment.innerHTML = data.parse.text['*'];
            const color = ( nodeFragment.textContent || '' ).trim();
            // cache to avoid future lookup.
            const theColor = color ? `#${color}` : DEFAULT_LISTING_COLOR;
            mw.storage.set( colorKey, theColor );
            return theColor;
        } );
};
module.exports = asyncGetColor;
