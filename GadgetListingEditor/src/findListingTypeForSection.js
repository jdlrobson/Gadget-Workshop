module.exports = function(entry, sectionToTemplateType, defaultType) {
    let closestSection = entry.closest('div.mw-h2section, section');
    while ( closestSection.is( 'section' ) && closestSection.parents( 'section' ).length ) {
        // check it's the top level section.
        closestSection = closestSection.parent( 'section' );
    }
    const closestHeading = closestSection.find( '.mw-heading2 h2, h2 .mw-headline');
    const sectionType = closestHeading.attr('id');
    if ( !sectionType ) {
        // check for modern HTML.
    }
    for (var sectionId in sectionToTemplateType) {
        if (sectionType == sectionId) {
            return sectionToTemplateType[sectionId];
        }
    }
    return defaultType;
};
