const asyncGetColor = ( listingType ) => {
    const colorKey = `listingeditor-color-${listingType}`;
    const cachedColor = mw.storage.get(colorKey);
    if ( cachedColor ) {
        return $.Deferred().resolve( cachedColor )
    }
    return $.ajax ({
        listingType,
        url: `${mw.config.get('wgScriptPath')}/api.php?${$.param({
            action: 'parse',
            prop: 'text',
            contentmodel: 'wikitext',
            format: 'json',
            disablelimitreport: true,
            'text': `{{#invoke:TypeToColor|convert|${listingType}}}`,
        })}`
    }).then( ( data ) => {
        let color = $(data.parse.text['*']).text().trim();
        if ( color ) {
            color = `#${color}`;
        }
        mw.storage.set( colorKey, color );
        return color;
    } );
};
module.exports = asyncGetColor;
