// map section heading ID to the listing template to use for that section
module.exports = function ( config ) {
    if ( config.sectionType ) {
        return config.sectionType;
    }
    throw new Error( `Please define config.sectionType in [[MediaWikiGadget-ListingEditor.json]].
See https://en.wikivoyage.org/w/index.php?title=MediaWiki%3AGadget-ListingEditor.json for reference.` );
};
